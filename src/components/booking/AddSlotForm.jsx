import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

const TIME_OPTIONS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]

export function AddSlotForm({ onAdd }) {
  const [slot, setSlot] = useState({ startTime: "09:00", endTime: "10:00", price: 20 })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (slot.startTime >= slot.endTime) return toast.error("End time must be after start time")
    onAdd(slot)
    setSlot({ startTime: "09:00", endTime: "10:00", price: 20 })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Start Time</Label>
          <Select value={slot.startTime} onValueChange={(v) => setSlot({ ...slot, startTime: v })}>
            <SelectTrigger className="rounded-xl bg-slate-50 border-none h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_OPTIONS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">End Time</Label>
          <Select value={slot.endTime} onValueChange={(v) => setSlot({ ...slot, endTime: v })}>
            <SelectTrigger className="rounded-xl bg-slate-50 border-none h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_OPTIONS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Session Price ($)</Label>
        <Input 
          type="number" 
          value={slot.price} 
          onChange={(e) => setSlot({ ...slot, price: parseInt(e.target.value) })}
          className="rounded-xl bg-slate-50 border-none h-12 font-bold"
          min="0"
        />
      </div>

      <Button onClick={handleSubmit} className="w-full bg-[#6332E3] hover:bg-[#5229bc] rounded-2xl h-14 font-bold shadow-lg shadow-purple-100 transition-all active:scale-95">
        <Plus className="w-5 h-5 mr-2" /> Add Slot to List
      </Button>
    </div>
  )
}