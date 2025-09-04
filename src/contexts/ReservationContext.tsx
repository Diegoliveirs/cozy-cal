import { createContext, useContext, useState, ReactNode } from "react";

export interface Reservation {
  id: string;
  guestName: string;
  phone: string;
  checkIn: Date;
  checkOut: Date;
  dailyRate: number;
  observations?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface ReservationContextType {
  reservations: Reservation[];
  addReservation: (reservation: Omit<Reservation, 'id'>) => void;
  updateReservation: (id: string, reservation: Partial<Reservation>) => void;
  deleteReservation: (id: string) => void;
  getReservationsForDate: (date: Date) => Reservation[];
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const ReservationProvider = ({ children }: { children: ReactNode }) => {
  const [reservations, setReservations] = useState<Reservation[]>([
    // Demo data
    {
      id: "1",
      guestName: "Maria Silva",
      phone: "+55 11 99999-9999",
      checkIn: new Date(2024, 0, 15),
      checkOut: new Date(2024, 0, 18),
      dailyRate: 250,
      observations: "Cliente preferencial, quarto com vista para o mar",
      status: 'confirmed'
    },
    {
      id: "2",
      guestName: "João Santos",
      phone: "+55 11 88888-8888",
      checkIn: new Date(2024, 0, 20),
      checkOut: new Date(2024, 0, 22),
      dailyRate: 180,
      observations: "",
      status: 'pending'
    }
  ]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addReservation = (reservation: Omit<Reservation, 'id'>) => {
    const newReservation = {
      ...reservation,
      id: generateId(),
    };
    setReservations(prev => [...prev, newReservation]);
  };

  const updateReservation = (id: string, updatedReservation: Partial<Reservation>) => {
    setReservations(prev =>
      prev.map(reservation =>
        reservation.id === id ? { ...reservation, ...updatedReservation } : reservation
      )
    );
  };

  const deleteReservation = (id: string) => {
    setReservations(prev => prev.filter(reservation => reservation.id !== id));
  };

  const getReservationsForDate = (date: Date) => {
    return reservations.filter(reservation => {
      const checkIn = new Date(reservation.checkIn);
      const checkOut = new Date(reservation.checkOut);
      
      checkIn.setHours(0, 0, 0, 0);
      checkOut.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      
      return date >= checkIn && date < checkOut;
    });
  };

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        addReservation,
        updateReservation,
        deleteReservation,
        getReservationsForDate,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservations = () => {
  const context = useContext(ReservationContext);
  if (context === undefined) {
    throw new Error('useReservations must be used within a ReservationProvider');
  }
  return context;
};