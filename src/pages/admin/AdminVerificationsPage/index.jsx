import { Table } from "@/components/ui/table";
import { useTeacherVerification } from "@/queries/adminVerificationQueries";
import { useUserQuery } from "@/queries/authQueries";

const AdminVerificationsPage = () => {

  const { data:teacherData, isLoading:teacherDataLoading, error:teacherDataError } = useUserQuery();
  const { data, isLoading, error } = useTeacherVerification()
  const pendingCount = data.requests.filter(req => resizeBy.status === 'pending').length;

  console.log(data);

  return (
    <div>

      <div className="flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="font-extrabold text-[#312E81] text-4xl">Teacher Application Approvals</h1>
          <p className="text-[#6B7280]">Curate the future of learning. Review and verify expert educators joining the
            <span className="text-[#4338CA]">Nexora</span> ecosystem.
          </p>
        </div>
        <div className="bg-[#EEF2FF] border border-[#E0E7FF]">
          <p>PENDING QUEUE</p>
          {pendingCount}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
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
                <TableCell colSpan={5} className="text-center py-10 text-gray-400">
                  Loading applications...
                </TableCell>
              </TableRow>
            )}

            {error && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-red-400">
                  Failed to load applications.
                </TableCell>
              </TableRow>
            )}

            {data?.requests?.map((applicant) => (
              <TableRow
                key={applicant.id}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                {/* Applicant */}
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={teacherData.avatar}
                      alt={teacherData.firstName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{teacherData.firstName}</p>
                      <p className="text-sm text-gray-400">{applicant.title}</p>
                    </div>
                  </div>
                </TableCell>

                {/* Expertise */}
                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${expertiseColors[applicant.expertise] ?? "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {applicant.expertise}
                  </span>
                </TableCell>

                {/* Date Applied */}
                <TableCell className="text-gray-500 text-sm">
                  {new Date(applicant.appliedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {applicant.status}
                    </span>
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right px-6">
                  <button
                    onClick={() => console.log("Review", applicant.id)}
                    className="bg-[#4338CA] hover:bg-[#3730A3] text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors"
                  >
                    Review
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 text-sm text-gray-400">
          <span>Showing 1 to {data?.requests?.length ?? 0} of {data?.total ?? 0} applications</span>

          {/* Pagination (static example — wire up your own state) */}
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-gray-100">&#8249;</button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`w-8 h-8 rounded-lg text-sm font-medium ${page === 1
                    ? "bg-[#4338CA] text-white"
                    : "hover:bg-gray-100 text-gray-500"
                  }`}
              >
                {page}
              </button>
            ))}
            <button className="p-2 rounded-lg hover:bg-gray-100">&#8250;</button>
          </div>
        </div>
      </div>


    </div>
  );
};

export default AdminVerificationsPage;
