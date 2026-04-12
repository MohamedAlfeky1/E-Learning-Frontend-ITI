import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Percent,
  TrendingUp,
  Wallet,
  Banknote,
} from "lucide-react";
import Loader from "@/components/ui/loader";

import {
  useRevenueConfigQuery,
  usePlatformStatsQuery,
} from "@/queries/financeQueries";
import {  useUpdateRevenueMutation } from "@/mutations/financeMutations";

const AdminRevenueConfigPage = () => {
  const { data: config, isLoading: configLoading } =
    useRevenueConfigQuery();
  const { data: stats, isLoading: statsLoading } =
    usePlatformStatsQuery();
  const updateMutation = useUpdateRevenueMutation();

  const [teacherShare, setTeacherShare] = useState(0);

  useEffect(() => {
    if (config) setTeacherShare(config.teacherShare);
  }, [config]);

  const handleSave = () => {
    updateMutation.mutate(teacherShare);
  };

  if (configLoading || statsLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8faff]" >
          <Loader />
        </div>
      );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">

      <div className="relative overflow-hidden rounded-3xl border bg-card p-6 md:p-8 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Financial Dashboard 💰
          </h1>
          <p className="text-muted-foreground mt-2">
            Control your revenue split and monitor platform performance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          title="Platform Revenue"
          value={`$${stats?.totalPlatformRevenue}`}
          icon={<TrendingUp />}
        />
        <StatCard
          title="Paid to Teachers"
          value={`$${stats?.totalPaidToTeachers}`}
          icon={<Banknote />}
        />
        <StatCard
          title="Pending Payouts"
          value={`$${stats?.totalPendingToTeachers}`}
          icon={<Wallet />}
        />
      </div>

      <Card className="rounded-3xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-primary" />
            Revenue Configuration
          </CardTitle>
          <CardDescription>
            Adjust teacher share and platform percentage dynamically.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <div className="space-y-6">

              <div>
                <Label className="text-xs uppercase text-muted-foreground font-semibold">
                  Teacher Share
                </Label>

                <div className="relative mt-2">
                  <Input
                    type="number"
                    value={teacherShare}
                    onChange={(e) =>
                      setTeacherShare(Number(e.target.value))
                    }
                    className="h-14 text-2xl font-black pr-12 rounded-2xl border bg-background focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                    %
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border bg-muted/40 p-4 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Platform Share
                </span>
                <span className="font-bold text-primary text-lg">
                  {100 - teacherShare}%
                </span>
              </div>

              <Button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="w-full h-12 rounded-2xl text-base font-bold shadow-md hover:scale-[1.02] transition"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  "Save Configuration"
                )}
              </Button>
            </div>

            <div className="flex justify-center">
              <div className="relative w-44 h-44 md:w-60 md:h-60">

                <div
                  className="w-full h-full rounded-full flex items-center justify-center"
                  style={{
                    background: `conic-gradient(var(--color-primary) ${teacherShare}%, var(--color-muted) ${teacherShare}%)`,
                  }}
                >
                  <div className="w-[80%] h-[80%] bg-background rounded-full flex flex-col items-center justify-center shadow-inner">
                    <span className="text-xs text-muted-foreground uppercase">
                      Teacher
                    </span>
                    <span className="text-3xl font-black text-primary">
                      {teacherShare}%
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <Card className="rounded-3xl border bg-card p-5 flex items-center gap-4 hover:shadow-md transition-all">

    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
      {icon}
    </div>

    <div>
      <p className="text-xs text-muted-foreground">{title}</p>
      <h3 className="text-2xl font-black">{value}</h3>
    </div>
  </Card>
);

export default AdminRevenueConfigPage;