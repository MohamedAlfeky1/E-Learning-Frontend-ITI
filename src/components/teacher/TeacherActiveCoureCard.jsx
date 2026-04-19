import { useTeacherEnrollmentDetailsQuery } from '@/queries/enrollmentQueries'
import React from 'react'
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount } from '../ui/avatar';

function TeacherActiveCoureCard({ course }) {
    const { data: enrollmentDetails } = useTeacherEnrollmentDetailsQuery(course?._id)
    const visibleStudents = enrollmentDetails?.slice(0, 3) ?? [];
    const extraCount = (enrollmentDetails?.length ?? 0) - visibleStudents.length;


    return (
        <div className=" relative flex flex-col gap-3 rounded-md overflow-hidden bg-white">
            <img
                src={course.thumbnail}
                alt="Course Thumbnail"
                className="w-full h-[190px] object-cover"
            />
            <Badge variant='lightPruple' className='absolute top-5 right-3'>{course.totalStudents} ENROLLMENTS</Badge>
            <div className="p-3">
                <h2 className="font-semibold text-md">{course.title}</h2>
                {visibleStudents.length > 0 && (
                    <div className="flex items-center gap-2">
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
            </div>
        </div>
    )
}

export default TeacherActiveCoureCard
