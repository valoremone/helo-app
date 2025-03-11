import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function BookingPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Book Your Flight</h1>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Flight Details</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="from">From</Label>
              <Input id="from" placeholder="Departure location" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Input id="to" placeholder="Arrival location" />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>
            <Button className="w-full">Continue to Passenger Details</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Route</span>
              <span className="font-medium">LAX → SFO</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">
                {date?.toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Aircraft</span>
              <span className="font-medium">Bell 429</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Estimated Duration</span>
              <span className="font-medium">1h 15m</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}