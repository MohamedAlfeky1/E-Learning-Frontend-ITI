import React, { useEffect, useState } from 'react'
import { sessionService } from "@/services/sessionService"
import { toast } from "sonner"
import { Loader2, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { TeacherSlotCard } from '@/components/booking/TeacherSlotCard'

export default function AvailableSlotsPage() {
    const [slots, setSlots] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchMySlots = async () => {
            try {
                const response = await sessionService.getAvailability()
                setSlots(response.data.data || [])
            } catch (error) {
                console.error(error)
                toast.error("Failed to load your schedule")
            } finally {
                setLoading(false)
            }
        }
        fetchMySlots()
    }, [])

    const handleDelete = async (id) => {
        try {
            await sessionService.deleteAvailability(id)
            setSlots(slots.filter(s => s._id !== id))
            toast.success("Slot removed")
        } catch (e) {
            console.error(e)
            toast.error("Error deleting slot")
        }
    }

    return (
        <div className="min-h-screen bg-[#FBFBFF] py-12 px-6">
            <div className="max-w-5xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Availability</h1>
                        <p className="text-slate-500 font-medium">Manage your recurring weekly sessions and status.</p>
                    </div>
                    <Button 
                        onClick={() => navigate('/teacher/availability')}
                        className="bg-[#6332E3] hover:bg-[#5229bc] rounded-2xl h-14 px-6 font-bold shadow-lg shadow-purple-100 flex items-center gap-2"
                    >
                        <PlusCircle size={20} />
                        Add New Slots
                    </Button>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-[#6332E3]" size={40} />
                    </div>
                ) : slots.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                        <p className="text-slate-400 font-bold italic">You haven't added any slots yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {slots.map((slot) => (
                            <TeacherSlotCard 
                                key={slot._id} 
                                slot={slot} 
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}