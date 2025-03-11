import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormControl } from '@/components/ui/form';
import { FormField } from '@/components/ui/form';
import { FormItem } from '@/components/ui/form';
import { FormLabel } from '@/components/ui/form';
import { FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { SelectContent } from '@/components/ui/select';
import { SelectItem } from '@/components/ui/select';
import { SelectTrigger } from '@/components/ui/select';
import { SelectValue } from '@/components/ui/select';
import { Aircraft, AircraftStatus } from '@/types/fleet';
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  registration: z.string().min(2).max(50),
  model: z.string().min(2).max(100),
  manufacturer: z.string().min(2).max(100),
  yearManufactured: z.coerce.number().min(1900).max(new Date().getFullYear()),
  status: z.enum(['available', 'in-maintenance', 'in-flight', 'reserved']),
  flightHours: z.coerce.number().min(0),
  range: z.coerce.number().min(0),
  cruisingSpeed: z.coerce.number().min(0),
  capacity: z.coerce.number().min(1),
  baseLocation: z.string().min(2).max(100),
  type: z.string().min(2).max(50),
  amenities: z.array(z.string()),
  images: z.object({
    main: z.string().url(),
    gallery: z.array(z.string().url()).optional(),
  }),
  lastMaintenance: z.string().optional(),
  nextMaintenance: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AircraftFormProps {
  initialData?: Partial<Aircraft>;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

const AIRCRAFT_TYPES = ['Jet', 'Helicopter', 'Turboprop'] as const;
const COMMON_AMENITIES = [
  'WiFi',
  'Full Kitchen',
  'Conference Room',
  'Bedroom',
  'Shower',
  'Entertainment System',
  'Satellite Phone',
  'Leather Seats',
  'Air Conditioning',
] as const;

export function AircraftForm({ initialData, onSubmit, isLoading }: AircraftFormProps) {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialData?.amenities || []
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      registration: initialData?.registration || '',
      model: initialData?.model || '',
      manufacturer: initialData?.manufacturer || '',
      yearManufactured: initialData?.yearManufactured || new Date().getFullYear(),
      status: (initialData?.status as AircraftStatus) || 'available',
      flightHours: initialData?.flightHours || 0,
      range: initialData?.range || 0,
      cruisingSpeed: initialData?.cruisingSpeed || 0,
      capacity: initialData?.capacity || 0,
      baseLocation: initialData?.baseLocation || '',
      type: initialData?.type || 'Jet',
      amenities: initialData?.amenities || [],
      images: initialData?.images || {
        main: 'https://example.com/placeholder.jpg',
        gallery: [],
      },
      lastMaintenance: initialData?.lastMaintenance,
      nextMaintenance: initialData?.nextMaintenance,
    },
  });

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => {
      const newAmenities = prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity];
      form.setValue('amenities', newAmenities);
      return newAmenities;
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="registration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration</FormLabel>
                <FormControl>
                  <Input placeholder="N12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Jet">Jet</SelectItem>
                    <SelectItem value="Turboprop">Turboprop</SelectItem>
                    <SelectItem value="Piston">Piston</SelectItem>
                    <SelectItem value="Helicopter">Helicopter</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="Citation X" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="manufacturer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manufacturer</FormLabel>
                <FormControl>
                  <Input placeholder="Cessna" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="yearManufactured"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year Manufactured</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="in-maintenance">In Maintenance</SelectItem>
                    <SelectItem value="in-flight">In Flight</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="flightHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Flight Hours</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="range"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Range (nm)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cruisingSpeed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cruising Speed (kts)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="baseLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base Location</FormLabel>
                <FormControl>
                  <Input placeholder="KJFK" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="images.main"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main Image URL</FormLabel>
                <FormControl>
                  <Input type="url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Aircraft"}
          </Button>
        </div>
      </form>
    </Form>
  );
}