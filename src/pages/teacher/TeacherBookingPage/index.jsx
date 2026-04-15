import { useEffect, useState } from "react"
import { sessionService } from "@/services/sessionService"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { BookingRow } from "@/components/booking/BookingRow"

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await sessionService.getTeacherBookings()
        setBookings(response.data.data || [])
      } catch (error) {
        toast.error("Failed to load your bookings")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const handleJoinSession = (bookingId) => {
    toast.info("Joining video call...")
   
    navigate(`/sessions/join/${bookingId}`)
  }

  if (loading) return (
    <div className="container mx-auto py-20 px-4 space-y-4">
      {[1, 2, 3].map(i => <div key={i} className="h-24 w-full bg-slate-100 animate-pulse rounded-[2rem]" />)}
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-900">Upcoming Sessions</h1>
          <p className="text-slate-500 mt-2">Manage your schedule and join your video classes.</p>
        </header>

        <div className="space-y-6">
          {bookings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">No bookings found for today.</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <BookingRow 
                key={booking._id} 
                booking={booking} 
                onJoin={handleJoinSession} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}