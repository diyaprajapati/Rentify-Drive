import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { getSessionToken } from "@/lib/utils";

const statusSchema = z.object({
  status: z.enum(["pending", "paid", "failed"]),
});

type StatusFormData = z.infer<typeof statusSchema>;

interface UpdateRentalStatusProps {
  rentalId: string;
  currentStatus: string;
  onUpdate: () => void;
}

export function UpdateRentalStatus({
  rentalId,
  currentStatus,
  onUpdate,
}: UpdateRentalStatusProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<StatusFormData>({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      status: currentStatus as "pending" | "paid" | "failed",
    },
  });

  const onSubmit = async (data: StatusFormData) => {
    setIsUpdating(true);
    try {
      const token = await getSessionToken();
      await axios.put(
        `http://localhost:3001/api/rental/${rentalId}/status`,
        { status: data.status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({
        title: "Success",
        description: "Rental status updated successfully.",
      });
      onUpdate();
    } catch (error) {
      console.error("Error updating rental status:", error);
      toast({
        title: "Error",
        description: "Failed to update rental status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex items-center space-x-2"
    >
      <Select
        onValueChange={(value) =>
          form.setValue("status", value as "pending" | "paid" | "failed")
        }
        defaultValue={form.watch("status")}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" disabled={isUpdating}>
        {isUpdating ? "Updating..." : "Update"}
      </Button>
    </form>
  );
}
