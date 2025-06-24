"use client";

import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Calendar, Car, CreditCard, Users } from "lucide-react";
import axios from "axios";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getSessionToken } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

import { cn } from "@/lib/utils";
import Particles from "@/components/particles";
import { UpdateRentalStatus } from "@/components/update-rental-status";

interface DashboardData {
  totalRentals: number;
  activeRentals: number;
  revenue: number;
  recentRentals: {
    id: number;
    user: string;
    car: string;
    startDate: string;
    endDate: string;
    status: string;
  }[];
  rentalData: {
    name: string;
    rentals: number;
  }[];
  revenueData: {
    name: string;
    revenue: number;
  }[];
  topRentedCars: {
    model: string;
    rentals: number;
  }[];
  pendingRentals: {
    _id: string;
    userId: {
      _id: string;
      name: string;
    };
    carId: {
      _id: string;
      make: string;
      model: string;
    };
    startDate: string;
    endDate: string;
    totalCost: number;
    status: string;
    paymentReferenceNumber: string;
  }[];
}

export default function CarRentalDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const token = await getSessionToken();
      const [dashboardResponse, pendingRentalsResponse] = await Promise.all([
        axios.get("http://localhost:3001/api/rental/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:3001/api/rental/pending-with-payment", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setDashboardData({
        ...dashboardResponse.data,
        pendingRentals: pendingRentalsResponse.data.rentals,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
      case "confirmed":
        return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
      case "active":
        return "bg-green-500/20 text-green-300 border border-green-500/30";
      case "completed":
        return "bg-purple-500/20 text-purple-300 border border-purple-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-300 border border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-xl">Failed to load dashboard data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
      <Particles />
      <div className="relative z-10 space-y-8 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your car rental business
          </p>
        </div>

        <Tabs
          defaultValue="overview"
          onValueChange={setActiveTab}
          className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-6"
        >
          <TabsList className="bg-white/10 border border-white/20">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="pending-rentals"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              Pending Rentals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="backdrop-blur-sm bg-white/5 border border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Total Rentals
                  </CardTitle>
                  <Car className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {dashboardData.totalRentals}
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/5 border border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Active Rentals
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {dashboardData.activeRentals}
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/5 border border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Revenue
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-pink-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    ₹{dashboardData.revenue.toFixed(2)}
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/5 border border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {dashboardData.recentRentals.length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 backdrop-blur-sm bg-white/5 border border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Rental Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ChartContainer
                    config={{
                      rentals: {
                        label: "Rentals",
                        color: "#8b5cf6",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dashboardData.rentalData}>
                        <XAxis
                          dataKey="name"
                          stroke="#9ca3af"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#9ca3af"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}`}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="rentals"
                          fill="var(--color-rentals)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="col-span-3 backdrop-blur-sm bg-white/5 border border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Recent Rentals</CardTitle>
                  <CardDescription className="text-gray-400">
                    Recent rental activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.recentRentals.slice(0, 5).map((rental) => (
                      <div key={rental.id} className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {rental.user}
                          </p>
                          <p className="text-sm text-gray-400 truncate">
                            {rental.car}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            getStatusColor(rental.status)
                          )}
                        >
                          {rental.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 backdrop-blur-sm bg-white/5 border border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Revenue",
                        color: "#ec4899",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dashboardData.revenueData}>
                        <XAxis
                          dataKey="name"
                          stroke="#9ca3af"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#9ca3af"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `₹${value}`}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="var(--color-revenue)"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="col-span-3 backdrop-blur-sm bg-white/5 border border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Top Rented Cars</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.topRentedCars.map((car, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-white">{car.model}</span>
                        <span className="text-sm font-medium text-purple-400">
                          {car.rentals} rentals
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pending-rentals" className="space-y-6 mt-6">
            <Card className="backdrop-blur-sm bg-white/5 border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Pending Rentals with Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableHead className="text-gray-300">User</TableHead>
                        <TableHead className="text-gray-300">Car</TableHead>
                        <TableHead className="text-gray-300">Dates</TableHead>
                        <TableHead className="text-gray-300">Total Cost</TableHead>
                        <TableHead className="text-gray-300">Payment Ref</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dashboardData.pendingRentals.map((rental) => (
                        <TableRow key={rental._id} className="border-white/5 hover:bg-white/5">
                          <TableCell className="text-white">{rental.userId.name}</TableCell>
                          <TableCell className="text-gray-300">
                            {`${rental.carId.make} ${rental.carId.model}`}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {`${new Date(rental.startDate).toLocaleDateString()} - ${new Date(rental.endDate).toLocaleDateString()}`}
                          </TableCell>
                          <TableCell className="text-white font-semibold">
                            ₹{rental.totalCost.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {rental.paymentReferenceNumber}
                          </TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                "px-3 py-1 rounded-full text-xs font-medium text-white",
                                getStatusColor(rental.status)
                              )}
                            >
                              {rental.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <UpdateRentalStatus
                              rentalId={rental._id}
                              currentStatus={rental.status}
                              onUpdate={fetchDashboardData}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
