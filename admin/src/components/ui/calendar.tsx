import * as React from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Placeholder for DayPicker
export type DayPickerProps = {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: boolean;
  mode?: "single" | "multiple" | "range";
  className?: string;
  showOutsideDays?: boolean;
  initialFocus?: boolean;
  footer?: React.ReactNode;
  components?: {
    Footer?: React.FC<any>;
  };
};

export function DayPicker({
  selected,
  onSelect,
  disabled = false,
  className,
  footer,
  components,
}: DayPickerProps) {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  
  // Generate days for the current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, () => null);
  
  const allDays = [...blanks, ...days];
  
  const isSelected = (day: number) => {
    if (!selected) return false;
    return (
      selected.getDate() === day &&
      selected.getMonth() === month &&
      selected.getFullYear() === year
    );
  };
  
  const handleDayClick = (day: number) => {
    if (disabled) return;
    const newDate = new Date(year, month, day);
    onSelect?.(newDate);
  };
  
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  return (
    <div className={cn("p-3", className)}>
      <div className="flex justify-center py-2 font-medium">
        {`${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(today)} ${year}`}
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {weekdays.map((day) => (
          <div key={day} className="py-1 text-muted-foreground">
            {day}
          </div>
        ))}
        
        {allDays.map((day, index) => {
          if (day === null) {
            return <div key={`blank-${index}`} />;
          }
          
          const isToday = 
            today.getDate() === day && 
            today.getMonth() === month && 
            today.getFullYear() === year;
            
          return (
            <button
              key={`day-${day}`}
              type="button"
              disabled={disabled}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-9 w-9 p-0 font-normal",
                isSelected(day) && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                isToday && !isSelected(day) && "border border-primary",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => handleDayClick(day)}
            >
              {day}
            </button>
          );
        })}
      </div>
      
      {footer && <div className="mt-3">{footer}</div>}
      {components?.Footer && <components.Footer />}
      
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>Calendar functionality has been removed as requested.</p>
        <p>This is a placeholder component.</p>
      </div>
    </div>
  );
}

export interface CalendarProps extends DayPickerProps {}

function Calendar({
  className,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      className={cn("p-3", className)}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };