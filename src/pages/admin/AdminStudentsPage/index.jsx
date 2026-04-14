import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { Users, CheckCircle, XCircle, MoreVertical } from "lucide-react";

import { motion } from "framer-motion";
import { toast } from "sonner";

import { useUsersQuery } from "@/queries/adminStudentQueries";
import {
  useDeleteUserMutation,
  useToggleUserStatusMutation,
} from "@/mutations/adminStudentMutations";

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

const AdminStudentsPage = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({ page: 1, limit: 8, role: "student" });
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useUsersQuery(params);
  const { mutate: deleteUser } = useDeleteUserMutation();
  const { mutate: toggleStatus } = useToggleUserStatusMutation();

  const students = data?.data?.users || [];
  const pagination = data?.data?.pagination || {};

  const filteredStudents = students.filter((s) =>
    `${s.firstName} ${s.lastName} ${s.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setParams((prev) => ({ ...prev, page: newPage }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="bg-card rounded-4xl shadow-lg border border-border p-5 md:p-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCardAdminTeacher
            title="Total Students"
            value={students.length}
            icon={<Users className="text-primary" />}
          />
          <StatCardAdminTeacher
            title="Active"
            value={students.filter((s) => s.status === "active").length}
            icon={<CheckCircle className="text-green-500" />}
          />
          <StatCardAdminTeacher
            title="Suspended"
            value={students.filter((s) => s.status === "suspended").length}
            icon={<XCircle className="text-red-500" />}
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 pt-2">
          <div>
            <h1 className="text-3xl font-extrabold text-primary">
              Students Directory
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage student accounts and permissions.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/70" />

            <Input
              placeholder="Search students..."
              className="pl-10 rounded-2xl h-11 bg-primary/5 border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredStudents.map((student, i) => {
            const isRestricted = ["new", "pending"].includes(student.status);

            return (
              <motion.div
                key={student._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card
                  onClick={() => navigate(`/admin/students/${student._id}`)}
                  className="rounded-3xl border-border/50 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
                >
                  <CardContent className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback>
                          {student.firstName?.[0]}
                          {student.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical size={20} />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem
                            disabled={isRestricted}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isRestricted) {
                                toggleStatus({
                                  id: student._id,
                                  action:
                                    student.status === "active"
                                      ? "suspend"
                                      : "activate",
                                });
                              }
                            }}
                          >
                            {student.status === "active"
                              ? "Suspend"
                              : "Activate"}
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();

                              toast.custom((t) => (
                                <div className="bg-card border border-border rounded-2xl p-4 shadow-xl space-y-3 w-[260px]">
                                  <p className="text-sm font-semibold">
                                    Delete {student.firstName}{" "}
                                    {student.lastName}?
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
                                        deleteUser(student._id);
                                        toast.dismiss(t);

                                        toast.success(
                                          "Student deleted successfully",
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
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {student.email}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <Badge>Student</Badge>
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

export default AdminStudentsPage;
