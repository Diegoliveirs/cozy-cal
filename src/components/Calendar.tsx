import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { usarReservas } from "@/contexts/ReservationContext";
import { ModalReserva } from "./ReservationModal";
import { ModalNovaReserva } from "./NewReservationModal";

interface PropsCalendario {
  dataSelecionada: Date;
  aoSelecionarData: (data: Date) => void;
}

export const Calendario = ({ dataSelecionada, aoSelecionarData }: PropsCalendario) => {
  const [mesAtual, setMesAtual] = useState(new Date());
  const [mostrarModalReserva, setMostrarModalReserva] = useState(false);
  const [mostrarModalNovaReserva, setMostrarModalNovaReserva] = useState(false);
  const { reservas, obterReservasParaData } = usarReservas();

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const obterDiasDoMes = (data: Date) => {
    const ano = data.getFullYear();
    const mes = data.getMonth();
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const diasNoMes = ultimoDia.getDate();
    const diaInicialDaSemana = primeiroDia.getDay();

    const dias = [];

    // Dias do mês anterior
    for (let i = diaInicialDaSemana - 1; i >= 0; i--) {
      const dataAnterior = new Date(ano, mes, -i);
      dias.push({ data: dataAnterior, eMesAtual: false });
    }

    // Dias do mês atual
    for (let dia = 1; dia <= diasNoMes; dia++) {
      const data = new Date(ano, mes, dia);
      dias.push({ data, eMesAtual: true });
    }

    // Dias do próximo mês para preencher a grade
    const diasRestantes = 42 - dias.length;
    for (let dia = 1; dia <= diasRestantes; dia++) {
      const proximaData = new Date(ano, mes + 1, dia);
      dias.push({ data: proximaData, eMesAtual: false });
    }

    return dias;
  };

  const navegarMes = (direcao: 'anterior' | 'proximo') => {
    setMesAtual(anterior => {
      const novoMes = new Date(anterior);
      if (direcao === 'anterior') {
        novoMes.setMonth(anterior.getMonth() - 1);
      } else {
        novoMes.setMonth(anterior.getMonth() + 1);
      }
      return novoMes;
    });
  };

  const lidarComCliqueData = (data: Date) => {
    aoSelecionarData(data);
    const reservasParaData = obterReservasParaData(data);
    
    if (reservasParaData.length > 0) {
      setMostrarModalReserva(true);
    } else {
      setMostrarModalNovaReserva(true);
    }
  };

  const eHoje = (data: Date) => {
    const hoje = new Date();
    return data.toDateString() === hoje.toDateString();
  };

  const eMesmoDia = (data1: Date, data2: Date) => {
    return data1.toDateString() === data2.toDateString();
  };

  const dias = obterDiasDoMes(mesAtual);

  return (
    <>
      <Card className="shadow-soft">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              {meses[mesAtual.getMonth()]} {mesAtual.getFullYear()}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navegarMes('anterior')}
                className="hover:shadow-soft transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navegarMes('proximo')}
                className="hover:shadow-soft transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {diasSemana.map((dia) => (
              <div key={dia} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {dia}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {dias.map(({ data, eMesAtual }, indice) => {
              const reservasParaData = obterReservasParaData(data);
              const temReservas = reservasParaData.length > 0;
              const estaSelecionado = eMesmoDia(data, dataSelecionada);
              
              return (
                <Button
                  key={indice}
                  variant="ghost"
                  className={cn(
                    "h-12 p-1 text-sm transition-all duration-200 relative",
                    !eMesAtual && "text-muted-foreground opacity-50",
                    eHoje(data) && "bg-primary/10 text-primary font-semibold",
                    estaSelecionado && "bg-accent text-accent-foreground",
                    temReservas && eMesAtual && "bg-success-light text-success-foreground",
                    "hover:shadow-soft hover:scale-105"
                  )}
                  onClick={() => lidarComCliqueData(data)}
                >
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <span>{data.getDate()}</span>
                    {temReservas && (
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle className="h-3 w-3" />
                        {reservasParaData.length > 1 && (
                          <span className="text-xs font-bold">
                            {reservasParaData.length}
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

      {/* Modais */}
      {mostrarModalReserva && (
        <ModalReserva
          data={dataSelecionada}
          aberto={mostrarModalReserva}
          aoMudarAberto={setMostrarModalReserva}
        />
      )}
      
      {mostrarModalNovaReserva && (
        <ModalNovaReserva
          data={dataSelecionada}
          aberto={mostrarModalNovaReserva}
          aoMudarAberto={setMostrarModalNovaReserva}
        />
      )}
    </>
  );
};