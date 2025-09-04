import { useState } from "react";
import { Hotel, TrendingUp } from "lucide-react";
import { Calendario } from "@/components/Calendar";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usarReservas } from "@/contexts/ReservationContext";

const Dashboard = () => {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const { reservas } = usarReservas();

  const hoje = new Date();
  const reservasMesAtual = reservas.filter(reserva => {
    const dataEntrada = new Date(reserva.dataEntrada);
    return dataEntrada.getMonth() === hoje.getMonth() && dataEntrada.getFullYear() === hoje.getFullYear();
  });

  const reservasConfirmadas = reservasMesAtual.filter(r => r.status === 'confirmada');
  const receitaTotal = reservasConfirmadas.reduce((soma, r) => {
    const noites = Math.ceil((new Date(r.dataSaida).getTime() - new Date(r.dataEntrada).getTime()) / (1000 * 60 * 60 * 24));
    return soma + (r.valorDiaria * noites);
  }, 0);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground p-4 shadow-soft">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary-foreground/10 rounded-full">
              <Hotel className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Sistema de Reservas</h1>
              <p className="text-primary-foreground/80 text-sm">Gerencie suas reservas com facilidade</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs opacity-80">Este Mês</p>
                    <p className="text-lg font-bold">{reservasMesAtual.length}</p>
                    <p className="text-xs opacity-80">Reservas</p>
                  </div>
                  <Hotel className="h-8 w-8 opacity-60" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs opacity-80">Receita</p>
                    <p className="text-lg font-bold">R$ {receitaTotal.toLocaleString('pt-BR')}</p>
                    <p className="text-xs opacity-80">Este Mês</p>
                  </div>
                  <TrendingUp className="h-8 w-8 opacity-60" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto p-4">
        <Calendario dataSelecionada={dataSelecionada} aoSelecionarData={setDataSelecionada} />
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;