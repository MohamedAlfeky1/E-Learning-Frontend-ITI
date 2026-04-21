import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { EditIcon, StatsIcon } from "@/pages/teacher/TeacherDashboardPage/icons";
import CourseStatsSheet from "./CourseStatsSheet";

export const CourseCard = ({ course }) => {
  const [statsOpen, setStatsOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_20px_40px_-12px_rgba(20,27,43,0.04)] flex flex-col">
        <div className="relative h-48 overflow-hidden">
          {course.image ? (
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-800 to-slate-950" />
          )}
          <Badge className="absolute top-4 right-4 rounded-full bg-white/70 border border-white/20 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-[0.5px] text-indigo-700">
            {course.enrollments} Enrollments
          </Badge>
        </div>
        <div className="p-6 flex flex-col gap-2 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className="text-slate-950 text-base font-bold leading-5 flex-1"
              style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}
            >
              {course.title}
            </h3>
          </div>
          <div className="flex items-center gap-3 pb-2">
            <AvatarGroup>
              <Avatar>
                <AvatarFallback>AL</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>EM</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
            </AvatarGroup>
            <span className="text-slate-600 text-xs font-medium">
              +{course.othersStudying} others studying
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4 mt-2">
            <Link to={`/teacher/courses/${course.id}/edit`}>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 uppercase tracking-[0.6px] text-indigo-700"
              >
                <EditIcon />
                Edit Course
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 uppercase tracking-[0.6px] text-slate-600 hover:text-indigo-700"
              onClick={() => setStatsOpen(true)}
            >
              <StatsIcon />
              Stats
            </Button>
          </div>
        </div>
      </div>

      <CourseStatsSheet
        course={course}
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
      />
    </>
  );
};
