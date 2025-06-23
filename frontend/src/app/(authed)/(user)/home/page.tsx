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
import { getSessionToken } from "@/lib/utils";
import Image from "next/image";
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
import { UserAvatar } from "@/components/user-avatar";
import Link from "next/link";

interface Car {
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
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
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
            errorData.message || "An error occurred while booking the car.",
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
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Our Fleet</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-8">Our Fleet</h1>
        <Link href="/settings">
          <UserAvatar />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.length > 0 &&
          cars?.map((car) => (
            <Card key={car._id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={`${car.images[0]}`}
                  alt={`${car.make} ${car.model}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{`${car.make} ${car.model} (${car.year})`}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{car.transmission}</Badge>
                  <Badge variant="secondary">{car.fuelType}</Badge>
                  <Badge variant="secondary">{`${car.seats} seats`}</Badge>
                </div>
                <p className="text-muted-foreground mb-2">{car.color}</p>
                <p className="font-semibold text-lg">
                  ₹{car.pricePerDay} / day
                </p>
              </CardContent>
              <Separator />
              <CardFooter className="pt-4">
                <Button
                  className="w-full"
                  onClick={() => {
                    // reset form
                    reset();
                    setSelectedCar(car);
                    setOpen(true);
                  }}
                >
                  Book Now
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rent this car</DialogTitle>
            <DialogDescription>
              Please select the rental start and end date/time to submit your
              request.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4 w-full">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
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
                    />
                  )}
                />
              </div>
              {errors.startDate && (
                <p className="text-red-500 text-sm">
                  {errors.startDate.message}
                </p>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
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
                    />
                  )}
                />
              </div>
              {errors.endDate && (
                <p className="text-red-500 text-sm">{errors.endDate.message}</p>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Total Cost</Label>
                <div className="col-span-3">₹{totalCost.toFixed(2)}</div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Submit Request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
