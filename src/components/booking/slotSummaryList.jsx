import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export function SlotSummaryList({ slots, onRemove }) {
  if (slots.length === 0) {
    console.log("slots", slots)
    return (
      <div className="h-40 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-[2rem] text-slate-300 italic text-center px-4">
        No slots added yet for this day. Add your first availability!
      </div>
    )
    
  }

  return (
    <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
      {slots.map((s) => (
        <div key={s.id} className="group flex items-center justify-between bg-slate-50 p-5 rounded-[1.5rem] hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
          <div>
            <p className="font-black text-slate-800 text-lg">{s.startTime} - {s.endTime}</p>
            {console.log("s" , s)}
            <p className="text-[#6332E3] font-bold text-sm">${s.price} per session</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onRemove(s.id)} 
            className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      ))}
    </div>
  )
}