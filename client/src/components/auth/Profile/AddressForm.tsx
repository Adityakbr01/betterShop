"use client";

import { useEffect, useState } from "react";
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
import { MapPin, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const addAddressSchema = z.object({
  street: z.string().min(2).max(100),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  postalCode: z.string().min(2).max(20),
  country: z.string().min(2).max(100),
  isDefault: z.boolean().optional(),
  addressId: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type FormData = z.infer<typeof addAddressSchema>;

interface AddressFormProps {
  mutation: any;
  onSuccess?: () => void;
  initialData?: Partial<FormData> | null;
}

const AddressForm = ({ mutation, onSuccess, initialData }: AddressFormProps) => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationData, setLocationData] = useState<{
    latitude: number;
    longitude: number;
    source: 'gps' | 'ip' | 'fallback';
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(addAddressSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      isDefault: false,
      latitude: undefined,
      longitude: undefined,
    },
  });

  // ✅ Populate form when editing
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
      if (initialData.latitude && initialData.longitude) {
        setLocationData({
          latitude: initialData.latitude,
          longitude: initialData.longitude,
          source: 'gps'
        });
      }
    }
  }, [initialData, form]);

  // Try to get location using IP-based geolocation as fallback
  const getLocationFromIP = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.latitude && data.longitude) {
        return {
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          source: 'ip' as const
        };
      }
    } catch (error) {
      console.error('IP geolocation failed:', error);
    }
    return null;
  };

  // Fallback coordinates (can be default city coordinates)
  const getFallbackLocation = () => {
    // You can set your default city coordinates here
    // Example: Delhi coordinates
    return {
      latitude: 28.6139,
      longitude: 77.2090,
      source: 'fallback' as const
    };
  };

  // Enhanced location getter with multiple fallbacks
  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    setLocationError(null);

    // First try: GPS/Browser geolocation
    if (navigator.geolocation) {
      try {
        await new Promise<void>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              
              setLocationData({ latitude, longitude, source: 'gps' });
              form.setValue("latitude", latitude);
              form.setValue("longitude", longitude);
              
              toast.success("Exact location captured!");
              resolve();
            },
            (error) => {
              console.error('GPS geolocation failed:', error);
              reject(error);
            },
            {
              enableHighAccuracy: true,
              timeout: 8000,
              maximumAge: 0,
            }
          );
        });
        setIsGettingLocation(false);
        return;
      } catch (gpsError) {
        console.error('GPS failed, trying IP geolocation...', gpsError);
      }
    }

    // Second try: IP-based geolocation
    try {
      const ipLocation = await getLocationFromIP();
      if (ipLocation) {
        setLocationData(ipLocation);
        form.setValue("latitude", ipLocation.latitude);
        form.setValue("longitude", ipLocation.longitude);
        
        toast.success("Location detected from your network!");
        setIsGettingLocation(false);
        return;
      }
    } catch (ipError) {
      console.error('IP geolocation failed, using fallback...', ipError);
    }

    // Third try: Fallback location
    const fallbackLocation = getFallbackLocation();
    setLocationData(fallbackLocation);
    form.setValue("latitude", fallbackLocation.latitude);
    form.setValue("longitude", fallbackLocation.longitude);
    
    setLocationError("Using approximate location. For better accuracy, please enable location access.");
    toast.success("Default location set successfully!");
    setIsGettingLocation(false);
  };

  // Auto-attempt location on component mount
  useEffect(() => {
    if (!initialData && !locationData) {
      // Silently try to get location on load
      getCurrentLocation();
    }
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      // Ensure we have coordinates - get them if we don't
      let finalLatitude = locationData?.latitude;
      let finalLongitude = locationData?.longitude;

      if (!finalLatitude || !finalLongitude) {
        const fallback = getFallbackLocation();
        finalLatitude = fallback.latitude;
        finalLongitude = fallback.longitude;
      }

      const submitData = {
        ...data,
        latitude: finalLatitude,
        longitude: finalLongitude,
      };

      const res = await mutation.mutateAsync(submitData);

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (storedUser) {
        storedUser.addresses = res?.data?.addresses || [];
        localStorage.setItem("user", JSON.stringify(storedUser));
      }
      setUser({ ...storedUser, addresses: res?.data?.addresses });
      
      form.reset();
      setLocationData(null);
      setLocationError(null);
      onSuccess?.();

      toast.success(
        res.message || (data.addressId ? "Address updated successfully" : "Address added successfully")
      );
    } catch (err) {
      console.error("Error saving address", err);
      toast.error("Failed to save address");
    }
  };

  const getLocationStatusText = () => {
    if (!locationData) return "Location not captured";
    
    switch (locationData.source) {
      case 'gps':
        return "✅ Exact GPS location";
      case 'ip':
        return "📍 Network-based location";
      case 'fallback':
        return "📌 Approximate location";
      default:
        return "Location captured";
    }
  };

  const getLocationAccuracy = () => {
    if (!locationData) return "";
    
    switch (locationData.source) {
      case 'gps':
        return "(High accuracy)";
      case 'ip':
        return "(City-level accuracy)";
      case 'fallback':
        return "(Default location)";
      default:
        return "";
    }
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Location Section */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location Detection
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="flex items-center gap-2"
              >
                {isGettingLocation ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
                {isGettingLocation ? "Detecting..." : "Detect Location"}
              </Button>
            </div>
            
            {locationData && (
              <div className="space-y-2">
                <div className="text-xs font-medium text-green-700">
                  {getLocationStatusText()} {getLocationAccuracy()}
                </div>
                <div className="text-xs text-gray-600 grid grid-cols-2 gap-2">
                  <div>Lat: {locationData.latitude.toFixed(6)}</div>
                  <div>Lng: {locationData.longitude.toFixed(6)}</div>
                </div>
              </div>
            )}
            
            {locationError && (
              <Alert className="mt-3">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  {locationError}
                </AlertDescription>
              </Alert>
            )}

            {!locationData && !isGettingLocation && (
              <p className="text-xs text-gray-500">
                Location will be automatically detected. Click "Detect Location" to retry.
              </p>
            )}
          </div>

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