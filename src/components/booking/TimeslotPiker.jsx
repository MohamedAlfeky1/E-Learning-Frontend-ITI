import { Button } from "@/components/ui/button"

export function TimeSlotPicker({ slots, selectedSlot, onSelect, isLoading, formatTime }) {
  if (isLoading) return <div className="text-center py-8 text-slate-400 animate-pulse">Searching available slots...</div>;
  
  if (slots.length === 0) return (
    <div className="text-center py-8 px-4 bg-slate-50 rounded-xl text-slate-400 border-2 border-dashed font-medium">
      No slots found for this date.
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-3 mt-3">
      {slots.map((slot) => (
        <Button 
          key={slot._id}
          variant={selectedSlot?._id === slot._id ? 'default' : 'secondary'}
          className={`rounded-xl h-12 transition-all duration-200 ${
            selectedSlot?._id === slot._id 
              ? 'bg-[#3A33D1] scale-105 shadow-md' 
              : 'bg-[#F1F4FF] text-slate-900 hover:bg-[#e2e8ff]'
          }`}
          onClick={() => !slot.isBooked && onSelect(slot)}
          disabled={slot.isBooked}
        >
          {formatTime(slot.startTime)}
        </Button>
      ))}
    </div>
  )
}