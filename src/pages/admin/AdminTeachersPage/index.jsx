import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import {
  Users,
  CheckCircle,
  XCircle,
  Sparkles,
  MoreVertical,
  AlertCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { useTeachersQuery } from "@/queries/adminTeacherQueries";
import {
  useDeleteTeacherMutation,
  useToggleTeacherStatusMutation,
} from "@/mutations/adminTeacherMutations";

// shadcn components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import StatCardAdminTeacher from "@/components/admin/StatsCartAdminTeacher";

const AdminTeachersPage = () => {
  const [params, setParams] = useState({ page: 1, limit: 8 });
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useTeachersQuery(params);
  const { mutate: deleteTeacher } = useDeleteTeacherMutation();
  const { mutate: toggleStatus } = useToggleTeacherStatusMutation();

  const teachers = data?.data?.users || [];
  const pagination = data?.data?.pagination || {};

  const filteredTeachers = teachers.filter((t) =>
    `${t.firstName} ${t.lastName} ${t.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );


  const totalTeachers = pagination.totalUsers || teachers.length;
  const activeTeachers = teachers.filter((t) => t.status === "active").length;
  const suspendedTeachers = teachers.filter(
    (t) => t.status === "suspended",
  ).length;
  const pendingOrNew = teachers.filter((t) =>
    ["new", "pending"].includes(t.status),
  ).length;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setParams((prev) => ({ ...prev, page: newPage }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/40 p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-4 md:p-6">
      <div className="bg-card rounded-4xl shadow-lg border border-border p-6 md:p-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCardAdminTeacher
            title="Total Instructors"
            value={totalTeachers}
            icon={<Users />}
          />
          <StatCardAdminTeacher
            title="Active"
            value={activeTeachers}
            icon={<CheckCircle className="text-green-500" />}
          />
          <StatCardAdminTeacher
            title="Suspended"
            value={suspendedTeachers}
            icon={<XCircle className="text-red-500" />}
          />
          <StatCardAdminTeacher
            title="New/Pending"
            value={pendingOrNew}
            icon={<Clock className="text-orange-500" />}
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 pt-2">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Teacher Directory
            </h1>
            <p className="text-muted-foreground text-sm">
              Monitor instructor status and profile completion.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/70" />

            <Input
              placeholder="Search teachers..."
              className="pl-10 rounded-2xl h-11 bg-primary/5 border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTeachers.map((teacher, i) => {
            const isRestricted = ["new", "pending"].includes(teacher.status);

            return (
              <motion.div
                key={teacher._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className="rounded-3xl border-border/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden bg-card">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <Avatar className="h-14 w-14 rounded-2xl border-2 border-background shadow-sm">
                        <AvatarImage src={teacher.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {teacher.firstName[0]}
                          {teacher.lastName[0]}
                        </AvatarFallback>
                      </Avatar>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                          >
                            <MoreVertical size={20} />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="end"
                          className="w-56 rounded-xl p-2"
                        >
                          <DropdownMenuItem
                            disabled={isRestricted}
                            className={`flex justify-between items-center ${
                              isRestricted ? "opacity-50 italic" : ""
                            }`}
                            onClick={() => {
                              if (!isRestricted) {
                                toggleStatus({
                                  id: teacher._id,
                                  action:
                                    teacher.status === "active"
                                      ? "suspend"
                                      : "activate",
                                });
                              }
                            }}
                          >
                            {teacher.status === "active"
                              ? "Suspend Account"
                              : "Activate Account"}
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              toast.custom((t) => (
                                <div className="bg-card border border-border rounded-2xl p-4 shadow-xl space-y-3 w-[260px]">
                                  <p className="text-sm font-semibold">
                                    Are you sure you want to delete this
                                    teacher?
                                  </p>

                                  <div className="flex justify-end gap-2">
                                    <button
                                      className="px-3 py-1 text-xs rounded-xl bg-muted hover:bg-muted/70"
                                      onClick={() => toast.dismiss(t)}
                                    >
                                      Cancel
                                    </button>

                                    <button
                                      className="px-3 py-1 text-xs rounded-xl bg-destructive text-white hover:bg-destructive/90"
                                      onClick={() => {
                                        deleteTeacher(teacher._id);
                                        toast.dismiss(t);

                                        toast.success(
                                          "Teacher deleted successfully",
                                        );
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              ));
                            }}
                          >
                            Delete Instructor
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg capitalize">
                        {teacher.firstName} {teacher.lastName}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {teacher.email}
                      </p>
                    </div>

                    <div className="flex justify-between ">
                      <Badge variant="outline">Educator</Badge>

                      <Badge
                        variant={
                          teacher.status === "active"
                            ? "success"
                            : teacher.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {teacher.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {pagination.pages > 1 && (
          <div className="flex justify-center pt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(params.page - 1)}
                  />
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(params.page + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};



export default AdminTeachersPage;
