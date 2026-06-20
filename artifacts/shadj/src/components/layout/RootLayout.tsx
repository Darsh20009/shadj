import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useSessionTracker } from "@/lib/session";

export function RootLayout({ children }: { children: React.ReactNode }) {
  useSessionTracker();
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
