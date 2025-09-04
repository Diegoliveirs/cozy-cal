import { useState } from "react";
import { Search, Filter, Calendar, Phone, DollarSign, User } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usarReservas } from "@/contexts/ReservationContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Reservas = () => {
  const { reservas } = usarReservas();
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string>("all");

  const reservasFiltradas = reservas.filter(reserva => {
    const correspondeNome = reserva.nomeHospede.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
                           reserva.telefone.includes(termoPesquisa);
    const correspondeStatus = filtroStatus === "all" || reserva.status === filtroStatus;
    
    return correspondeNome && correspondeStatus;
  });

  const reservasOrdenadas = reservasFiltradas.sort((a, b) => {
    return new Date(b.dataEntrada).getTime() - new Date(a.dataEntrada).getTime();
  });

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

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground p-4 shadow-soft">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold mb-4">Todas as Reservas</h1>
          
          {/* Search and Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-foreground/60" />
              <Input
                placeholder="Buscar por nome ou telefone..."
                value={termoPesquisa}
                onChange={(e) => setTermoPesquisa(e.target.value)}
                className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="confirmada">Confirmadas</SelectItem>
                  <SelectItem value="pendente">Pendentes</SelectItem>
                  <SelectItem value="cancelada">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      {/* Results Summary */}
      <div className="max-w-md mx-auto p-4">
        <p className="text-sm text-muted-foreground mb-4">
          {reservasFiltradas.length} reserva(s) encontrada(s)
        </p>

        {/* Reservations List */}
        <div className="space-y-3">
          {reservasOrdenadas.length === 0 ? (
            <Card className="shadow-soft">
              <CardContent className="p-6 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {termoPesquisa || filtroStatus !== "all" 
                    ? "Nenhuma reserva encontrada com os filtros aplicados."
                    : "Nenhuma reserva cadastrada ainda."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            reservasOrdenadas.map((reserva) => (
              <Card key={reserva.id} className="shadow-soft hover:shadow-hover transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold text-lg">{reserva.nomeHospede}</h3>
                    </div>
                    {obterBadgeStatus(reserva.status)}
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{reserva.telefone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(reserva.dataEntrada, "dd 'de' MMM", { locale: ptBR })} - {format(reserva.dataSaida, "dd 'de' MMM", { locale: ptBR })}
                      </span>
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        {Math.ceil((new Date(reserva.dataSaida).getTime() - new Date(reserva.dataEntrada).getTime()) / (1000 * 60 * 60 * 24))} noite(s)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>R$ {reserva.valorDiaria.toFixed(2)}/dia</span>
                      <span className="font-semibold text-foreground">
                        Total: R$ {(reserva.valorDiaria * Math.ceil((new Date(reserva.dataSaida).getTime() - new Date(reserva.dataEntrada).getTime()) / (1000 * 60 * 60 * 24))).toFixed(2)}
                      </span>
                    </div>
                    {reserva.observacoes && (
                      <div className="mt-2 text-xs bg-muted p-2 rounded">
                        <strong>Observações:</strong> {reserva.observacoes}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Reservas;