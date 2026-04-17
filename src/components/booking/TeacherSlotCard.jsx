import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, Trash2, UserCheck, Unlock, History } from "lucide-react"

export function TeacherSlotCard({ slot, onDelete }) {
  const getDayName = (dayIndex) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isBooked = slot.isBooked;

  return (
    <Card className={`p-6 rounded-[2.5rem] border-none shadow-sm transition-all hover:shadow-md bg-white border ${isBooked ? 'border-indigo-100 bg-indigo-50/20' : 'border-slate-100'}`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-6 w-full">
          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${isBooked ? 'bg-indigo-100 text-[#6332E3]' : 'bg-slate-100 text-slate-400'}`}>
            {isBooked ? <UserCheck size={28} /> : <Unlock size={28} />}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
            <div className="space-y-1">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Schedule</p>
              <div className="font-bold text-slate-800 flex flex-col">
                <span className="flex items-center gap-1.5 text-[#6332E3]">
                  <Calendar size={14} /> {getDayName(slot.dayOfWeek)}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                  <Clock size={14}/> {slot.startTime} - {slot.endTime}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Added On</p>
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <History size={14} className="text-slate-400" />
                {formatDate(slot.createdAt)}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Price</p>
              <p className="font-black text-lg text-slate-900">${slot.price}</p>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Status</p>
              {isBooked ? (
                <Badge className="bg-[#6332E3] text-white border-none font-bold px-3 py-1 shadow-sm shadow-indigo-100">
                  Booked
                </Badge>
              ) : (
                <Badge variant="outline" className="text-slate-400 border-slate-200 font-bold px-3 py-1">
                  Available
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {!isBooked && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onDelete(slot._id)}
              className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash2 size={20} />
            </Button>
          )}
          {isBooked && (
            <div className="bg-indigo-50 px-3 py-2 rounded-xl">
               <p className="text-[10px] font-black text-indigo-400 uppercase leading-none">Reserved</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}