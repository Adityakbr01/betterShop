"use client";

// import AddressDialog from "@/components/auth/Profile/AddressDialog";
import EmailDialog from "@/components/auth/Profile/EmailDialog";
import ProfileCard from "@/components/auth/Profile/ProfileCard";
import { useUser } from "@/hooks/useUser";
import { useAuthStore } from "@/store/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// --- Zod Schema ---
export const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  isDefault: z.boolean(),
  addressId: z.string().optional(),
});

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});
export type ProfileFormValues = z.infer<typeof profileSchema>;

// --- Main Profile Page Component ---
const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const { control, handleSubmit, watch, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    }
  });
  const { data: me, isLoading, isError } = useUser();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6 font-NeuMechina"
    >
      <h1 className="text-3xl font-bold">Profile</h1>
      <ProfileCard
        watch={watch}
        setOpenEmailDialog={setOpenEmailDialog}
        me={me}
        isLoading={isLoading}

      />

      <EmailDialog
        open={openEmailDialog}
        setOpen={setOpenEmailDialog}
        control={control}
        handleSubmit={handleSubmit}
      />
    </motion.div>
  );
};

export default ProfilePage;