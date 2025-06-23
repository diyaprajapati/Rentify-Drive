"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

import { ChevronRight } from "lucide-react";
import Particles from "@/components/particles";
import AnimatedGradientText from "@/components/animated-gradient-text";
import Link from "next/link";
import { UserAvatar } from "@/components/user-avatar";
import { getSessionToken } from "@/lib/utils";

interface CarType {
  _id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  seats: number;
  fuelType: string;
  transmission: string;
  pricePerDay: number;
  features: string[];
  images: string[];
}

const bookingSchema = z
  .object({
    startDate: z.date({
      required_error: "Start date is required.",
    }),
    endDate: z.date({
      required_error: "End date is required.",
    }),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be on or after the start date",
    path: ["endDate"],
  });

type BookingFormData = z.infer<typeof bookingSchema>;
type User = {
  name: string;
  email: string;
  address: string;
  mobileNumber: string;
  role: string;
};

export default function CarsPage() {
  const [cars, setCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [totalCost, setTotalCost] = useState(0);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3001/api/cars");
        const data = await response.json();
        setCars(data.cars);
        const userres = await fetch("http://localhost:3001/users/profile");
        const userdata = await userres.json();
        setUser(userdata.user);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  useEffect(() => {
    const startDate = watch("startDate");
    const endDate = watch("endDate");
    if (startDate && endDate && selectedCar) {
      const days = Math.max(
        1,
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1
      );
      setTotalCost(days * selectedCar.pricePerDay);
    }
  }, [watch("startDate"), watch("endDate"), selectedCar]);

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedCar) return;

    try {
      const sessionToken = await getSessionToken();
      const response = await fetch("http://localhost:3001/api/rental", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          carId: selectedCar._id,
          startDate: data.startDate.toISOString(),
          endDate: data.endDate.toISOString(),
        }),
      });

      if (response.ok) {
        toast({
          title: "Booking Successful",
          description: "Your car has been booked successfully.",
        });
        setOpen(false);
        reset();
      } else {
        const errorData = await response.json();
        toast({
          title: "Booking Failed",
          description:
            errorData.message || "Sorry! Car is already booked at this time.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error booking car:", error);
      toast({
        title: "Booking Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white relative">
        <Particles />
        <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <AnimatedGradientText>
                Loading Our Fleet
              </AnimatedGradientText>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
                  <Skeleton className="h-48 w-full bg-white/10" />
                  <CardHeader>
                    <Skeleton className="h-6 w-2/3 bg-white/10" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2 bg-white/10" />
                    <Skeleton className="h-4 w-3/4 bg-white/10" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full bg-white/10" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
      <Particles />

      {/* Header */}
      <header className="relative z-10 py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center backdrop-blur-sm border-b border-white/10">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Rentify Drive
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/settings">
            <UserAvatar />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 flex justify-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 mt-8 bg-clip-text text-transparent">
              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                Choose Your&nbsp;
              </span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Perfect Ride
              </span>
            </h1>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.length === 0 ? (
              <div className="text-center text-gray-300 text-xl col-span-full">
                🚗 No cars are currently available for rental. Please check back later.
              </div>
            ) : (
              cars.map((car) => (
                <Card key={car._id} className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden hover:bg-white/10 transition-all duration-300 group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={car.images[0]}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-white text-xl">
                      {`${car.make} ${car.model} (${car.year})`}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="border-purple-400/50 text-purple-300 bg-purple-900/20">
                        {car.transmission}
                      </Badge>
                      <Badge variant="outline" className="border-blue-400/50 text-blue-300 bg-blue-900/20">
                        {car.fuelType}
                      </Badge>
                      <Badge variant="outline" className="border-green-400/50 text-green-300 bg-green-900/20">
                        {`${car.seats} seats`}
                      </Badge>
                    </div>
                    <p className="text-gray-300 mb-3 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
                      {car.color}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        ₹{car.pricePerDay}
                      </span>
                      <span className="text-gray-400">/ day</span>
                    </div>
                  </CardContent>
                  <Separator className="bg-white/10" />
                  <CardFooter className="pt-4">
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                      onClick={() => {
                        reset();
                        setSelectedCar(car);
                        setOpen(true);
                      }}
                    >
                      Book Now
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              )))}
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] bg-slate-900/95 border-white/10 backdrop-blur-sm text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Rent this car</DialogTitle>
            <DialogDescription className="text-gray-300">
              Please select the rental start and end date to submit your request.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6 py-6">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-white">
                  Start Date
                </Label>
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <Input
                      type="date"
                      {...field}
                      value={
                        field.value
                          ? field.value.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                    />
                  )}
                />
                {errors.startDate && (
                  <p className="text-red-400 text-sm">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-white">
                  End Date
                </Label>
                <Controller
                  control={control}
                  name="endDate"
                  render={({ field }) => (
                    <Input
                      type="date"
                      {...field}
                      value={
                        field.value
                          ? field.value.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                    />
                  )}
                />
                {errors.endDate && (
                  <p className="text-red-400 text-sm">{errors.endDate.message}</p>
                )}
              </div>

              <div className="bg-purple-900/20 border border-purple-400/30 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <Label className="text-white font-semibold">Total Cost</Label>
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    ₹{totalCost.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                Submit Request
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}