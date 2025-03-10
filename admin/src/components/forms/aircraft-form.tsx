import { Aircraft } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const aircraftFormSchema = z.object({
  registration: z.string().min(2, 'Registration must be at least 2 characters'),
  type: z.string().min(1, 'Type is required'),
  model: z.string().min(1, 'Model is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  status: z.enum(['available', 'in-maintenance', 'in-use']),
  baseLocation: z.string().min(1, 'Base location is required'),
  totalFlightHours: z.number().min(0, 'Flight hours cannot be negative'),
  lastMaintenance: z.string().optional(),
  nextMaintenance: z.string().optional(),
});

type AircraftFormData = z.infer<typeof aircraftFormSchema>;

interface AircraftFormProps {
  aircraft?: Aircraft;
  onSubmit: (data: AircraftFormData) => void;
  onCancel: () => void;
}

export function AircraftForm({ aircraft, onSubmit, onCancel }: AircraftFormProps) {
  const form = useForm<AircraftFormData>({
    resolver: zodResolver(aircraftFormSchema),
    defaultValues: {
      registration: aircraft?.registration || '',
      type: aircraft?.type || '',
      model: aircraft?.model || '',
      capacity: aircraft?.capacity || 0,
      status: aircraft?.status || 'available',
      baseLocation: aircraft?.baseLocation || '',
      totalFlightHours: aircraft?.totalFlightHours || 0,
      lastMaintenance: aircraft?.lastMaintenance,
      nextMaintenance: aircraft?.nextMaintenance,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="registration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registration Number</FormLabel>
              <FormControl>
                <Input placeholder="N123AB" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Input placeholder="Jet" {...field} />
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
                  <Input placeholder="Gulfstream G650" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passenger Capacity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
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
                    <SelectItem value="in-use">In Use</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="baseLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Location</FormLabel>
              <FormControl>
                <Input placeholder="LAX" {...field} />
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
                  {...field}
                  onChange={e => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
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

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {aircraft ? 'Update Aircraft' : 'Add Aircraft'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 