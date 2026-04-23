import { useTeacherEnrollmentDetailsQuery } from '@/queries/enrollmentQueries'
import React from 'react'
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount } from '../ui/avatar';
import { MdOutlineModeEditOutline ,MdBarChart } from "react-icons/md";
import { Link } from 'react-router-dom';

function TeacherActiveCoureCard({ course }) {
    const { data: enrollmentDetails } = useTeacherEnrollmentDetailsQuery(course?._id)
    const visibleStudents = enrollmentDetails?.slice(0, 3) ?? [];
    const extraCount = (enrollmentDetails?.length ?? 0) - visibleStudents.length;

    console.log(enrollmentDetails);
    


    return (
        <div className=" relative flex flex-col gap-3 rounded-md overflow-hidden bg-white">
            <img
                src={course.thumbnail}
                alt="Course Thumbnail"
                className="w-full h-[190px] object-cover"
            />
            <Badge variant='lightPruple' className='absolute top-5 right-3'>{enrollmentDetails?.length} ENROLLMENTS</Badge>
            <div className="p-3">
                <h2 className="font-semibold text-md">{course.title}</h2>
                {visibleStudents.length > 0 && (
                    <div className="flex items-center gap-2 py-2">
                        <AvatarGroup>
                            {visibleStudents.map((enrollment) => (
                                <Avatar key={enrollment._id} size="sm">
                                    <AvatarImage
                                        src={enrollment.studentId?.avatar}
                                        alt={enrollment.studentId?.firstName}
                                    />
                                    <AvatarFallback>
                                        {enrollment.studentId?.firstName?.[0]}
                                        {enrollment.studentId?.lastName?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                            ))}

                            {extraCount > 0 && (
                                <AvatarGroupCount>+{extraCount}</AvatarGroupCount>
                            )}
                        </AvatarGroup>
                    </div>
                )}

                <hr className='border-gray-200'/>
                <div className='flex justify-between items-center pt-3'>
                <Link to={`/teacher/courses/${course._id}/edit`} className='flex items-center gap-1 text-[var(--primary)]'>
                    <MdOutlineModeEditOutline size={20}/> <span className='font-semibold text-xs'>Edit COURSE</span> 
                </Link>  
                <div className='flex items-center gap-2 text-[var(--chart-4)]'>
                    <MdBarChart/>
                    <span className='font-semibold text-xs'>STATS</span></div>  
                </div>
            </div>
        </div>
    )
}

export default TeacherActiveCoureCard
