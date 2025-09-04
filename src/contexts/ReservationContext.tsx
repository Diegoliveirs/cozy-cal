import { createContext, useContext, useState, ReactNode } from "react";

export interface Reserva {
  id: string;
  nomeHospede: string;
  telefone: string;
  dataEntrada: Date;
  dataSaida: Date;
  valorDiaria: number;
  observacoes?: string;
  status: 'confirmada' | 'pendente' | 'cancelada';
}

interface TipoContextoReserva {
  reservas: Reserva[];
  adicionarReserva: (reserva: Omit<Reserva, 'id'>) => void;
  atualizarReserva: (id: string, reserva: Partial<Reserva>) => void;
  excluirReserva: (id: string) => void;
  obterReservasParaData: (data: Date) => Reserva[];
}

const ContextoReserva = createContext<TipoContextoReserva | undefined>(undefined);

export const ProvedorReserva = ({ children }: { children: ReactNode }) => {
  const [reservas, setReservas] = useState<Reserva[]>([
    // Dados demo
    {
      id: "1",
      nomeHospede: "Maria Silva",
      telefone: "+55 11 99999-9999",
      dataEntrada: new Date(2024, 0, 15),
      dataSaida: new Date(2024, 0, 18),
      valorDiaria: 250,
      observacoes: "Cliente preferencial, quarto com vista para o mar",
      status: 'confirmada'
    },
    {
      id: "2",
      nomeHospede: "João Santos",
      telefone: "+55 11 88888-8888",
      dataEntrada: new Date(2024, 0, 20),
      dataSaida: new Date(2024, 0, 22),
      valorDiaria: 180,
      observacoes: "",
      status: 'pendente'
    }
  ]);

  const gerarId = () => Math.random().toString(36).substr(2, 9);

  const adicionarReserva = (reserva: Omit<Reserva, 'id'>) => {
    const novaReserva = {
      ...reserva,
      id: gerarId(),
    };
    setReservas(anterior => [...anterior, novaReserva]);
  };

  const atualizarReserva = (id: string, reservaAtualizada: Partial<Reserva>) => {
    setReservas(anterior =>
      anterior.map(reserva =>
        reserva.id === id ? { ...reserva, ...reservaAtualizada } : reserva
      )
    );
  };

  const excluirReserva = (id: string) => {
    setReservas(anterior => anterior.filter(reserva => reserva.id !== id));
  };

  const obterReservasParaData = (data: Date) => {
    return reservas.filter(reserva => {
      const dataEntrada = new Date(reserva.dataEntrada);
      const dataSaida = new Date(reserva.dataSaida);
      
      dataEntrada.setHours(0, 0, 0, 0);
      dataSaida.setHours(0, 0, 0, 0);
      data.setHours(0, 0, 0, 0);
      
      return data >= dataEntrada && data < dataSaida;
    });
  };

  return (
    <ContextoReserva.Provider
      value={{
        reservas,
        adicionarReserva,
        atualizarReserva,
        excluirReserva,
        obterReservasParaData,
      }}
    >
      {children}
    </ContextoReserva.Provider>
  );
};

export const usarReservas = () => {
  const contexto = useContext(ContextoReserva);
  if (contexto === undefined) {
    throw new Error('usarReservas deve ser usado dentro de um ProvedorReserva');
  }
  return contexto;
};