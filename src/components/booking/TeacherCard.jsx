// components/teachers/TeacherCard.jsx
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"

export function TeacherCard({ teacher }) {
  const navigate = useNavigate()

  return (
    <Card className="group overflow-hidden rounded-[2rem] border-none shadow-lg hover:shadow-2xl transition-all duration-300 bg-white p-5">
      <div className="relative">
        <img 
          src={teacher.avatar || "/default-avatar.png"} 
          alt={teacher.firstName}
          className="w-full h-48 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
        />
        <Badge className="absolute top-3 right-3 bg-white/90 text-purple-700 hover:bg-white border-none backdrop-blur-md">
           {teacher.avgRating || "New"}
        </Badge>
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="text-xl font-bold text-slate-800">
          {teacher.firstName} {teacher.lastName}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2 min-h-[40px]">
          {teacher.bio || "No description provided."}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <div>
            <span className="text-xs text-slate-400 block uppercase font-bold tracking-tighter">Starting from</span>
            <span className="text-xl font-black text-[#6332E3]">${teacher.hourlyRate || 20}</span>
          </div>
          <Button 
            onClick={() => navigate(`/teachers/${teacher._id}/book`)}
            className="bg-[#6332E3] hover:bg-[#5229bc] rounded-xl px-6"
          >
            Book Now
          </Button>
        </div>
      </div>
    </Card>
  )
}