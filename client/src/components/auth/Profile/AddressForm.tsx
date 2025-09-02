"use client";

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import toast from "react-hot-toast";

const addAddressSchema = z.object({
  street: z.string().min(2).max(100),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  postalCode: z.string().min(2).max(20),
  country: z.string().min(2).max(100),
  isDefault: z.boolean().optional(),
  addressId: z.string().optional(), // for editing
});

type FormData = z.infer<typeof addAddressSchema>;

interface AddressFormProps {
  mutation: any; // add/edit mutation
  onSuccess?: () => void;
  initialData?: Partial<FormData> | null; // ✅ support editing
}

const AddressForm = ({ mutation, onSuccess, initialData }: AddressFormProps) => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const form = useForm<FormData>({
    resolver: zodResolver(addAddressSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      isDefault: false,
    },
  });

  // ✅ Populate form when editing
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);


  const onSubmit = async (data: FormData) => {
    try {
      const res = await mutation.mutateAsync(data);

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (storedUser) {
        storedUser.addresses = res?.data?.addresses || [];
        localStorage.setItem("user", JSON.stringify(storedUser));
      }
      setUser({ ...storedUser, addresses: res?.data?.addresses });
      form.reset();
      onSuccess?.();

      toast.success(
        res.message || (data.addressId ? "Address updated successfully" : "Address added successfully")
      );
    } catch (err) {
      console.error("Error saving address", err);
      toast.error("Failed to save address");
    }
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Street */}
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Street" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* City */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="City" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* State */}
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="State" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Postal Code */}
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Postal Code" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Country */}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Country" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Default Address */}
          <FormField
            control={form.control}
            name="isDefault"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Set as default address</FormLabel>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending
              ? "Saving..."
              : initialData
              ? "Update Address"
              : "Add Address"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
};

export default AddressForm;
