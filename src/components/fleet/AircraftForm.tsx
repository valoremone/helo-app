import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { Aircraft } from '@/types/fleet';

const aircraftFormSchema = z.object({
  registration: z.string().min(2, 'Registration must be at least 2 characters'),
  type: z.string().min(2, 'Type must be at least 2 characters'),
  manufacturer: z.string().min(2, 'Manufacturer must be at least 2 characters'),
  model: z.string().min(2, 'Model must be at least 2 characters'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  baseLocation: z.string().min(3, 'Base location must be at least 3 characters'),
  status: z.enum(['available', 'in-maintenance', 'in-flight', 'reserved']),
  totalFlightHours: z.number().min(0, 'Flight hours cannot be negative'),
  lastMaintenance: z.string(),
  nextMaintenance: z.string(),
  amenities: z.array(z.string()),
  images: z.object({
    main: z.string().url('Main image must be a valid URL'),
    gallery: z.array(z.string().url('Gallery images must be valid URLs')),
  }),
});

type AircraftFormValues = z.infer<typeof aircraftFormSchema>;

interface AircraftFormProps {
  initialData?: Partial<Aircraft>;
  onSubmit: (data: AircraftFormValues) => void;
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

  const form = useForm<AircraftFormValues>({
    resolver: zodResolver(aircraftFormSchema),
    defaultValues: {
      registration: initialData?.registration || '',
      type: initialData?.type || 'Jet',
      manufacturer: initialData?.manufacturer || '',
      model: initialData?.model || '',
      capacity: initialData?.capacity || 1,
      baseLocation: initialData?.baseLocation || '',
      status: initialData?.status || 'available',
      totalFlightHours: initialData?.totalFlightHours || 0,
      lastMaintenance: initialData?.lastMaintenance || new Date().toISOString().split('T')[0],
      nextMaintenance: initialData?.nextMaintenance || new Date().toISOString().split('T')[0],
      amenities: initialData?.amenities || [],
      images: initialData?.images || {
        main: '',
        gallery: [],
      },
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="registration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration</FormLabel>
                <FormControl>
                  <Input placeholder="N123AB" {...field} />
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {AIRCRAFT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <Input placeholder="Manufacturer" {...field} />
                </FormControl>
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
                  <Input placeholder="Model" {...field} />
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
                <FormLabel>Capacity (seats)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
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
            name="totalFlightHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Flight Hours</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
            name="lastMaintenance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Maintenance</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nextMaintenance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Next Maintenance</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="images.main"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Main Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Amenities</FormLabel>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {COMMON_AMENITIES.map((amenity) => (
              <Button
                key={amenity}
                type="button"
                variant={selectedAmenities.includes(amenity) ? 'default' : 'outline'}
                className="justify-start"
                onClick={() => toggleAmenity(amenity)}
              >
                {amenity}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isLoading}>
            {initialData ? 'Update Aircraft' : 'Add Aircraft'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 