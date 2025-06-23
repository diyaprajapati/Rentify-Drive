//@ts-nocheck
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
import { Plus, Pencil, Car as CarIcon } from "lucide-react";
import { getSessionToken } from "@/lib/utils";

const CarAdminDashboard = () => {
  const [cars, setCars] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const token = await getSessionToken();
      const response = await fetch("http://localhost:3001/api/cars", {
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
    }
  };

  const handleInputChange = (e: any) => {
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

      // Create preview URLs for the selected images
      const previewUrls = imageFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews(previewUrls);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const url = selectedCar
        ? `http://localhost:3001/api/cars/${selectedCar._id}`
        : "http://localhost:3001/api/cars";
      const method = selectedCar ? "PUT" : "POST";

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "images") {
          if (Array.isArray(value)) {
            value.forEach((image, index) => {
              if (image instanceof File) {
                formDataToSend.append(`images`, image);
              } else if (typeof image === "string") {
                formDataToSend.append(`existingImages`, image);
              }
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
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
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
    }
  };

  const handleEdit = (car: any) => {
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
      images: car.images, // Keep the existing images
    });
    // Set image previews for existing images
    setImagePreviews(car.images.map((image: string) => `${image}`));
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Car Management</CardTitle>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Car
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedCar ? "Edit Car" : "Add New Car"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label>Make</label>
                    <Input
                      name="make"
                      value={formData.make}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label>Model</label>
                    <Input
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label>Year</label>
                    <Input
                      name="year"
                      type="number"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label>Color</label>
                    <Input
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label>License Plate</label>
                    <Input
                      name="licensePlate"
                      value={formData.licensePlate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label>Seats</label>
                    <Input
                      name="seats"
                      type="number"
                      value={formData.seats}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label>Fuel Type</label>
                    <Select
                      value={formData.fuelType}
                      onValueChange={(value) =>
                        handleSelectChange("fuelType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label>Transmission</label>
                    <Select
                      value={formData.transmission}
                      onValueChange={(value: any) =>
                        handleSelectChange("transmission", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="automatic">Automatic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label>Price Per Day</label>
                    <Input
                      name="pricePerDay"
                      type="number"
                      value={formData.pricePerDay}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label>Features (comma-separated)</label>
                    <Input
                      name="features"
                      value={formData.features}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label>Images</label>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {imagePreviews.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {imagePreviews.map((preview, index) => (
                          <img
                            key={index}
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-24 h-24 object-cover rounded-md"
                          />
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
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {selectedCar ? "Update Car" : "Create Car"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Make</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>License Plate</TableHead>
                <TableHead>Price/Day</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cars.map((car) => (
                <TableRow key={car._id}>
                  <TableCell>{car.make}</TableCell>
                  <TableCell>{car.model}</TableCell>
                  <TableCell>{car.year}</TableCell>
                  <TableCell>{car.licensePlate}</TableCell>
                  <TableCell>${car.pricePerDay}</TableCell>
                  <TableCell>
                    {car.available ? (
                      <span className="text-green-600">Available</span>
                    ) : (
                      <span className="text-red-600">Unavailable</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(car)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarAdminDashboard;
