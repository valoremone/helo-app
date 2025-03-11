import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MaintenanceRecord } from '@/types/maintenance';

interface MaintenanceFormProps {
  maintenance?: MaintenanceRecord;
  onSubmit: (data: Partial<MaintenanceRecord>) => Promise<void>;
  onCancel: () => void;
}

type MaintenanceStatus = MaintenanceRecord['status'];

export function MaintenanceForm({ maintenance, onSubmit, onCancel }: MaintenanceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState(maintenance?.description || '');
  const [date, setDate] = useState(maintenance?.date || new Date().toISOString().split('T')[0]);
  const [cost, setCost] = useState(maintenance?.cost?.toString() || '');
  const [status, setStatus] = useState<MaintenanceStatus>(maintenance?.status || 'pending');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({
        description,
        date,
        cost: parseFloat(cost),
        status,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cost">Cost</Label>
        <Input
          id="cost"
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          required
          min="0"
          step="0.01"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as MaintenanceStatus)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          required
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : maintenance ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}