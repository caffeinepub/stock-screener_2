import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Activity,
  BarChart2,
  BookMarked,
  KeyRound,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { useStockData } from "../hooks/useStockData";
import { ApiKeyModal } from "./ApiKeyModal";
import { ScreenerPage } from "./ScreenerPage";

const NAV_ITEMS = [
  { label: "Screener", icon: BarChart2, id: "screener", disabled: false },
  { label: "Watchlist", icon: BookMarked, id: "watchlist", disabled: true },
  { label: "Settings", icon: Settings, id: "settings", disabled: true },
];

export function AppLayout() {
  const [activePage, setActivePage] = useState("screener");
  const [apiKeyOpen, setApiKeyOpen] = useState(false);
  const { apiKey, saveApiKey } = useStockData();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* Sidebar */}
        <Sidebar className="border-r border-border" collapsible="icon">
          <SidebarHeader className="px-3 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 border border-primary/30">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <div className="overflow-hidden">
                <p className="font-display font-bold text-sm text-foreground leading-tight truncate">
                  StockScreener
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  Market Intelligence
                </p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="pt-2">
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activePage === item.id}
                    disabled={item.disabled}
                    onClick={() => !item.disabled && setActivePage(item.id)}
                    className="gap-2"
                    data-ocid={`nav.${item.id}.link`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.disabled && (
                      <span className="ml-auto text-[9px] text-muted-foreground border border-border rounded px-1">
                        Soon
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        {/* Main area */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Top nav */}
          <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-20">
            <SidebarTrigger className="h-8 w-8 text-muted-foreground hover:text-foreground" />

            <div className="flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-primary" />
              <span className="font-display font-bold text-sm text-foreground">
                StockScreener
              </span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                data-ocid="apikey.open_modal_button"
                onClick={() => setApiKeyOpen(true)}
                className="h-8 gap-1.5 border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/50"
              >
                <KeyRound className="h-3.5 w-3.5" />
                API Key
              </Button>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-auto scrollbar-dark">
            {activePage === "screener" && <ScreenerPage />}
          </main>

          {/* Footer */}
          <footer className="px-4 py-3 border-t border-border text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </footer>
        </div>
      </div>

      <ApiKeyModal
        open={apiKeyOpen}
        onOpenChange={setApiKeyOpen}
        currentKey={apiKey}
        onSave={saveApiKey}
      />
    </SidebarProvider>
  );
}
