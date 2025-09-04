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
import { usarReservas } from "@/contexts/ReservationContext";
import { ModalEditarReserva } from "./EditReservationModal";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PropsModalReserva {
  data: Date;
  aberto: boolean;
  aoMudarAberto: (aberto: boolean) => void;
}

export const ModalReserva = ({ data, aberto, aoMudarAberto }: PropsModalReserva) => {
  const { obterReservasParaData, excluirReserva } = usarReservas();
  const [idReservaSelecionada, setIdReservaSelecionada] = useState<string | null>(null);
  const [mostrarDialogoExcluir, setMostrarDialogoExcluir] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);

  const reservas = obterReservasParaData(data);

  const lidarComEditar = (idReserva: string) => {
    setIdReservaSelecionada(idReserva);
    setMostrarModalEditar(true);
  };

  const lidarComExcluir = (idReserva: string) => {
    setIdReservaSelecionada(idReserva);
    setMostrarDialogoExcluir(true);
  };

  const confirmarExclusao = () => {
    if (idReservaSelecionada) {
      excluirReserva(idReservaSelecionada);
      toast({
        title: "Reserva cancelada",
        description: "A reserva foi removida com sucesso.",
      });
      setMostrarDialogoExcluir(false);
      setIdReservaSelecionada(null);
      aoMudarAberto(false);
    }
  };

  const obterBadgeStatus = (status: string) => {
    switch (status) {
      case 'confirmada':
        return <Badge className="bg-success text-success-foreground">Confirmada</Badge>;
      case 'pendente':
        return <Badge className="bg-warning text-warning-foreground">Pendente</Badge>;
      case 'cancelada':
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const reservaSelecionada = reservas.find(r => r.id === idReservaSelecionada);

  return (
    <>
      <Dialog open={aberto} onOpenChange={aoMudarAberto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Reservas para {format(data, "dd 'de' MMMM", { locale: ptBR })}
            </DialogTitle>
            <DialogDescription>
              {reservas.length} reserva(s) encontrada(s) para esta data
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {reservas.map((reserva) => (
              <Card key={reserva.id} className="shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold">{reserva.nomeHospede}</h3>
                    </div>
                    {obterBadgeStatus(reserva.status)}
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{reserva.telefone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(reserva.dataEntrada, "dd/MM")} - {format(reserva.dataSaida, "dd/MM")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>R$ {reserva.valorDiaria.toFixed(2)}/dia</span>
                    </div>
                    {reserva.observacoes && (
                      <div className="mt-2 text-xs bg-muted p-2 rounded">
                        <strong>Observações:</strong> {reserva.observacoes}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => lidarComEditar(reserva.id)}
                      className="flex-1 hover:shadow-soft transition-all"
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => lidarComExcluir(reserva.id)}
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
      <AlertDialog open={mostrarDialogoExcluir} onOpenChange={setMostrarDialogoExcluir}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Cancelamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar a reserva de{" "}
              <strong>{reservaSelecionada?.nomeHospede}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarExclusao} className="bg-destructive text-destructive-foreground">
              Confirmar Cancelamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Modal */}
      {mostrarModalEditar && reservaSelecionada && (
        <ModalEditarReserva
          reserva={reservaSelecionada}
          aberto={mostrarModalEditar}
          aoMudarAberto={setMostrarModalEditar}
          aoFechar={() => {
            setMostrarModalEditar(false);
            setIdReservaSelecionada(null);
          }}
        />
      )}
    </>
  );
};