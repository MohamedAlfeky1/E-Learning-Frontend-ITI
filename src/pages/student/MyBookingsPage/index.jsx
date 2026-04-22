import { useEffect, useState } from "react"
import { sessionService } from "@/services/sessionService"
import { toast } from "sonner"
import { BookingRow } from "@/components/booking/BookingRow"
import { useNavigate } from "react-router-dom";
import Loader from "@/components/ui/loader";

export default function StudentBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const response = await sessionService.getMyBookings()
        setBookings(response.data.data || [])
      } catch (error) {
        toast.error(error,"Failed to load your sessions")
      } finally {
        setLoading(false)
      }
    }
    fetchMyBookings()
  }, [])

  const handleJoin = (bookingId) => {
    toast.info("Joining video call...")
    navigate(`/videoCall/${bookingId}`)
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-slate-900">My Learning Sessions</h1>
        <p className="text-slate-500">Track your upcoming classes and meet your mentors.</p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <Loader />
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 text-slate-400">
          You haven't booked any sessions yet.
        </div>
      ) : (
        bookings.map(booking => (
          <BookingRow 
            key={booking._id} 
            booking={booking} 
            onJoin={handleJoin} 
            role="student" 
          />
        ))
      )}
    </div>
  )
}