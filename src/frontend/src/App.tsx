import { Toaster } from "@/components/ui/sonner";
import { AppLayout } from "./components/AppLayout";

export default function App() {
  return (
    <>
      <AppLayout />
      <Toaster richColors position="top-right" />
    </>
  );
}
