import { useState } from "react";
import { Edit2, Trash2, Phone, Calendar, DollarSign, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useReservations } from "@/contexts/ReservationContext";
import { EditReservationModal } from "./EditReservationModal";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReservationModalProps {
  date: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReservationModal = ({ date, open, onOpenChange }: ReservationModalProps) => {
  const { getReservationsForDate, deleteReservation } = useReservations();
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const reservations = getReservationsForDate(date);

  const handleEdit = (reservationId: string) => {
    setSelectedReservationId(reservationId);
    setShowEditModal(true);
  };

  const handleDelete = (reservationId: string) => {
    setSelectedReservationId(reservationId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedReservationId) {
      deleteReservation(selectedReservationId);
      toast({
        title: "Reserva cancelada",
        description: "A reserva foi removida com sucesso.",
      });
      setShowDeleteDialog(false);
      setSelectedReservationId(null);
      onOpenChange(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-success text-success-foreground">Confirmada</Badge>;
      case 'pending':
        return <Badge className="bg-warning text-warning-foreground">Pendente</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const selectedReservation = reservations.find(r => r.id === selectedReservationId);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Reservas para {format(date, "dd 'de' MMMM", { locale: ptBR })}
            </DialogTitle>
            <DialogDescription>
              {reservations.length} reserva(s) encontrada(s) para esta data
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {reservations.map((reservation) => (
              <Card key={reservation.id} className="shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold">{reservation.guestName}</h3>
                    </div>
                    {getStatusBadge(reservation.status)}
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{reservation.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(reservation.checkIn, "dd/MM")} - {format(reservation.checkOut, "dd/MM")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>R$ {reservation.dailyRate.toFixed(2)}/dia</span>
                    </div>
                    {reservation.observations && (
                      <div className="mt-2 text-xs bg-muted p-2 rounded">
                        <strong>Observações:</strong> {reservation.observations}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(reservation.id)}
                      className="flex-1 hover:shadow-soft transition-all"
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(reservation.id)}
                      className="flex-1"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Deletar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Cancelamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar a reserva de{" "}
              <strong>{selectedReservation?.guestName}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Confirmar Cancelamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Modal */}
      {showEditModal && selectedReservation && (
        <EditReservationModal
          reservation={selectedReservation}
          open={showEditModal}
          onOpenChange={setShowEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedReservationId(null);
          }}
        />
      )}
    </>
  );
};