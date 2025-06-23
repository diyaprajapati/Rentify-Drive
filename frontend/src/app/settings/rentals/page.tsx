// "use client";

// import { useState, useEffect } from "react";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
// import { getSessionToken } from "@/lib/utils";
// import { toast } from "@/hooks/use-toast";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { cn } from "@/lib/utils";
// import { ScrollArea } from "@/components/ui/scroll-area";

// interface Rental {
//   _id: string;
//   carId: {
//     _id: string;
//     make: string;
//     model: string;
//     year: number;
//   };
//   startDate: string;
//   endDate: string;
//   totalCost: number;
//   status: string;
//   paymentReferenceNumber: string;
// }

// const paymentSchema = z.object({
//   paymentReferenceNumber: z
//     .string()
//     .min(1, "Payment reference number is required"),
// });

// export default function MyRentals() {
//   const [rentals, setRentals] = useState<Rental[]>([]);
//   const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   const form = useForm<z.infer<typeof paymentSchema>>({
//     resolver: zodResolver(paymentSchema),
//     defaultValues: {
//       paymentReferenceNumber: "",
//     },
//   });

//   useEffect(() => {
//     fetchRentals();
//   }, []);

//   const fetchRentals = async () => {
//     try {
//       const token = await getSessionToken();
//       const response = await axios.get(
//         "http://localhost:3001/api/rental/user",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setRentals(response.data.rentals);
//     } catch (error) {
//       console.error("Error fetching rentals:", error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch rentals. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   const onSubmit = async (values: z.infer<typeof paymentSchema>) => {
//     if (!selectedRental) return;

//     try {
//       const token = await getSessionToken();
//       await axios.put(
//         `http://localhost:3001/api/rental/${selectedRental._id}/payment`,
//         { paymentReferenceNumber: values.paymentReferenceNumber },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       toast({
//         title: "Success",
//         description: "Payment reference number updated successfully.",
//       });

//       setIsDialogOpen(false);
//       fetchRentals();
//     } catch (error) {
//       console.error("Error updating payment reference:", error);
//       toast({
//         title: "Error",
//         description: "Failed to update payment reference. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "pending":
//         return "bg-yellow-100 text-yellow-800";
//       case "paid":
//         return "bg-green-100 text-green-800";
//       case "failed":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <div className="container mx-auto py-10 px-4 w-full">
//       <h1 className="text-3xl font-bold mb-6">My Rentals</h1>
//       <div className="rounded-md shadow-sm w-full">
//         <ScrollArea className="h-[calc(100vh-200px)] w-full">
//           <Table className="w-full">
//             <TableHeader>
//               <TableRow className="bg-muted/50">
//                 <TableHead className="w-[200px] py-4 px-6">Car</TableHead>
//                 <TableHead className="py-4 px-6">Start Date</TableHead>
//                 <TableHead className="py-4 px-6">End Date</TableHead>
//                 <TableHead className="py-4 px-6">Total Cost</TableHead>
//                 <TableHead className="py-4 px-6">Status</TableHead>
//                 <TableHead className="py-4 px-6">Payment Ref</TableHead>
//                 <TableHead className="text-right py-4 px-6">Action</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {rentals.map((rental) => (
//                 <TableRow key={rental._id} className="hover:bg-muted/50">
//                   <TableCell className="font-medium py-4 px-6">
//                     {`${rental.carId.make} ${rental.carId.model} (${rental.carId.year})`}
//                   </TableCell>
//                   <TableCell className="py-4 px-6">
//                     {new Date(rental.startDate).toLocaleDateString()}
//                   </TableCell>
//                   <TableCell className="py-4 px-6">
//                     {new Date(rental.endDate).toLocaleDateString()}
//                   </TableCell>
//                   <TableCell className="py-4 px-6">
//                     ₹{rental.totalCost.toFixed(2)}
//                   </TableCell>
//                   <TableCell className="py-4 px-6">
//                     <span
//                       className={cn(
//                         "px-3 py-1.5 rounded-full text-xs font-medium",
//                         getStatusColor(rental.status)
//                       )}
//                     >
//                       {rental.status}
//                     </span>
//                   </TableCell>
//                   <TableCell className="py-4 px-6">
//                     {rental.paymentReferenceNumber || "N/A"}
//                   </TableCell>
//                   <TableCell className="text-right py-4 px-6">
//                     <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                       <DialogTrigger asChild>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => {
//                             setSelectedRental(rental);
//                             form.setValue(
//                               "paymentReferenceNumber",
//                               rental.paymentReferenceNumber || ""
//                             );
//                           }}
//                         >
//                           Edit Payment
//                         </Button>
//                       </DialogTrigger>
//                       <DialogContent className="sm:max-w-[425px]">
//                         <DialogHeader>
//                           <DialogTitle>Update Payment Reference</DialogTitle>
//                         </DialogHeader>
//                         <Form {...form}>
//                           <form
//                             onSubmit={form.handleSubmit(onSubmit)}
//                             className="space-y-8"
//                           >
//                             <FormField
//                               control={form.control}
//                               name="paymentReferenceNumber"
//                               render={({ field }) => (
//                                 <FormItem>
//                                   <FormLabel>
//                                     Payment Reference Number
//                                   </FormLabel>
//                                   <FormControl>
//                                     <Input {...field} />
//                                   </FormControl>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />
//                             <Button type="submit">Update</Button>
//                           </form>
//                         </Form>
//                       </DialogContent>
//                     </Dialog>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </ScrollArea>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { getSessionToken } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Rental {
  _id: string;
  carId: {
    _id: string;
    make: string;
    model: string;
    year: number;
  };
  startDate: string;
  endDate: string;
  totalCost: number;
  status: string;
  paymentReferenceNumber: string;
}

const paymentSchema = z.object({
  paymentReferenceNumber: z
    .string()
    .min(1, "Payment reference number is required"),
});

export default function MyRentals() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentReferenceNumber: "",
    },
  });

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const token = await getSessionToken();
      const response = await axios.get(
        "http://localhost:3001/api/rental/user",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRentals(response.data.rentals);
    } catch (error) {
      console.error("Error fetching rentals:", error);
      toast({
        title: "Error",
        description: "Failed to fetch rentals. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof paymentSchema>) => {
    if (!selectedRental) return;

    try {
      const token = await getSessionToken();
      await axios.put(
        `http://localhost:3001/api/rental/${selectedRental._id}/payment`,
        { paymentReferenceNumber: values.paymentReferenceNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: "Success",
        description: "Payment reference number updated successfully.",
      });

      setIsDialogOpen(false);
      fetchRentals();
    } catch (error) {
      console.error("Error updating payment reference:", error);
      toast({
        title: "Error",
        description: "Failed to update payment reference. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
      case "paid":
        return "bg-green-500/20 text-green-300 border border-green-500/30";
      case "failed":
        return "bg-red-500/20 text-red-300 border border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          My Rentals
        </h1>
        <p className="text-gray-400 mt-2">
          View and manage your car rental bookings
        </p>
      </div>

      <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg shadow-2xl overflow-hidden">
        <ScrollArea className="h-[calc(100vh-300px)] w-full">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-gray-300 font-semibold py-4 px-6">Car</TableHead>
                <TableHead className="text-gray-300 font-semibold py-4 px-6">Start Date</TableHead>
                <TableHead className="text-gray-300 font-semibold py-4 px-6">End Date</TableHead>
                <TableHead className="text-gray-300 font-semibold py-4 px-6">Total Cost</TableHead>
                <TableHead className="text-gray-300 font-semibold py-4 px-6">Status</TableHead>
                <TableHead className="text-gray-300 font-semibold py-4 px-6">Payment Ref</TableHead>
                <TableHead className="text-gray-300 font-semibold text-right py-4 px-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentals.map((rental) => (
                <TableRow key={rental._id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="font-medium py-4 px-6 text-white">
                    {`${rental.carId.make} ${rental.carId.model} (${rental.carId.year})`}
                  </TableCell>
                  <TableCell className="py-4 px-6 text-gray-300">
                    {new Date(rental.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-4 px-6 text-gray-300">
                    {new Date(rental.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-4 px-6 text-white font-semibold">
                    ₹{rental.totalCost.toFixed(2)}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm",
                        getStatusColor(rental.status)
                      )}
                    >
                      {rental.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-gray-300">
                    {rental.paymentReferenceNumber || "N/A"}
                  </TableCell>
                  <TableCell className="text-right py-4 px-6">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-none text-white transition-all duration-300 hover:scale-105"
                          onClick={() => {
                            setSelectedRental(rental);
                            form.setValue(
                              "paymentReferenceNumber",
                              rental.paymentReferenceNumber || ""
                            );
                          }}
                        >
                          Edit Payment
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-slate-900 border border-white/20 backdrop-blur-sm">
                        <DialogHeader>
                          <DialogTitle className="text-white">Update Payment Reference</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                          >
                            <FormField
                              control={form.control}
                              name="paymentReferenceNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-300">
                                    Payment Reference Number
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="submit"
                              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none transition-all duration-300 hover:scale-105"
                            >
                              Update
                            </Button>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}