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
import { usarReservas } from "@/contexts/ReservationContext";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PropsModalNovaReserva {
  data: Date;
  aberto: boolean;
  aoMudarAberto: (aberto: boolean) => void;
}

export const ModalNovaReserva = ({ data, aberto, aoMudarAberto }: PropsModalNovaReserva) => {
  const { adicionarReserva } = usarReservas();
  const [estaCarregando, setEstaCarregando] = useState(false);
  
  const [dadosFormulario, setDadosFormulario] = useState({
    nomeHospede: "",
    telefone: "",
    dataEntrada: format(data, "yyyy-MM-dd"),
    dataSaida: format(new Date(data.getTime() + 86400000), "yyyy-MM-dd"), // +1 day
    valorDiaria: "",
    observacoes: "",
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
      adicionarReserva({
        nomeHospede: dadosFormulario.nomeHospede,
        telefone: dadosFormulario.telefone,
        dataEntrada: dataEntrada,
        dataSaida: dataSaida,
        valorDiaria: parseFloat(dadosFormulario.valorDiaria),
        observacoes: dadosFormulario.observacoes,
        status: 'confirmada',
      });

      toast({
        title: "Reserva criada com sucesso!",
        description: `Reserva para ${dadosFormulario.nomeHospede} foi registrada.`,
      });

      aoMudarAberto(false);
      
      // Reset form
      setDadosFormulario({
        nomeHospede: "",
        telefone: "",
        dataEntrada: format(data, "yyyy-MM-dd"),
        dataSaida: format(new Date(data.getTime() + 86400000), "yyyy-MM-dd"),
        valorDiaria: "",
        observacoes: "",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar a reserva.",
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
            <Plus className="h-5 w-5 text-primary" />
            Nova Reserva
          </DialogTitle>
          <DialogDescription>
            Criar nova reserva para {format(data, "dd 'de' MMMM", { locale: ptBR })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={lidarComSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nomeHospede" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Nome do Hóspede *
            </Label>
            <Input
              id="nomeHospede"
              placeholder="Digite o nome completo"
              value={dadosFormulario.nomeHospede}
              onChange={(e) => lidarComMudancaInput("nomeHospede", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Telefone *
            </Label>
            <Input
              id="telefone"
              type="tel"
              placeholder="+55 11 99999-9999"
              value={dadosFormulario.telefone}
              onChange={(e) => lidarComMudancaInput("telefone", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataEntrada" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data de Entrada
              </Label>
              <Input
                id="dataEntrada"
                type="date"
                value={dadosFormulario.dataEntrada}
                onChange={(e) => lidarComMudancaInput("dataEntrada", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataSaida" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data de Saída
              </Label>
              <Input
                id="dataSaida"
                type="date"
                value={dadosFormulario.dataSaida}
                onChange={(e) => lidarComMudancaInput("dataSaida", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valorDiaria" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Valor da Diária (R$) *
            </Label>
            <Input
              id="valorDiaria"
              type="number"
              step="0.01"
              placeholder="250.00"
              value={dadosFormulario.valorDiaria}
              onChange={(e) => lidarComMudancaInput("valorDiaria", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Observações (Opcional)
            </Label>
            <Textarea
              id="observacoes"
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
              onClick={() => aoMudarAberto(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={estaCarregando}
              className="flex-1 bg-gradient-primary shadow-soft hover:shadow-hover transition-all"
            >
              {estaCarregando ? "Salvando..." : "Salvar Reserva"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};