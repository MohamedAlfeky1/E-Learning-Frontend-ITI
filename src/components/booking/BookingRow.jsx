import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video, Clock, User } from "lucide-react"

export function BookingRow({ booking, onJoin }) {
  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="group flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-50">
      <div className="flex items-center gap-6 w-full md:w-auto">
        <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#6332E3]">
          <User size={32} />
        </div>
        
        <div className="space-y-1">
          <h3 className="text-xl font-black text-slate-800">
            {booking.studentName || "Student Name"}
          </h3>
          <div className="flex items-center gap-4 text-slate-500 text-sm">
            <span className="flex items-center gap-1 font-medium">
              <Clock size={14} className="text-indigo-400" />
              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
            </span>
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-none font-bold px-3">
              Confirmed
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-6 md:mt-0 flex items-center gap-4 w-full md:w-auto">
        <div className="text-right hidden md:block mr-4">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Session Type</p>
          <p className="text-sm font-bold text-slate-700">1:1 Video Call</p>
        </div>
        
        <Button 
          onClick={() => onJoin(booking._id)}
          className="w-full md:w-auto bg-[#6332E3] hover:bg-[#5229bc] text-white rounded-xl h-14 px-8 font-black shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all hover:scale-105"
        >
          <Video size={20} />
          Join Session
        </Button>
      </div>
    </div>
  )
}