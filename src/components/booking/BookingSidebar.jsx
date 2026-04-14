export function BookingSidebar({ teacher }) {
  return (
    <div className="w-full md:w-1/3 bg-[#6332E3] p-8 text-white flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <img 
          src={teacher.avatar || "/default-avatar.png"} 
          className="w-24 h-24 rounded-xl object-cover border-2 border-white/20 shadow-lg"
          alt={teacher.firstName}
        />
        <h2 className="text-2xl font-bold leading-tight">
          Book a 1:1 Session with {teacher.firstName} {teacher.lastName}
        </h2>
        <div className="flex gap-2 flex-wrap">
          <span className="bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-medium">
            ⭐ {teacher.avgRating || 4.8}/5 ({teacher.totalReviews || 0} reviews)
          </span>
        </div>
        <p className="text-white/80 text-sm mt-2 line-clamp-4 leading-relaxed">
          {teacher.bio}
        </p>
      </div>

      <div className="mt-auto space-y-6">
        <FeatureItem icon="⏰" title="60 Minute Session" desc="Deep dive into your topic" />
        <FeatureItem icon="🎥" title="Secure Video Call" desc="HD quality with PeerJS" />
        <FeatureItem icon="⭐" title="Expert Mentorship" desc={`${teacher.totalReviews}+ successful sessions`} />
      </div>
    </div>
  )
}

function FeatureItem({ icon, title, desc }) {
  return (
    <div className="flex gap-3 items-start group">
      <div className="text-2xl transition-transform group-hover:scale-110">{icon}</div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-white/70">{desc}</p>
      </div>
    </div>
  )
}