import { Calendar, Clock, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  const navItems = [
    {
      to: "/reservations",
      icon: Clock,
      label: "Reservas",
    },
    {
      to: "/",
      icon: Calendar,
      label: "Calendário",
    },
    {
      to: "/settings",
      icon: Settings,
      label: "Configurações",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center py-2 max-w-md mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center py-2 px-4 rounded-lg transition-colors duration-200",
                "text-muted-foreground hover:text-primary",
                isActive && "text-primary bg-primary/10"
              )
            }
          >
            <Icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};