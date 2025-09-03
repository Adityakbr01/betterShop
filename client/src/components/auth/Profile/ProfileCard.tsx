"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BadgeCheck, BadgeX, Edit2 } from "lucide-react";
import AddressForm from "./AddressForm";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/store/auth";
import { useAuthMutations } from "@/api/useAuthApi";

// --- Profile Card Component ---
const ProfileCard = ({
    setOpenEmailDialog,
    me,
    isLoading
}: {
    watch: any;
    setOpenEmailDialog: (open: boolean) => void;
    me: any
    isLoading: boolean
}) => {
    const [openAddressDialog, setOpenAddressDialog] = useState(false);
    const [editingAddress, setEditingAddress] = useState<any | null>(null);

    const { addAddress } = useAuthMutations(); // handles add + edit
    const handleEditAddress = (addr: any) => {
        setEditingAddress({ ...addr, addressId: addr._id });
        setOpenAddressDialog(true);
    };

 //  latitude?: number; // for latitude
//   longitude?: number; // for longitude

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Name */}
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <Label>Name</Label>
                        <span>{me?.data?.user?.name || "Not set"}</span>
                    </div>
                </div>

                {/* Email */}
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <Label>Email</Label>
                        <span>{me?.data?.user?.email || "Not set"}</span>
                        {me?.data?.user?.isEmailVerified ? (
                            <Badge className="bg-green-500 text-white">
                                <BadgeCheck className="w-4 h-4 mr-1" /> Verified
                            </Badge>
                        ) : (
                            <Badge className="bg-red-500 text-white">
                                <BadgeX className="w-4 h-4 mr-1" /> Not Verified
                            </Badge>
                        )}
                    </div>
                    {!me?.data?.user?.isEmailVerified && (
                        <Edit2
                            className="cursor-pointer w-5 h-5"
                            onClick={() => setOpenEmailDialog(true)}
                        />
                    )}
                </div>

                {/* Addresses */}
                {me?.data?.user?.addresses?.length > 0 && (
                    <div className="space-y-2">
                        <Label>Addresses</Label>
                        <div className="space-y-2">
                            {me.data.user.addresses.map((addr: any,index:number) => (
                                <div

                                    key={index}
                                    className="border p-3 rounded-md flex flex-col relative"
                                >
                                    <span className="font-medium">
                                        {addr.street}, {addr.city}
                                    </span>
                                    <span>
                                        {addr.state}, {addr.postalCode}, {addr.country}
                                    </span>
                                    {addr.isDefault && (
                                        <Badge className="mt-1 bg-blue-500 text-white">
                                            Default
                                        </Badge>
                                    )}
                                    <Edit2
                                        className="cursor-pointer w-5 h-5 absolute top-2 right-2"
                                        onClick={() => handleEditAddress(addr)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}



                {/* Add/Edit Address Dialog */}
                <Dialog
                    open={openAddressDialog}
                    onOpenChange={(open) => {
                        setOpenAddressDialog(open);
                        if (!open) setEditingAddress(null); // reset after close
                    }}
                >
                    <DialogTrigger asChild>
                      
                            <Button>Add Address</Button>
                    

                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingAddress ? "Edit Address" : "Add a New Address"}
                            </DialogTitle>
                        </DialogHeader>
                        <AddressForm
                            mutation={addAddress}
                            initialData={editingAddress} // ✅ pass data if editing
                            onSuccess={() => {
                                setOpenAddressDialog(false);
                                setEditingAddress(null);
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
};

export default ProfileCard;
