import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video, Clock, User, Calendar as CalendarIcon } from "lucide-react"

export function BookingRow({ booking, onJoin }) {
  
  const getBookingDetails = () => {
    const dateObj = new Date(booking.scheduledDate)
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })

    const [hours, minutes] = booking.scheduledTime.split(':').map(Number)
    const start = new Date()
    start.setHours(hours, minutes, 0)
    
    const end = new Date(start.getTime() + 60 * 60 * 1000)

    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true }
    
    return {
      date: formattedDate,
      timeRange: `${start.toLocaleTimeString([], timeOptions)} - ${end.toLocaleTimeString([], timeOptions)}`
    }
  }

  const { date, timeRange } = getBookingDetails()

  return (
    <div className="group flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-50 mb-4">
      <div className="flex items-center gap-6 w-full md:w-auto">
        <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#6332E3] shrink-0">
          <User size={32} />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-800 leading-none">
            {booking.studentId?.firstName} {booking.studentId?.lastName}
          </h3>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#6332E3] bg-purple-50 w-fit px-2.5 py-1 rounded-lg">
              <CalendarIcon size={12} />
              {date}
            </div>

            <div className="flex items-center gap-3 text-slate-500 text-sm">
              <span className="flex items-center gap-1.5 font-semibold bg-slate-50 px-2 py-1 rounded-md">
                <Clock size={14} className="text-indigo-400" />
                {timeRange}
              </span>
              <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold px-3 hover:bg-emerald-100">
                Confirmed
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 md:mt-0 flex items-center gap-4 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
        <div className="text-right hidden lg:block mr-4">
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Session Type</p>
          <p className="text-sm font-bold text-slate-700">1:1 Video Call</p>
        </div>
        
        <Button 
          onClick={() => onJoin(booking._id)}
          className="w-full md:w-auto bg-[#6332E3] hover:bg-[#5229bc] text-white rounded-2xl h-14 px-10 font-black shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all active:scale-95 hover:translate-y-[-2px]"
        >
          <Video size={20} />
          Join Session
        </Button>
      </div>
    </div>
  )
}