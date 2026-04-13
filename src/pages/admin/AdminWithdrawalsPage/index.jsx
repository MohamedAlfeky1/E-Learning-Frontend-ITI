import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";

import { usePendingWithdrawalsQuery } from "@/queries/financeQueries";

import {
  useApproveWithdrawalMutation,
  useRejectWithdrawalMutation,
} from "@/mutations/financeMutations";

import Loader from "@/components/ui/loader";

const AdminWithdrawalsPage = () => {
  const { data: requests, isLoading } = usePendingWithdrawalsQuery();
  const approveMutation = useApproveWithdrawalMutation();
  const rejectMutation = useRejectWithdrawalMutation();

  const [selectedId, setSelectedId] = useState(null);
  const [rejectNote, setRejectNote] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleApprove = (id) => {
    approveMutation.mutate(id);
  };

  const handleRejectSubmit = () => {
    if (!rejectNote) return;

    rejectMutation.mutate({
      requestId: selectedId,
      adminNote: rejectNote,
    });

    setIsDialogOpen(false);
    setRejectNote("");
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader />
      </div>
    );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Withdrawal Requests 💸
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage teacher payout requests
          </p>
        </div>

        <Badge className="h-8 px-4 rounded-full bg-primary/10 text-primary border border-primary/20">
          {requests?.length || 0} Pending
        </Badge>
      </header>

      <div className="hidden md:block">
        <Card className="rounded-3xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {requests?.map((req) => (
                <TableRow
                  key={req._id}
                  className="hover:bg-muted/10 transition"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {req.teacherId.firstName[0]}
                        {req.teacherId.lastName[0]}
                      </div>

                      <div>
                        <p className="font-semibold text-sm">
                          {req.teacherId.firstName} {req.teacherId.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {req.teacherId.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="font-bold text-primary">
                    ${req.amount}
                  </TableCell>

                  {/* Date */}
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    <Badge className="bg-orange-100 text-orange-600 rounded-full">
                      <Clock size={12} className="mr-1" />
                      Pending
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
                      onClick={() => handleApprove(req._id)}
                      disabled={approveMutation.isPending}
                    >
                      <CheckCircle size={16} className="mr-1" />
                      Approve
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      className="rounded-xl"
                      onClick={() => {
                        setSelectedId(req._id);
                        setIsDialogOpen(true);
                      }}
                    >
                      <XCircle size={16} className="mr-1" />
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <div className="grid gap-4 md:hidden">
        {requests?.map((req) => (
          <Card key={req._id} className="rounded-2xl p-4 space-y-3 shadow-sm">
            {/* Top */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {req.teacherId.firstName[0]}
                  {req.teacherId.lastName[0]}
                </div>

                <div>
                  <p className="font-semibold text-sm">
                    {req.teacherId.firstName} {req.teacherId.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {req.teacherId.email}
                  </p>
                </div>
              </div>

              <Badge className="bg-orange-100 text-orange-600 rounded-full">
                <Clock size={12} className="mr-1" />
                Pending
              </Badge>
            </div>

            <div className="text-lg font-bold text-primary">${req.amount}</div>

            <div className="text-xs text-muted-foreground">
              {new Date(req.createdAt).toLocaleDateString()}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                onClick={() => handleApprove(req._id)}
              >
                <CheckCircle size={16} />
                Approve
              </Button>

              <Button
                variant="destructive"
                className="flex-1 rounded-xl"
                onClick={() => {
                  setSelectedId(req._id);
                  setIsDialogOpen(true);
                }}
              >
                <XCircle size={16} />
                Reject
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Withdrawal</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Input
              placeholder="e.g. Wrong bank details"
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              className="rounded-2xl h-12"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleRejectSubmit}
              disabled={!rejectNote || rejectMutation.isPending}
              className="rounded-xl"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminWithdrawalsPage;
