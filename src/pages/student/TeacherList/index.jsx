// pages/TeachersPage.jsx
import { useEffect, useState } from "react"
import { sessionService } from "@/services/sessionService"
import { TeacherCard } from "@/components/booking/TeacherCard"

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await sessionService.getTeachers()
        setTeachers(response.data.data)
      } catch (error) {
        console.error("Failed to load teachers", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTeachers()
  }, [])

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-80 bg-slate-100 animate-pulse rounded-[2rem]" />
      ))}
    </div>
  )

  return (
    <div className="container mx-auto py-12 px-4">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Find Your Perfect Mentor</h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          Choose from our top-rated instructors and book a 1:1 session to boost your skills.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {teachers.map((teacher) => (
          <TeacherCard key={teacher._id} teacher={teacher} />
        ))}
      </div>
    </div>
  )
}