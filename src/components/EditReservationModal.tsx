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
import { usarReservas, type Reserva } from "@/contexts/ReservationContext";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface PropsModalEditarReserva {
  reserva: Reserva;
  aberto: boolean;
  aoMudarAberto: (aberto: boolean) => void;
  aoFechar: () => void;
}

export const ModalEditarReserva = ({ 
  reserva, 
  aberto, 
  aoMudarAberto, 
  aoFechar 
}: PropsModalEditarReserva) => {
  const { atualizarReserva } = usarReservas();
  const [estaCarregando, setEstaCarregando] = useState(false);
  
  const [dadosFormulario, setDadosFormulario] = useState({
    nomeHospede: reserva.nomeHospede,
    telefone: reserva.telefone,
    dataEntrada: format(reserva.dataEntrada, "yyyy-MM-dd"),
    dataSaida: format(reserva.dataSaida, "yyyy-MM-dd"),
    valorDiaria: reserva.valorDiaria.toString(),
    observacoes: reserva.observacoes || "",
    status: reserva.status,
  });

  const lidarComSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstaCarregando(true);

    if (!dadosFormulario.nomeHospede || !dadosFormulario.telefone || !dadosFormulario.valorDiaria) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      setEstaCarregando(false);
      return;
    }

    const dataEntrada = new Date(dadosFormulario.dataEntrada);
    const dataSaida = new Date(dadosFormulario.dataSaida);

    if (dataSaida <= dataEntrada) {
      toast({
        title: "Erro",
        description: "A data de saída deve ser posterior à data de entrada.",
        variant: "destructive",
      });
      setEstaCarregando(false);
      return;
    }

    try {
      atualizarReserva(reserva.id, {
        nomeHospede: dadosFormulario.nomeHospede,
        telefone: dadosFormulario.telefone,
        dataEntrada: dataEntrada,
        dataSaida: dataSaida,
        valorDiaria: parseFloat(dadosFormulario.valorDiaria),
        observacoes: dadosFormulario.observacoes,
        status: dadosFormulario.status as Reserva['status'],
      });

      toast({
        title: "Reserva atualizada com sucesso!",
        description: `Reserva de ${dadosFormulario.nomeHospede} foi atualizada.`,
      });

      aoFechar();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar a reserva.",
        variant: "destructive",
      });
    } finally {
      setEstaCarregando(false);
    }
  };

  const lidarComMudancaInput = (campo: string, valor: string) => {
    setDadosFormulario(anterior => ({ ...anterior, [campo]: valor }));
  };

  return (
    <Dialog open={aberto} onOpenChange={aoMudarAberto}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit2 className="h-5 w-5 text-primary" />
            Editar Reserva
          </DialogTitle>
          <DialogDescription>
            Atualize as informações da reserva de {reserva.nomeHospede}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={lidarComSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-nomeHospede" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Nome do Hóspede *
            </Label>
            <Input
              id="edit-nomeHospede"
              placeholder="Digite o nome completo"
              value={dadosFormulario.nomeHospede}
              onChange={(e) => lidarComMudancaInput("nomeHospede", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-telefone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Telefone *
            </Label>
            <Input
              id="edit-telefone"
              type="tel"
              placeholder="+55 11 99999-9999"
              value={dadosFormulario.telefone}
              onChange={(e) => lidarComMudancaInput("telefone", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-dataEntrada" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data de Entrada
              </Label>
              <Input
                id="edit-dataEntrada"
                type="date"
                value={dadosFormulario.dataEntrada}
                onChange={(e) => lidarComMudancaInput("dataEntrada", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-dataSaida" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data de Saída
              </Label>
              <Input
                id="edit-dataSaida"
                type="date"
                value={dadosFormulario.dataSaida}
                onChange={(e) => lidarComMudancaInput("dataSaida", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-valorDiaria" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Valor da Diária (R$) *
            </Label>
            <Input
              id="edit-valorDiaria"
              type="number"
              step="0.01"
              placeholder="250.00"
              value={dadosFormulario.valorDiaria}
              onChange={(e) => lidarComMudancaInput("valorDiaria", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-status">Status da Reserva</Label>
            <Select value={dadosFormulario.status} onValueChange={(valor) => lidarComMudancaInput("status", valor)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confirmada">Confirmada</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-observacoes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Observações (Opcional)
            </Label>
            <Textarea
              id="edit-observacoes"
              placeholder="Observações especiais, preferências do hóspede..."
              value={dadosFormulario.observacoes}
              onChange={(e) => lidarComMudancaInput("observacoes", e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={aoFechar}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={estaCarregando}
              className="flex-1 bg-gradient-primary shadow-soft hover:shadow-hover transition-all"
            >
              {estaCarregando ? "Salvando..." : "Atualizar Reserva"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};