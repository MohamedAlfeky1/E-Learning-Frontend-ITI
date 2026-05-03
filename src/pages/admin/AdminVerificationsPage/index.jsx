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

/* ─── tiny helpers ─────────────────────────────────────────── */

const statusConfig = {
  pending:  { dot: "bg-amber-400",  pill: "bg-amber-50 text-amber-700 ring-amber-200",  label: "Pending"  },
  approved: { dot: "bg-emerald-400",pill: "bg-emerald-50 text-emerald-700 ring-emerald-200", label: "Approved" },
  rejected: { dot: "bg-rose-400",   pill: "bg-rose-50 text-rose-700 ring-rose-200",     label: "Rejected" },
};

const StatusPill = ({ status }) => {
  const cfg = statusConfig[status] ?? statusConfig.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${cfg.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

const Avatar = ({ applicant, size = "md" }) => {
  const initials = `${applicant?.teacherId?.firstName?.[0] ?? ""}${applicant?.teacherId?.lastName?.[0] ?? ""}`;
  const sizeClasses = size === "md" ? "w-10 h-10 text-sm" : "w-12 h-12 text-base";
  return applicant.avatar
    ? <img src={applicant.avatar} alt={applicant?.teacherId?.firstName} className={`${sizeClasses} rounded-full object-cover ring-2 ring-white shadow`} />
    : (
      <span className={`${sizeClasses} rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-600 flex items-center justify-center font-bold ring-2 ring-white shadow`}>
        {initials}
      </span>
    );
};

const CategoryBadge = ({ categoryId }) => {
  const { data: categoryData, isLoading } = useGetCategoryById(categoryId);
  console.log('====================================');
  console.log("categoryData",categoryData);
  console.log('====================================');
  if (isLoading) return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-slate-400 text-xs"><ImSpinner10 className="animate-spin" /></span>;
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-indigo-700 text-xs font-medium ring-1 ring-indigo-100 m-0.5">
      {categoryData?.data?.name ?? 'Category Not Found'}
    </span>
  );
};

/* ─── main page ─────────────────────────────────────────────── */

const AdminVerificationsPage = () => {
  const { data: teacherData, isLoading: teacherDataLoading } = useUserQuery();
  const { data, isLoading, error } = useTeacherVerification();
  const pendingCount = data?.data?.requests.filter((r) => r.status === "pending").length ?? 0;
  const approvedCount = data?.data?.requests.filter((r) => r.status === "approved").length ?? 0;
  const rejectedCount = data?.data?.requests.filter((r) => r.status === "rejected").length ?? 0;

  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const allRequests = data?.data?.requests ?? [];
  const totalPages = Math.ceil(allRequests.length / ITEMS_PER_PAGE);
  const paginatedRequests = allRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => { setCurrentPage(1); }, [data]);

  console.log("paginatedRequests",paginatedRequests);
  
  if (teacherDataLoading || !teacherData || isLoading) {
    return (
      <div className="min-h-full min-w-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6 md:p-10"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Google font import */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');`}</style>

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start w-full md:items-center gap-6 mb-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-indigo-400 uppercase mb-1">Admin Dashboard</p>
          <h1
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-1"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Teacher Verifications
          </h1>
          <p className="text-slate-500 text-sm max-w-md">
            Curate the future of learning — review and verify expert educators joining the{" "}
            <span className="text-indigo-600 font-semibold">Nexora</span> ecosystem.
          </p>
        </div>

        {/* Stat cards */}
        <div className="flex flex-col md:flex-row w-full md:w-fit items-center justify-center gap-3 flex-wrap">
          {[
            { label: "Pending", value: pendingCount, color: "from-amber-400 to-orange-400", light: "bg-amber-50 ring-amber-200" },
            { label: "Approved", value: approvedCount, color: "from-emerald-400 to-teal-400", light: "bg-emerald-50 ring-emerald-200" },
            { label: "Rejected", value: rejectedCount, color: "from-rose-400 to-pink-400", light: "bg-rose-50 ring-rose-200" },
          ].map(({ label, value, color, light }) => (
            <div key={label} className={`${light} ring-1 flex flex-col items-center justify-center px-5 py-3 rounded-2xl`}>
              <span className={`text-3xl font-extrabold bg-gradient-to-br ${color} bg-clip-text text-transparent`}>{value}</span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Table card ── */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 border-b border-slate-100">
              {["Applicant", "Expertise", "Date Applied", "Status", ""].map((h, i) => (
                <TableHead
                  key={h + i}
                  className={`text-[11px] font-bold text-slate-400 tracking-[0.12em] uppercase py-4 ${i === 0 ? "px-6" : ""} ${i === 4 ? "text-right px-6" : ""}`}
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16 text-slate-400 text-sm">
                  <ImSpinner10 className="animate-spin inline mr-2" /> Loading applications…
                </TableCell>
              </TableRow>
            )}

            {error && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16 text-rose-400 text-sm">
                  ⚠ Failed to load applications.
                </TableCell>
              </TableRow>
            )}

            {paginatedRequests?.map((applicant, idx) => (
              <TableRow
                key={applicant.id}
                className="border-b border-slate-50 hover:bg-indigo-50/40 transition-colors group"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                {/* Applicant */}
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar applicant={applicant} />
                    <div>
                      <p className="font-semibold text-slate-800 leading-tight">
                        {applicant?.teacherId?.firstName} {applicant?.teacherId?.lastName}
                      </p>
                      <p className="text-xs text-indigo-400 mt-0.5">{applicant?.teacherId?.email}</p>
                    </div>
                  </div>
                </TableCell>

                {/* Expertise */}
                <TableCell className="py-4">
                  <div className="flex flex-wrap max-w-[220px]">
                    {applicant?.targetCategories?.length > 0
                      ? applicant.targetCategories.map((cateId) => <CategoryBadge key={cateId} categoryId={cateId} />)
                      : <span className="text-xs text-rose-400 font-medium">No expertise listed</span>}
                  </div>
                </TableCell>

                {/* Date */}
                <TableCell className="py-4 text-slate-500 text-sm whitespace-nowrap">
                  {new Date(applicant.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </TableCell>

                {/* Status */}
                <TableCell className="py-4">
                  <StatusPill status={applicant.status} />
                </TableCell>

                {/* Action */}
                <TableCell className="text-right px-6 py-4">
                  <Drawer direction="right">
                    <DrawerTrigger asChild>
                      <button className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm shadow-indigo-200">
                        Review →
                      </button>
                    </DrawerTrigger>

                    {/* ── Drawer ── */}
                    <DrawerContent className="w-full max-w-md">
                      <DrawerHeader className="border-b border-slate-100 pb-4">
                        <DrawerTitle className="text-lg font-bold text-slate-900" style={{ fontFamily: "'DM Serif Display', serif" }}>
                          Review Application
                        </DrawerTitle>
                        <DrawerDescription className="text-xs text-slate-400">
                          Submitted {new Date(applicant.submittedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </DrawerDescription>
                      </DrawerHeader>

                      <div className="px-5 py-4 flex flex-col gap-5 overflow-y-auto">
                        {/* Identity */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar applicant={applicant} size="lg" />
                            <div>
                              <p className="font-semibold text-slate-800">
                                {applicant?.teacherId?.firstName} {applicant?.teacherId?.lastName}
                              </p>
                              <p className="text-xs text-slate-400 mt-0.5">ID: {applicant.teacherId?._id}</p>
                            </div>
                          </div>
                          <StatusPill status={applicant.status} />
                        </div>

                        {/* Grid: categories + experience */}
                        <div className="grid grid-cols-1 gap-4">
                          {/* Categories */}
                          <Section title="Categories">
                            <div className="flex flex-wrap">
                              {applicant?.targetCategories?.length > 0
                                ? applicant.targetCategories.map((cateId) => <CategoryBadge key={cateId} categoryId={cateId} />)
                                : <span className="text-xs text-rose-400">No categories listed</span>}
                            </div>
                          </Section>

                          {/* Experience */}
                          <Section title="Experience">
                            <div className="flex flex-col gap-3">
                              {applicant.experiences.map((expo, i) => (
                                <div key={i} className="flex gap-3 items-start bg-slate-50 rounded-xl p-3">
                                  <span className="mt-0.5 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <GrUserExpert size={12} />
                                  </span>
                                  <div>
                                    <p className="text-sm font-semibold text-slate-800">{expo.title}</p>
                                    <p className="text-xs text-slate-500">{expo.organization}</p>
                                    {expo.description && <p className="text-xs text-slate-400 mt-0.5">{expo.description}</p>}
                                    <p className="text-xs text-indigo-400 mt-1 font-medium">
                                      {new Date(expo.from).getFullYear()} – {new Date(expo.to).getFullYear()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Section>

                          {/* Certificates */}
                          {applicant.certificates?.length > 0 && (
                            <Section title="Certificates">
                              <div className="flex flex-col gap-2">
                                {applicant.certificates.map((cert, i) => (
                                  <a
                                    key={i}
                                    href={cert.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2.5 bg-slate-50 hover:bg-indigo-50 rounded-xl px-3 py-2.5 transition-colors group/cert"
                                  >
                                    <span className="w-7 h-7 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover/cert:bg-indigo-200 transition-colors">
                                      <TbCertificate size={14} />
                                    </span>
                                    <span className="text-sm text-indigo-600 font-medium hover:underline">{cert.title}</span>
                                    <span className="ml-auto text-slate-300 group-hover/cert:text-indigo-400 transition-colors text-xs">↗</span>
                                  </a>
                                ))}
                              </div>
                            </Section>
                          )}

                          {/* Bio */}
                          {applicant.bio && (
                            <Section title="Bio">
                              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-3">{applicant.bio}</p>
                            </Section>
                          )}
                        </div>

                        {/* Decision */}
                        <div className="border-t border-slate-100 pt-4">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-3">Verification Decision</p>
                          {applicant.status === "approved" ? (
                            <div className="bg-emerald-50 ring-1 ring-emerald-200 rounded-2xl p-4 text-center">
                              <p className="text-emerald-700 font-semibold text-sm">This applicant has already been approved ✓</p>
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

        {/* ── Footer / Pagination ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <span className="text-xs text-slate-400">
            Showing{" "}
            <span className="font-semibold text-slate-600">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>
            {" "}–{" "}
            <span className="font-semibold text-slate-600">{Math.min(currentPage * ITEMS_PER_PAGE, allRequests.length)}</span>
            {" "}of{" "}
            <span className="font-semibold text-slate-600">{allRequests.length}</span> applications
          </span>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={`rounded-xl text-sm ${currentPage === 1 ? "pointer-events-none opacity-40" : "cursor-pointer hover:bg-indigo-50 hover:text-indigo-600"}`}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                    className={`cursor-pointer rounded-xl text-sm ${page === currentPage ? "bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600" : "hover:bg-indigo-50 hover:text-indigo-600"}`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className={`rounded-xl text-sm ${currentPage === totalPages ? "pointer-events-none opacity-40" : "cursor-pointer hover:bg-indigo-50 hover:text-indigo-600"}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

/* tiny layout helper */
const Section = ({ title, children }) => (
  <div>
    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">{title}</p>
    {children}
  </div>
);

export default AdminVerificationsPage;