import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { sessionService } from "@/services/sessionService"
import { toast } from "sonner"
import { CalendarDays } from "lucide-react"
import { DayInfoCard } from "@/components/booking/DayInfoCard"
import { AddSlotForm } from "@/components/booking/AddSlotForm"
import { SlotSummaryList } from "@/components/booking/SlotSummaryList"

export default function TeacherAvailabilityPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [slots, setSlots] = useState([])
  const [publishing, setPublishing] = useState(false)

  const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' })

  const addSlot = (newSlot) => setSlots([...slots, { ...newSlot, id: Date.now() }])
  const removeSlot = (id) => setSlots(slots.filter(s => s.id !== id))

  const handlePublish = async () => {
    if (slots.length === 0) return toast.warning("Add some slots first")
    setPublishing(true)
    
    let successCount = 0
    const dayOfWeek = selectedDate.getDay()

    for (const slot of slots) {
      try {
        await sessionService.addAvailability({
          dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          price: slot.price
        })
        successCount++
      } catch (e) { 
        toast.error("this slot already avalable")
        console.error(e)
       }
    }

    if (successCount > 0) {
      toast.success(`${successCount} slots published for ${dayName}`)
      setSlots([])
    }
    setPublishing(false)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Left Side: Setup */}
        <section className="space-y-8">
          <Card className="p-8 rounded-[2.5rem] border-none shadow-2xl bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CalendarDays className="text-[#6332E3] w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Set Schedule</h2>
            </div>
            
            <Calendar 
              mode="single"
              selected={selectedDate}
              onSelect={(d) => d && setSelectedDate(d)}
              className="rounded-3xl border border-slate-50 mb-8 mx-auto shadow-sm"
              disabled={{ before: new Date() }}
            />
            
            <DayInfoCard date={selectedDate} dayName={dayName} />
            <AddSlotForm onAdd={addSlot} />
          </Card>
        </section>

        {/* Right Side: Summary */}
        <section>
          <Card className="p-8 rounded-[2.5rem] border-none shadow-2xl bg-white h-full flex flex-col">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-800">Preview</h2>
              <p className="text-slate-400 text-sm mt-1">Review your slots before publishing</p>
            </div>

            <SlotSummaryList slots={slots} onRemove={removeSlot} selectedDate={selectedDate} />

            <div className="mt-auto pt-8">
              <Button 
                onClick={handlePublish}
                disabled={publishing || slots.length === 0}
                className="w-full bg-green-600 hover:bg-green-700 rounded-2xl h-16 font-black text-lg shadow-lg shadow-green-100 transition-all hover:translate-y-[-2px] disabled:opacity-50"
              >
                {publishing ? "Publishing..." : `Confirm ${slots.length} Slots`}
              </Button>
            </div>
          </Card>
        </section>

      </div>
    </div>
  )
}