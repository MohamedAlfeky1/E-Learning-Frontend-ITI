import { Badge } from '@/components/ui/badge'
import React from 'react'
import { FaStar } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import { Link } from 'react-router-dom';


function NewCourseCard({ course }) {
    return (
        <div className="relative h-80 flex flex-col md:flex-row overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100 cursor-pointer hover:shadow-lg transition-shadow duration-300 max-w-2xl">

            {/* Thumbnail */}
            <div className="w-full md:w-2/5 h-48 md:h-auto overflow-hidden">
                <img
                    src={course.thumbnail}
                    alt="Course Thumbnail"
                    className="w-full h-full object-cover"
                />
                <Link to={`/courses/${course._id}`} className="absolute top-3 right-3 bg-gray-200 text-gray-200 p-1 rounded-full">
                    <FaRegEye color='#3525CD' />
                </Link>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-3 p-5 flex-1">

                {/* Badge + Rating */}
                <div className="flex items-center gap-3">
                    <Badge variant='new'>
                        New Course
                    </Badge>
                    <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
                        <FaStar className="text-green-600 w-3.5 h-3.5" />
                        {course.totalReviews ?? "4.9"}
                        <span className="text-gray-400 font-normal">({course.ratingCount ?? "2.1k"})</span>
                    </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 leading-snug">
                    {course.title}
                </h2>

                {/* Description */}
                <p className="text-sm text-gray-500 leading-relaxed">
                    {course.description?.split(" ").slice(0, 8).join(" ")}...
                </p>

                {/* Instructor */}
                <div className="flex items-center gap-2">
                    {course.teacherId?.avatar ? (
                        <img
                            src={course.teacherId.avatar}
                            alt={course.teacherId.firstName}
                            className="w-8 h-8 object-cover rounded-full"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                            {`${course.teacherId?.firstName?.[0] || ""}${course.teacherId?.lastName?.[0] || ""}`}
                        </div>
                    )}
                    <span className="text-sm font-medium text-[#141B2B] rounded-md px-2 py-0.5">
                        Dr. {course.teacherId?.firstName} {course.teacherId?.lastName}
                    </span>
                </div>

                {/* Price + Enroll */}
                <div className="flex flex-col md:flex-row items-center gap-5 mt-auto pt-2">
                    {course.type === 'paid' ?
                        <div className='flex flex-row items-center gap-3'>
                            <span className="text-2xl font-bold text-[#3525CD]">
                                ${course.price ?? "129.99"}
                            </span>
                            <button className="bg-indigo-600 hover:bg-[#3525CD] text-white text-sm font-semibold px-5 py-2 rounded-md transition-colors duration-200">
                                Enroll Now
                            </button>
                        </div> :
                        <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2 rounded-md transition-colors duration-200">
                            Enroll Now
                        </button>
                    }

                </div>

            </div>
        </div >
    );
}

export default NewCourseCard;
