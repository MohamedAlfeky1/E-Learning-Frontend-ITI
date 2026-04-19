import React from 'react'

function StudentDashboardCart({ icon, spanNum, word, title, length, wordColor="text-green-900" , badgeColor='bg-[#dbc8fa]' }) {
    return (
        <div className="bg-white rounded-md p-4 flex flex-col justify-center gap-3 w-[220px]">
            <div className="flex justify-between items-start">
                <div className={`w-10 flex justify-center ${badgeColor} p-2 rounded-md text-[var(--primary)]`}>
                    {icon}
                </div>
                {(spanNum || word) && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wide ${wordColor}`}>
                        {spanNum ? `+${spanNum} ` : ''}{word}
                    </span>
                )}
            </div>
            <h3 className="text-[var(--chart-3)] text-xs uppercase tracking-widest">{title}</h3>
            <h3 className="text-2xl font-extrabold">{length ?? '—'}</h3>
        </div>
    )
}
export default StudentDashboardCart
