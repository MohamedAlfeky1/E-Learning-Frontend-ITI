import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTeacherVerification } from "@/queries/adminVerificationQueries";
import { useUserQuery } from "@/queries/authQueries";
import { LuClock4 } from "react-icons/lu";
import { BiCheckShield } from "react-icons/bi";
import { BsGraphUpArrow } from "react-icons/bs";
import { ImSpinner10 } from "react-icons/im";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { useEffect, useState } from "react";
import Loader from "@/components/ui/loader";
import VerificationDecisionForm from "./VerificationDecisionForm";
import { TbCertificate } from "react-icons/tb";
import { GrUserExpert } from "react-icons/gr";
import { useGetCategoryById } from "@/queries/categoryQueries";

const CategoryBadge = ({ categoryId }) => {
  const { data: categoryData, isLoading } = useGetCategoryById(categoryId);
  console.log(categoryData);

  if (isLoading)
    return (
      <Badge>
        <ImSpinner10 />
      </Badge>
    );

  return (
    <Badge variant="secondary" className="m-1">
      {categoryData?.data?.name ?? categoryId}
    </Badge>
  );
};

const AdminVerificationsPage = () => {
  const {
    data: teacherData,
    isLoading: teacherDataLoading,
    error: teacherDataError,
  } = useUserQuery();
  const { data, isLoading, error } = useTeacherVerification();
  const pendingCount = data?.data?.requests.filter(
    (req) => req.status === "pending",
  ).length;
  console.log(data);

  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const allRequests = data?.data?.requests ?? [];
  const totalPages = Math.ceil(allRequests.length / ITEMS_PER_PAGE);
  const paginatedRequests = allRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  console.log("paginatedRequests", paginatedRequests);

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  if (teacherDataLoading || !teacherData) {
    return (
      <div className="min-h-full min-w-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (isLoading || !teacherData) {
    return (
      <div className="min-h-full min-w-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 m-5">
      <div className="flex flex-col md:flex-row justify-between items-center ">
        <div>
          <h1 className="font-extrabold text-[#312E81] text-4xl">
            Teacher Application Approvals
          </h1>
          <p className="text-[#6B7280]">
            Curate the future of learning. Review and verify expert educators
            joining the
            <span className="text-[#4338CA]"> Nexora</span> ecosystem.
          </p>
        </div>
        <div className="bg-[#EEF2FF] border border-[#E0E7FF] flex flex-col items-center gap-1 px-4 py-2 rounded-lg">
          <p className="text-[#818CF8] font-bold text-xs">PENDING QUEUE</p>
          <span className="text-[#4F46E5] font-extrabold text-5xl">
            {pendingCount}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100">
              <TableHead className="text-xs font-semibold text-gray-400 tracking-widest uppercase px-6 py-4">
                Applicant
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
                Expertise
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
                Date Applied
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-400 tracking-widest uppercase text-right px-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-gray-400"
                >
                  Loading applications...
                </TableCell>
              </TableRow>
            )}

            {error && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-red-400"
                >
                  Failed to load applications.
                </TableCell>
              </TableRow>
            )}

            {paginatedRequests?.map((applicant) => (
              <TableRow
                key={applicant.id}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                {/* Applicant */}
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {applicant.avatar ? (
                      <img
                        src={applicant.avatar}
                        alt={applicant?.teacherId?.firstName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 bg-gray-200 rounded-full p-1">
                        {`${applicant?.teacherId?.firstName?.[0] || ""}${applicant.teacherId?.lastName?.[0] || ""}`}
                      </span>
                    )}

                    <div>
                      <p className="font-semibold text-gray-900">
                        {applicant?.teacherId?.firstName +
                          " " +
                          applicant?.teacherId?.lastName || 'Teacher Name'}
                      </p>
                      <p className="font-normal text-blue-500">
                        {applicant?.teacherId?.email}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Expertise */}
                <TableCell>
                  {applicant?.targetCategories?.length > 0 ? (
                    applicant.targetCategories?.map((cateId) => (
                      <div key={cateId}>
                        <CategoryBadge categoryId={cateId} />
                      </div>
                    ))
                  ) : (
                    <Badge variant="destructive">No Expertise Listed</Badge>
                  )}
                </TableCell>

                {/* Date Applied */}
                <TableCell className="text-gray-500 text-sm">
                  {new Date(applicant.submittedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    {applicant.status === "pending" && (
                      <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
                    )}
                    {applicant.status === "approved" && (
                      <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                    )}
                    {applicant.status === "rejected" && (
                      <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                    )}

                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {applicant.status}
                    </span>
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right px-6">
                  <Drawer direction="right">
                    <DrawerTrigger asChild>
                      <button className="bg-[#4338CA] hover:bg-[#3730A3] text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors">
                        Review
                      </button>
                    </DrawerTrigger>

                    <DrawerContent className='w-full'>
                      <DrawerHeader>
                        <DrawerTitle>Review Application</DrawerTitle>
                        <DrawerDescription>
                          Submitted on{" "}
                          {new Date(applicant.submittedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </DrawerDescription>
                      </DrawerHeader>

                      {/* Applicant details */}
                      <div className="px-4 flex flex-col gap-2">
                        {/* Name & avatar */}
                        <div className="flex justify-between items-center gap-2">
                          <div className="flex items-center gap-2">
                            {applicant.avatar ? (
                              <img
                                src={applicant.avatar}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <span className="bg-gray-200 text-gray-500 rounded-full w-12 h-12 flex items-center justify-center font-bold">
                                {`${applicant?.teacherId?.firstName?.[0] ?? ""}${applicant.teacherId?.lastName?.[0] ?? ""}`}
                              </span>
                            )}
                            <div className="flex flex-col gap-2">
                              <p>
                                {applicant?.teacherId?.firstName}{" "}
                                {applicant.teacherId?.lastName}
                              </p>
                              <p className="text-sm font-light text-gray-400">
                                ID: {applicant.teacherId?._id}
                              </p>
                            </div>
                          </div>

                          <div>
                            <div className="font-semibold text-gray-900 w-full flex justify-between items-start ">
                              <div className="flex items-center justify-start gap-2">
                                {applicant.status === "pending" && (
                                  <span className="w-2 h-2 rounded-full bg-yellow-400" />
                                )}
                                {applicant.status === "rejected" && (
                                  <span className="w-2 h-2 rounded-full bg-red-400" />
                                )}
                                {applicant.status === "approved" && (
                                  <span className="w-2 h-2 rounded-full bg-green-400" />
                                )}
                                <span className="text-sm font-medium text-gray-700 capitalize">
                                  {applicant.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex justify-between items-center gap-2 ">
                          {/* Categories */}
                          <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                              Categories
                            </p>
                            <div className="flex flex-wrap">
                              {applicant?.targetCategories?.length > 0 ? (
                                applicant.targetCategories?.map((cateId) => (
                                  <div key={cateId}>
                                    <CategoryBadge categoryId={cateId} />
                                  </div>
                                ))
                              ) : (
                                <Badge variant="destructive">
                                  No Categories Listed
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Experience */}
                          <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                              Expertise
                            </p>
                            <div className="flex flex-wrap">
                              {applicant.experiences.map((expo, index) => {
                                return (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2"
                                  >
                                    <Badge variant="ghost">
                                      <GrUserExpert />
                                    </Badge>
                                    <div className="text-sm text-gray-700">
                                      <p className="font-medium">
                                        {expo.title} at {expo.organization}
                                      </p>
                                      <p className="font-light text-sm text-gray-500">
                                        {expo.description}
                                      </p>
                                      <p className="text-xs text-blue-500">
                                        {new Date(expo.from).getFullYear()} -{" "}
                                        {new Date(expo.to).getFullYear()}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2"></div>
                        {/* Certificates */}
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                            Certificates
                          </p>
                          <div className="flex flex-wrap">
                            {applicant.certificates.map((cert, index) => {
                              return (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <Badge variant="ghost">
                                    <TbCertificate />
                                  </Badge>
                                  <a
                                    href={cert.fileUrl}
                                    target="_blank"
                                    className="text-sm text-blue-600 hover:underline"
                                  >
                                    {cert.title}
                                  </a>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Bio (if available) */}
                        {applicant.bio && (
                          <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                              Bio
                            </p>
                            <p className="text-sm text-gray-600">
                              {applicant.bio}
                            </p>
                          </div>
                        )}

                        {/* Decision form */}
                        <div className="flex flex-col gap-3 border-t pt-4 mt-2">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                            Verification Decision
                          </p>
                          {applicant.status === "approved" ? (
                            <div>
                              <p className="text-center font-medium text-2xl">
                                This Student is Already{" "}
                                <span className="text-green-800">Approved</span>
                              </p>
                            </div>
                          ) : (
                            <VerificationDecisionForm applicant={applicant} />
                          )}
                        </div>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 px-6 py-2 text-sm text-gray-400">

          <span>
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, allRequests.length)} of{" "}
            {allRequests.length} applications
          </span>

          <Pagination className='flex flex-col md:flex-row'>
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
          </Pagination>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-3 md:col-span-1 flex flex-col gap-3 bg-[#EEF2FF] border border-[#E0E7FF]/50 p-3 rounded-2xl">
          <Badge variant="lightPruple" className="p-4 rounded-md">
            <LuClock4 size={13} color="#4F46E5" />
          </Badge>
          <h2 className="font-bold text-2xl">Review Speed</h2>
          <p className="text-sm text-[#6B7280]">
            Average turnaround time is currently{" "}
            <span className="font-bold text-[#4338CA]">1.2 days</span>. Keep it
            up!
          </p>
        </div>

        <div className="col-span-3 md:col-span-1 flex flex-col gap-3 bg-[#DCFCE7] border border-[#22C55E]/75   p-3 rounded-2xl">
          <Badge variant="success" className="p-4 rounded-md bg-[#22C55E]/20">
            <BiCheckShield size={20} color="#22C55E" />
          </Badge>
          <h2 className="font-bold text-2xl">Verified Experts</h2>
          <p className="text-sm text-[#6B7280]">
            94% of accepted applicants have published research or 5+ years of
            industry tenure.
          </p>
        </div>

        <div className="col-span-3 relative md:col-span-1 flex flex-col gap-3 bg-[#E5E7EB] border border-[#4B5563] p-4 rounded-xl relative overflow-hidden">
          {/* Icon Badge */}
          <Badge variant="secondary" className="p-4 rounded-md">
            <BsGraphUpArrow size={13} color="#4B5563" />
          </Badge>

          {/* Text */}
          <h2 className="font-bold text-2xl text-[#111827]">
            Applicant Growth
          </h2>
          <p className="text-sm text-[#6B7280]">
            Applications are up by{" "}
            <span className="font-bold text-[#111827]">18%</span> compared to
            last month.
          </p>

          {/* Decorative bars — bottom right corner */}
          <div className="absolute bottom-3 right-4 flex items-end gap-1">
            <div className="w-3 bg-[#9CA3AF] rounded-sm h-5 opacity-60" />
            <div className="w-3 bg-[#6B7280] rounded-sm h-8 opacity-80" />
            <div className="w-3 bg-[#4B5563] rounded-sm h-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVerificationsPage;
