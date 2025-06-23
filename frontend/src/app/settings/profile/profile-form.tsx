"use client"
import React, { Suspense, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { base64ToFile, getSessionToken } from "@/lib/utils";
import { useRouter } from "next/navigation";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];

const profileFormSchema = z.object({
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." })
    .max(200, { message: "Address must not be longer than 200 characters." }),
  mobileNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Please enter a valid mobile number.",
  }),
  file: z
    .any()
    .refine((files) => files?.length == 1, "Image is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .png and .gif files are accepted."
    ),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

const defaultValues: Partial<ProfileFormValues> = {
  address: "",
  mobileNumber: "",
};
type ProfileFormProps = {
  initialValues?: Partial<ProfileFormValues>;
  name?: string;
};

export function ProfileForm({ initialValues, name }: ProfileFormProps) {
  const { push } = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialValues ?? defaultValues,
    mode: "all",
  });

  async function onSubmit(data: ProfileFormValues) {
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
    // const sessionToken = await getSessionToken();
    // if (!sessionToken) {
    //   push("/signup");
    // }
    // const res = await axios.put("http://localhost:3001/users/profile", data, {
    //   headers: {
    //     Authorization: `Bearer ${sessionToken}`,
    //   },
    // });
    // console.log(res);
    const formData = new FormData();
    formData.append('address', data.address);
    formData.append('mobileNumber', data.mobileNumber);

    if (data.file && data.file[0]) {
      formData.append('image', data.file[0]);
    }

    try {
      const sessionToken = await getSessionToken();
      if (!sessionToken) {
        push("/signup");
        return;
      }

      const res = await axios.put("http://localhost:3001/users/profile", formData, {
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: "Profile updated successfully",
        description: "Your profile information has been updated.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("file", file);
    }
  };

  useEffect(() => {
    if (initialValues) {
      Object.keys(initialValues).forEach((key) => {
        form.setValue(key as keyof ProfileFormValues, initialValues[key as keyof ProfileFormValues]);
      });
    }
    if (initialValues?.file && typeof initialValues.file === "string") {
      const file = base64ToFile(initialValues.file, "uploaded_image.png");
      form.setValue("file", [file]); // Set file as array with one File object
      setImagePreview(initialValues.file); // Show the base64 image as preview
    }
  }, [initialValues, form]);

  return (
    <Form {...form}>
      <Suspense fallback={<div>Loading...</div>}>
      <div>{name ? `Hello! ${name}` : "Hello User"}</div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="123 Main St, City, Country"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>Please enter your full address.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mobileNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input placeholder="+1234567890" {...field} />
              </FormControl>
              <FormDescription>
                Enter your mobile number with country code.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Driving License Image</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-2">
                  <ImageIcon className="h-4 w-4" />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handleImageChange(e);
                      onChange(e.target.files);
                    }}
                    className="w-fit"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Upload a driving license photo. Max size: 1MB. Formats: .jpg, .png,
                .gif
              </FormDescription>
              <FormMessage />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full h-auto rounded-md"
                  />
                </div>
              )}
            </FormItem>
          )}
        />
        <Button type="submit">Update profile</Button>
      </form>
      </Suspense>
    </Form>
  );
}

export default ProfileForm;
