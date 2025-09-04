import { Settings as SettingsIcon, User, Hotel, Bell, Lock, LogOut } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    navigate("/login");
  };

  const settingSections = [
    {
      title: "Conta",
      items: [
        {
          icon: User,
          label: "Perfil do Usuário",
          description: "Gerencie suas informações pessoais",
          action: () => toast({ title: "Em desenvolvimento", description: "Esta funcionalidade estará disponível em breve." })
        },
        {
          icon: Lock,
          label: "Alterar Senha",
          description: "Atualize sua senha de acesso",
          action: () => toast({ title: "Em desenvolvimento", description: "Esta funcionalidade estará disponível em breve." })
        }
      ]
    },
    {
      title: "Hotel",
      items: [
        {
          icon: Hotel,
          label: "Configurações do Hotel",
          description: "Nome, endereço e informações básicas",
          action: () => toast({ title: "Em desenvolvimento", description: "Esta funcionalidade estará disponível em breve." })
        },
        {
          icon: Bell,
          label: "Notificações",
          description: "Configure alertas e lembretes",
          action: () => toast({ title: "Em desenvolvimento", description: "Esta funcionalidade estará disponível em breve." })
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground p-4 shadow-soft">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-foreground/10 rounded-full">
              <SettingsIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Configurações</h1>
              <p className="text-primary-foreground/80 text-sm">Personalize seu sistema</p>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Content */}
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* User Info Card */}
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Administrador</h3>
                <p className="text-sm text-muted-foreground">admin@hotel.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <Card key={sectionIndex} className="shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-4 h-auto hover:bg-muted/50"
                    onClick={item.action}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-primary" />
                      <div className="text-left">
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </Button>
                  {itemIndex < section.items.length - 1 && <Separator className="my-1" />}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* System Info */}
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Versão</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Última atualização</span>
                <span className="font-medium">Hoje</span>
              </div>
              <Separator />
              <Button
                variant="outline"
                className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair do Sistema
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="text-center text-xs text-muted-foreground py-4">
          <p>Sistema de Reservas v1.0</p>
          <p>Desenvolvido para gestão hoteleira</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Settings;