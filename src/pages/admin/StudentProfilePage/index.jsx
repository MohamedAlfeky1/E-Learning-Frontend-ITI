import { useParams } from "react-router-dom";
import { useStudentProfileQuery } from "@/queries/adminStudentQueries";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const StudentProfilePage = () => {
  const { id } = useParams();

  const { data, isLoading } = useStudentProfileQuery(id);

  const student = data?.data?.user;
  const courses = data?.data?.courses || [];

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-40 w-full rounded-3xl" />
      </div>
    );
  }

  if (!student) {
    return <div className="p-6">Student not found</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-muted/20 min-h-screen">

      <Card className="rounded-3xl shadow-md">
        <CardContent className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

            <Avatar className="h-20 w-20 md:h-24 md:w-24 rounded-2xl">
              <AvatarImage src={student.avatar} />
              <AvatarFallback className="text-lg md:text-xl">
                {student.firstName?.[0]}
                {student.lastName?.[0]}
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-lg md:text-2xl font-bold">
                {student.firstName} {student.lastName}
              </h2>

              <p className="text-sm md:text-base text-muted-foreground">
                {student.email}
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                <Badge>{student.role}</Badge>
                <Badge
                  variant={
                    student.status === "active"
                      ? "success"
                      : "destructive"
                  }
                >
                  {student.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm w-full md:w-auto">

            <div className="bg-muted/40 p-3 rounded-xl">
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium">
                {student.phone || "N/A"}
              </p>
            </div>

            <div className="bg-muted/40 p-3 rounded-xl">
              <p className="text-muted-foreground">Joined</p>
              <p className="font-medium">
                {student.createdAt
                  ? new Date(student.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

          </div>

        </CardContent>
      </Card>

      <Card className="rounded-3xl shadow-md">
        <CardContent className="p-4 md:p-6 space-y-4">

          <h3 className="text-lg md:text-xl font-bold text-primary">
            Enrolled Courses ({courses.length})
          </h3>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              {courses.map((item) => (
                <div
                  key={item.enrollmentId}
                  className="border rounded-2xl overflow-hidden bg-card hover:shadow-lg transition"
                >

                  <div className="h-36 sm:h-40 w-full bg-muted">
                    {item.course?.thumbnail ? (
                      <img
                        src={item.course.thumbnail}
                        alt={item.course.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-3 md:p-4 space-y-2">

                    <h4 className="font-semibold text-base md:text-lg">
                      {item.course?.title}
                    </h4>

                    <p className="text-xs md:text-sm text-muted-foreground">
                      {item.course?.description?.slice(0, 90)}...
                    </p>

                    <div className="flex justify-between items-center mt-2">

                      <Badge variant="outline">
                        {item.course?.level || "Beginner"}
                      </Badge>

                      <span className="text-xs md:text-sm font-semibold text-primary">
                        {item.course?.price === 0
                          ? "Free"
                          : `${item.course?.price} $`}
                      </span>

                    </div>

                    <div className="mt-3">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{
                            width: `${item.progress || 0}%`,
                          }}
                        />
                      </div>

                      <p className="text-xs text-muted-foreground mt-1">
                        {item.progress || 0}% completed
                      </p>
                    </div>

                  </div>
                </div>
              ))}

            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No courses enrolled yet.
            </p>
          )}

        </CardContent>
      </Card>

    </div>
  );
};

export default StudentProfilePage;