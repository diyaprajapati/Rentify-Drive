"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getSessionToken } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import Particles from "@/components/particles";

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
  available: boolean;
}

interface FormData {
  make: string;
  model: string;
  year: string;
  color: string;
  licensePlate: string;
  seats: string;
  fuelType: string;
  transmission: string;
  pricePerDay: string;
  features: string;
  images: File[];
}

export default function CarAdminDashboard() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [formData, setFormData] = useState<FormData>({
    make: "",
    model: "",
    year: "",
    color: "",
    licensePlate: "",
    seats: "",
    fuelType: "petrol",
    transmission: "automatic",
    pricePerDay: "",
    features: "",
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setIsLoading(true);
      const token = await getSessionToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cars`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setCars(data.cars);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      toast({
        title: "Error",
        description: "Failed to fetch cars. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (carId: string, carName: string) => {
    try {
      const token = await getSessionToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cars/${carId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: `${carName} has been deleted successfully.`,
        });
        fetchCars();
      } else {
        throw new Error(data.message || "Failed to delete car");
      }
    } catch (error) {
      console.error("Error deleting car:", error);
      toast({
        title: "Error",
        description: "Failed to delete car. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const imageFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        images: imageFiles,
      }));

      const previewUrls = imageFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews(previewUrls);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = selectedCar
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cars/${selectedCar._id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cars`
      const method = selectedCar ? "PUT" : "POST";

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "images") {
          if (Array.isArray(value)) {
            value.forEach((image) => {
              if (image instanceof File) {
                formDataToSend.append(`images`, image);
              } else if (typeof image === "string") {
                formDataToSend.append(`existingImages`, image);
              }
            });
            removedImages.forEach((removed) => {
              formDataToSend.append("removedImages", removed);
            });

          }
        } else {
          formDataToSend.append(key, value as string);
        }
      });

      const token = await getSessionToken();
      const response = await fetch(url, {
        method,
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${token} `,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: selectedCar ? "Car updated successfully." : "Car created successfully.",
        });
        fetchCars();
        setIsCreateDialogOpen(false);
        setSelectedCar(null);
        setFormData({
          make: "",
          model: "",
          year: "",
          color: "",
          licensePlate: "",
          seats: "",
          fuelType: "petrol",
          transmission: "automatic",
          pricePerDay: "",
          features: "",
          images: [],
        });
        setImagePreviews([]);
      }
    } catch (error) {
      console.error("Error saving car:", error);
      toast({
        title: "Error",
        description: "Failed to save car. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (car: Car) => {
    setSelectedCar(car);
    setFormData({
      make: car.make,
      model: car.model,
      year: car.year.toString(),
      color: car.color,
      licensePlate: car.licensePlate,
      seats: car.seats.toString(),
      fuelType: car.fuelType,
      transmission: car.transmission,
      pricePerDay: car.pricePerDay.toString(),
      features: car.features.join(", "),
      images: car.images as any,
    });
    setImagePreviews(car.images.map((image: string) => `${image} `));
    setIsCreateDialogOpen(true);
  };

  const handleImageDelete = (index: number) => {
    const updatedPreviews = [...imagePreviews];
    const updatedImages = [...formData.images];

    const removed = updatedImages[index];

    if (typeof removed === "string") {
      setRemovedImages((prev) => [...prev, removed]); // store for backend
    }

    updatedPreviews.splice(index, 1);
    updatedImages.splice(index, 1);

    setImagePreviews(updatedPreviews);
    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-slate-950 text-white overflow-hidden relative">
      <Particles />
      <Card className="backdrop-blur-sm bg-white/5 border border-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Car Management
          </CardTitle>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none transition-all duration-300 hover:scale-105">
                <Plus className="mr-2 h-4 w-4" />
                Add New Car
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl backdrop-blur-sm bg-slate-900/95 border border-white/20 text-white">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-white">
                  {selectedCar ? "Edit Car" : "Add New Car"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-gray-300">Brand</label>
                    <Input
                      name="make"
                      value={formData.make}
                      onChange={handleInputChange}
                      required
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-300">Model</label>
                    <Input
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      required
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-300">Year</label>
                    <Input
                      name="year"
                      type="number"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-300">Color</label>
                    <Input
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-300">License Plate</label>
                    <Input
                      name="licensePlate"
                      value={formData.licensePlate}
                      onChange={handleInputChange}
                      required
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-300">Seats</label>
                    <Input
                      name="seats"
                      type="number"
                      value={formData.seats}
                      onChange={handleInputChange}
                      required
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-300">Fuel Type</label>
                    <Select
                      value={formData.fuelType}
                      onValueChange={(value) =>
                        handleSelectChange("fuelType", value)
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/20 text-white focus:border-purple-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/20 text-white">
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-300">Transmission</label>
                    <Select
                      value={formData.transmission}
                      onValueChange={(value) =>
                        handleSelectChange("transmission", value)
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/20 text-white focus:border-purple-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/20 text-white">
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="automatic">Automatic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-300">Price Per Day</label>
                    <Input
                      name="pricePerDay"
                      type="number"
                      value={formData.pricePerDay}
                      onChange={handleInputChange}
                      required
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-300">Features (comma-separated)</label>
                    <Input
                      name="features"
                      value={formData.features}
                      onChange={handleInputChange}
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-gray-300">Images</label>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="bg-white/5 border-white/20 text-white file:bg-purple-500 file:text-white file:border-none file:rounded-md file:px-3 file:py-1"
                    />
                    {/* {imagePreviews.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {imagePreviews.map((preview, index) => (
                          <img
                            key={index}
                            src={preview}
                            alt={`Preview ${ index + 1 } `}
                            className="w-24 h-24 object-cover rounded-md border border-white/20"
                          />
                        ))}
                      </div>
                    )} */}
                    {imagePreviews.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1} `}
                              className="w-24 h-24 object-cover rounded-md border border-white/20"
                            />
                            <button
                              type="button"
                              onClick={() => handleImageDelete(index)}
                              className="absolute top-0 right-0 bg-red-600 text-white text-xs px-2 py-1 rounded-bl opacity-0 group-hover:opacity-100 transition"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="border-white/20 text-black hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none"
                  >
                    {selectedCar ? "Update Car" : "Create Car"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-gray-300">Brand</TableHead>
                  <TableHead className="text-gray-300">Model</TableHead>
                  <TableHead className="text-gray-300">Year</TableHead>
                  <TableHead className="text-gray-300">License Plate</TableHead>
                  <TableHead className="text-gray-300">Price/Day</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cars.map((car) => (
                  <TableRow key={car._id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="text-white">{car.make}</TableCell>
                    <TableCell className="text-white">{car.model}</TableCell>
                    <TableCell className="text-white">{car.year}</TableCell>
                    <TableCell className="text-white">{car.licensePlate}</TableCell>
                    <TableCell className="text-white">₹{car.pricePerDay}</TableCell>
                    <TableCell>
                      {car.available ? (
                        <span className="text-green-400 bg-green-400/20 px-2 py-1 rounded-full text-xs">
                          Available
                        </span>
                      ) : (
                        <span className="text-red-400 bg-red-400/20 px-2 py-1 rounded-full text-xs">
                          Unavailable
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(car)}
                          className="hover:bg-purple-500/20 text-purple-400"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-red-500/20 text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="backdrop-blur-sm bg-slate-900/95 border border-white/20 text-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">
                                Are you sure you want to delete this car?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-300">
                                This action cannot be undone. This will permanently delete the{" "}
                                <span className="font-semibold text-white">
                                  {car.make} {car.model} ({car.year})
                                </span>{" "}
                                from the system.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(car._id, `${car.make} ${car.model} `)}
                                className="bg-red-500 hover:bg-red-600 text-white"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}