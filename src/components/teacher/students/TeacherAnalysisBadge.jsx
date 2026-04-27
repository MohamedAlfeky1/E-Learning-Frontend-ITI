import React from 'react'

function StudentAnalysisBadge({ title, number, icon, iconColor, iconBgColor, progress }) {
    return (
        <div className='shadow-lg shadow-[var(--chart-1)] px-4 py-6 rounded-md flex flex-col gap-3'>
            <div className=' flex justify-between items-start'>
                <div>
                    <p className='text-[var(--chart-2)] text-sm font-semibold'>{title}</p>
                    <p className='font-bold text-lg'>{number}</p>
                </div>
                <div>
                    <div
                        style={{ background: iconBgColor, color: iconColor }}
                        className='py-3 px-2 rounded-md'
                    >
                        {icon}
                    </div>

                </div>

            </div>

            {progress > 0 ? (
                <div className="w-full bg-[var(--muted)] rounded-full h-2">
                    <div
                        className="bg-[var(--primary)] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            ) : (
                ''
            )}

        </div>
    )
}

export default StudentAnalysisBadge
