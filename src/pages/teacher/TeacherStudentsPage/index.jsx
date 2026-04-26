import Loader from '@/components/ui/loader'
import { useTeacherCoursesQuery } from '@/queries/enrollmentQueries'
import { enrollmentService } from '@/services/enrollmentService';
import { useQueries } from '@tanstack/react-query';
import { IoIosPeople } from "react-icons/io";
import { RiVerifiedBadgeLine } from "react-icons/ri";
import React from 'react'
import StudentAnalysisBadge from '@/components/teacher/students/TeacherAnalysisBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useGetCoursesById } from '@/queries/useCourses';
import CourseTitle from '@/components/teacher/students/CourseTitle';

function TeacherStudentsPage() {
    const { data: teacherCourses, isLoading, error } = useTeacherCoursesQuery()
    const { data: courseData } = useGetCoursesById()

    const coursesId = teacherCourses?.map((item) => item._id) || [];
    const enrollmentQueries = useQueries({
        queries: coursesId.map((id) => ({
            queryKey: ["enrollments", id],
            queryFn: () => enrollmentService.getTeacherEnrollmentByCourseId(id),
            enabled: !!id,
        })),
    });

    const allEnrollments = enrollmentQueries?.map((query) => query.data)
        .filter(Boolean)
        .flat();

    const avgCompletion = allEnrollments?.length > 0
        ? Math.round(
            allEnrollments.reduce((sum, item) => sum + (item.progress ?? 0), 0) / allEnrollments.length
        )
        : 0;
    console.log("allEnrollments", allEnrollments);




    if (isLoading) return <div className="min-h-full min-w-full flex justify-center items-center"><Loader /></div>
    return (
        <div className='p-6 flex flex-col gap-3'>

            <h1 className='font-bold text-2xl'>Enrolled Students</h1>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <StudentAnalysisBadge title='Total Enrolled' number={allEnrollments?.length} icon={<IoIosPeople size={23} />} iconBgColor='rgba(74, 31, 217,0.2)' iconColor='#4a1fd9' progress='' />

                <StudentAnalysisBadge title='Completion Rate' number={`${avgCompletion}%`} icon={<RiVerifiedBadgeLine size={23} />} iconBgColor='rgba(0, 85, 35,.2)' iconColor='rgb(0, 85, 35)' progress={avgCompletion} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-gray-100">
                            <TableHead className="text-xs font-semibold text-gray-400 tracking-widest uppercase px-6 py-4">
                                STUDENT
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
                                ENROLLED COURSE
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
                                ENROLLMEND DATE
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
                                PROGRESS
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-gray-400 tracking-widest uppercase text-right px-6">
                                STATUS
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {allEnrollments?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-gray-400">
                                    No students enrolled yet.
                                </TableCell>
                            </TableRow>
                        )}

                        {allEnrollments?.map((enrollment) => (
                            <TableRow
                                key={enrollment._id}
                                className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                            >
                                {/* STUDENT */}
                                <TableCell className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {enrollment.studentId?.avatar ? (
                                            <img
                                                src={enrollment.studentId.avatar}
                                                alt={enrollment.studentId.firstName}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="w-10 h-10 flex items-center justify-center text-sm font-medium text-gray-600 bg-gray-200 rounded-full">
                                                {`${enrollment.studentId?.firstName?.[0] || ""}${enrollment.studentId?.lastName?.[0] || ""}`}
                                            </span>
                                        )}
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {enrollment.studentId?.firstName + " " + enrollment.studentId?.lastName}
                                            </p>
                                            <p className="text-sm text-blue-500">
                                                {enrollment.studentId?.email}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>

                                {/* ENROLLED COURSE */}
                                <TableCell>
                                    <CourseTitle courseId={enrollment.courseId} />
                                </TableCell>

                                {/* ENROLLMENT DATE */}
                                <TableCell className="text-gray-500 text-sm">
                                    {enrollment.enrolledAt
                                        ? new Date(enrollment.enrolledAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                        : "—"}
                                </TableCell>

                                {/* PROGRESS */}
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 bg-gray-100 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full bg-[var(--primary)] transition-all duration-500"
                                                style={{ width: `${enrollment.progress ?? 0}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                            {enrollment.progress ?? 0}%
                                        </span>
                                    </div>
                                </TableCell>

                                {/* STATUS */}
                                <TableCell className="text-right px-6">
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${enrollment.completed
                                        ? "bg-purple-100 text-purple-600"
                                        : enrollment.progress > 0
                                            ? "bg-green-100 text-green-600"
                                            : "bg-gray-100 text-gray-500"
                                        }`}>
                                        {enrollment.completed
                                            ? "Completed"
                                            : enrollment.progress > 0
                                                ? "Active"
                                                : "Not Started"}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Footer */}
                <div className="flex items-center justify-between px-6  text-sm text-gray-400">
                    {/* <span>
                        Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                        {Math.min(currentPage * ITEMS_PER_PAGE, allRequests.length)} of{" "}
                        {allRequests.length} applications
                    </span> */}

                    {/* <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    className={
                                        currentPage === 1
                                            ? "pointer-events-none opacity-50"
                                            : "cursor-pointer"
                                    }
                                />
                            </PaginationItem>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                (page) => (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            isActive={page === currentPage}
                                            onClick={() => setCurrentPage(page)}
                                            className="cursor-pointer"
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                ),
                            )}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() =>
                                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                                    }
                                    className={
                                        currentPage === totalPages
                                            ? "pointer-events-none opacity-50"
                                            : "cursor-pointer"
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination> */}
                </div>
            </div>

        </div>



    )
}

export default TeacherStudentsPage
