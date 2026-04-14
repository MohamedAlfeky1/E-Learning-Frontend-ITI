
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "sonner" 
import { formatTime } from "@/data/data-utils"
import { sessionService } from "@/services/sessionService"
import { TimeSlotPicker } from "@/components/booking/TimeslotPiker"
import { BookingSidebar } from "@/components/booking/BookingSidebar"

export default function BookingPage() {
  const { teacherId } = useParams()
  const navigate = useNavigate()

  const [teacher, setTeacher] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [topic, setTopic] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)

  // جلب بيانات المعلم
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await sessionService.getTeachers()
        const teacherData = response.data.data.find(t => t._id === teacherId)
        console.log(teacherData);
        
        setTeacher(teacherData)
      } catch (error) {
        console.error("Failed to fetch teacher:", error)
        toast.error("Could not load teacher details")
      }
    }
    fetchTeacher()
  }, [teacherId])

  // جلب المواعيد المتاحة
  useEffect(() => {
    if (!teacherId || !selectedDate) return

    const fetchAvailability = async () => {
      setLoadingSlots(true)
      setSelectedSlot(null) // تصفير الموعد المختار عند تغيير التاريخ
      try {
        // استخدام تنسيق تاريخ آمن
        const offset = selectedDate.getTimezoneOffset()
        const adjustedDate = new Date(selectedDate.getTime() - (offset * 60 * 1000))
        const formattedDate = adjustedDate.toISOString().split('T')[0]

        const response = await sessionService.getTeacherAvailability(teacherId, formattedDate)
        console.log("teacher slots:", response.data.data.slots);
        setAvailableSlots(response.data.data.slots || [])
      } catch (error) {
        console.error("Failed to fetch availability:", error)
      } finally {
        setLoadingSlots(false)
      }
    }

    fetchAvailability()
  }, [teacherId, selectedDate])

  const handleBooking = async () => {
    if (!selectedSlot) return toast.warning("Please select a time slot")
    if (!topic.trim()) return toast.warning("Please describe your requirements")

    setLoading(true)
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0]
      const response = await sessionService.bookSession({
        teacherId,
        availabilityId: selectedSlot._id,
        scheduledDate: formattedDate,
        scheduledTime: selectedSlot.startTime,
        topic
      })

      toast.success("Redirecting to checkout...")
      navigate(`/checkout?bookingId=${response.data.data._id}`)
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed")
    } finally {
      setLoading(false)
    }
  }

  if (!teacher) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#6332E3]"></div>
      </div>
    )
  }

  return (
    <Card className="flex flex-col md:flex-row max-w-5xl overflow-hidden rounded-[2.5rem] border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] mx-auto my-12 animate-in fade-in duration-500">
      
      <BookingSidebar  teacher={teacher} />

      <div className="w-full md:w-2/3 bg-white p-6 md:p-10 lg:p-14 space-y-10">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-[#6332E3] rounded-full" />
            <label className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">What's on your mind?</label>
          </div>
          <Textarea 
            placeholder="Type your questions here..."
            className="bg-slate-50 border-none min-h-[120px] rounded-[1.5rem] focus-visible:ring-2 focus-visible:ring-[#6332E3]/20 p-5 text-slate-700 placeholder:text-slate-300"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <section className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">1. Select Date</label>
            <Calendar 
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-3xl border border-slate-50 p-4 shadow-sm"
              disabled={{ before: new Date() }}
            />
          </section>

          <section className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">2. Select Time</label>
            <TimeSlotPicker 
              slots={availableSlots}
              selectedSlot={selectedSlot}
              onSelect={setSelectedSlot}
              isLoading={loadingSlots}
              formatTime={formatTime}
            />
          </section>
        </div>

        <footer className="pt-8 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Investment</span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-[#1A1A1A]">${selectedSlot?.price || 0}</span>
              <span className="text-slate-400 font-medium">/session</span>
            </div>
          </div>
          
          <div className="flex gap-4 w-full sm:w-auto">
            <Button 
              variant="ghost" 
              className="flex-1 sm:flex-none font-bold text-slate-400 hover:text-slate-600 rounded-2xl h-14"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            <Button 
              className="flex-1 sm:flex-none bg-[#6332E3] hover:bg-[#5229bc] px-12 h-16 rounded-[1.25rem] font-bold text-lg shadow-[0_12px_24px_-6px_rgba(99,50,227,0.3)] transition-all active:scale-95"
              onClick={handleBooking}
              disabled={loading || !selectedSlot || !topic.trim()}
            >
              {loading ? "Securing slot..." : "Confirm Booking"}
            </Button>
          </div>
        </footer>
      </div>
    </Card>
  )
}