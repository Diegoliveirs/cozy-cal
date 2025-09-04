import { useState } from "react";
import { Edit2, User, Phone, Calendar, DollarSign, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReservations, type Reservation } from "@/contexts/ReservationContext";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface EditReservationModalProps {
  reservation: Reservation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export const EditReservationModal = ({ 
  reservation, 
  open, 
  onOpenChange, 
  onClose 
}: EditReservationModalProps) => {
  const { updateReservation } = useReservations();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    guestName: reservation.guestName,
    phone: reservation.phone,
    checkIn: format(reservation.checkIn, "yyyy-MM-dd"),
    checkOut: format(reservation.checkOut, "yyyy-MM-dd"),
    dailyRate: reservation.dailyRate.toString(),
    observations: reservation.observations || "",
    status: reservation.status,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.guestName || !formData.phone || !formData.dailyRate) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);

    if (checkOutDate <= checkInDate) {
      toast({
        title: "Erro",
        description: "A data de saída deve ser posterior à data de entrada.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      updateReservation(reservation.id, {
        guestName: formData.guestName,
        phone: formData.phone,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        dailyRate: parseFloat(formData.dailyRate),
        observations: formData.observations,
        status: formData.status as Reservation['status'],
      });

      toast({
        title: "Reserva atualizada com sucesso!",
        description: `Reserva de ${formData.guestName} foi atualizada.`,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar a reserva.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit2 className="h-5 w-5 text-primary" />
            Editar Reserva
          </DialogTitle>
          <DialogDescription>
            Atualize as informações da reserva de {reservation.guestName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-guestName" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Nome do Hóspede *
            </Label>
            <Input
              id="edit-guestName"
              placeholder="Digite o nome completo"
              value={formData.guestName}
              onChange={(e) => handleInputChange("guestName", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Telefone *
            </Label>
            <Input
              id="edit-phone"
              type="tel"
              placeholder="+55 11 99999-9999"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-checkIn" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data de Entrada
              </Label>
              <Input
                id="edit-checkIn"
                type="date"
                value={formData.checkIn}
                onChange={(e) => handleInputChange("checkIn", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-checkOut" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data de Saída
              </Label>
              <Input
                id="edit-checkOut"
                type="date"
                value={formData.checkOut}
                onChange={(e) => handleInputChange("checkOut", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-dailyRate" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Valor da Diária (R$) *
            </Label>
            <Input
              id="edit-dailyRate"
              type="number"
              step="0.01"
              placeholder="250.00"
              value={formData.dailyRate}
              onChange={(e) => handleInputChange("dailyRate", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-status">Status da Reserva</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confirmed">Confirmada</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-observations" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Observações (Opcional)
            </Label>
            <Textarea
              id="edit-observations"
              placeholder="Observações especiais, preferências do hóspede..."
              value={formData.observations}
              onChange={(e) => handleInputChange("observations", e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-primary shadow-soft hover:shadow-hover transition-all"
            >
              {isLoading ? "Salvando..." : "Atualizar Reserva"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};