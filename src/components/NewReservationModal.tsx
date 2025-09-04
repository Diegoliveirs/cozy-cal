import { useState } from "react";
import { Plus, User, Phone, Calendar, DollarSign, FileText } from "lucide-react";
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
import { useReservations } from "@/contexts/ReservationContext";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NewReservationModalProps {
  date: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewReservationModal = ({ date, open, onOpenChange }: NewReservationModalProps) => {
  const { addReservation } = useReservations();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    guestName: "",
    phone: "",
    checkIn: format(date, "yyyy-MM-dd"),
    checkOut: format(new Date(date.getTime() + 86400000), "yyyy-MM-dd"), // +1 day
    dailyRate: "",
    observations: "",
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
      addReservation({
        guestName: formData.guestName,
        phone: formData.phone,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        dailyRate: parseFloat(formData.dailyRate),
        observations: formData.observations,
        status: 'confirmed',
      });

      toast({
        title: "Reserva criada com sucesso!",
        description: `Reserva para ${formData.guestName} foi registrada.`,
      });

      onOpenChange(false);
      
      // Reset form
      setFormData({
        guestName: "",
        phone: "",
        checkIn: format(date, "yyyy-MM-dd"),
        checkOut: format(new Date(date.getTime() + 86400000), "yyyy-MM-dd"),
        dailyRate: "",
        observations: "",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar a reserva.",
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
            <Plus className="h-5 w-5 text-primary" />
            Nova Reserva
          </DialogTitle>
          <DialogDescription>
            Criar nova reserva para {format(date, "dd 'de' MMMM", { locale: ptBR })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guestName" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Nome do Hóspede *
            </Label>
            <Input
              id="guestName"
              placeholder="Digite o nome completo"
              value={formData.guestName}
              onChange={(e) => handleInputChange("guestName", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Telefone *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+55 11 99999-9999"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkIn" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data de Entrada
              </Label>
              <Input
                id="checkIn"
                type="date"
                value={formData.checkIn}
                onChange={(e) => handleInputChange("checkIn", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkOut" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data de Saída
              </Label>
              <Input
                id="checkOut"
                type="date"
                value={formData.checkOut}
                onChange={(e) => handleInputChange("checkOut", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dailyRate" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Valor da Diária (R$) *
            </Label>
            <Input
              id="dailyRate"
              type="number"
              step="0.01"
              placeholder="250.00"
              value={formData.dailyRate}
              onChange={(e) => handleInputChange("dailyRate", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Observações (Opcional)
            </Label>
            <Textarea
              id="observations"
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
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-primary shadow-soft hover:shadow-hover transition-all"
            >
              {isLoading ? "Salvando..." : "Salvar Reserva"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};