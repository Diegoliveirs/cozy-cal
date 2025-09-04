import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useReservations } from "@/contexts/ReservationContext";
import { ReservationModal } from "./ReservationModal";
import { NewReservationModal } from "./NewReservationModal";

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const Calendar = ({ selectedDate, onDateSelect }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showNewReservationModal, setShowNewReservationModal] = useState(false);
  const { reservations, getReservationsForDate } = useReservations();

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Previous month's days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true });
    }

    // Next month's days to fill the grid
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({ date: nextDate, isCurrentMonth: false });
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const handleDateClick = (date: Date) => {
    onDateSelect(date);
    const reservationsForDate = getReservationsForDate(date);
    
    if (reservationsForDate.length > 0) {
      setShowReservationModal(true);
    } else {
      setShowNewReservationModal(true);
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <>
      <Card className="shadow-soft">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="hover:shadow-soft transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="hover:shadow-soft transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdays.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map(({ date, isCurrentMonth }, index) => {
              const reservationsForDate = getReservationsForDate(date);
              const hasReservations = reservationsForDate.length > 0;
              const isSelected = isSameDay(date, selectedDate);
              
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className={cn(
                    "h-12 p-1 text-sm transition-all duration-200 relative",
                    !isCurrentMonth && "text-muted-foreground opacity-50",
                    isToday(date) && "bg-primary/10 text-primary font-semibold",
                    isSelected && "bg-accent text-accent-foreground",
                    hasReservations && isCurrentMonth && "bg-success-light text-success-foreground",
                    "hover:shadow-soft hover:scale-105"
                  )}
                  onClick={() => handleDateClick(date)}
                >
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <span>{date.getDate()}</span>
                    {hasReservations && (
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle className="h-3 w-3" />
                        {reservationsForDate.length > 1 && (
                          <span className="text-xs font-bold">
                            {reservationsForDate.length}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {showReservationModal && (
        <ReservationModal
          date={selectedDate}
          open={showReservationModal}
          onOpenChange={setShowReservationModal}
        />
      )}

      {showNewReservationModal && (
        <NewReservationModal
          date={selectedDate}
          open={showNewReservationModal}
          onOpenChange={setShowNewReservationModal}
        />
      )}
    </>
  );
};