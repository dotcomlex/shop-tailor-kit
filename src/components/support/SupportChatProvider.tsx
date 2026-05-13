import { createContext, lazy, Suspense, useCallback, useContext, useState, type ReactNode } from "react";

const AlyssaChat = lazy(() =>
  import("./AlyssaChat").then((m) => ({ default: m.AlyssaChat })),
);

type Ctx = { open: boolean; openChat: () => void; closeChat: () => void };

const SupportChatContext = createContext<Ctx | null>(null);

export function SupportChatProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const openChat = useCallback(() => {
    setMounted(true);
    setOpen(true);
  }, []);
  const closeChat = useCallback(() => setOpen(false), []);

  return (
    <SupportChatContext.Provider value={{ open, openChat, closeChat }}>
      {children}
      {mounted && (
        <Suspense fallback={null}>
          <AlyssaChat open={open} onOpenChange={setOpen} />
        </Suspense>
      )}
    </SupportChatContext.Provider>
  );
}

export function useSupportChat() {
  const ctx = useContext(SupportChatContext);
  if (!ctx) throw new Error("useSupportChat must be used inside <SupportChatProvider>");
  return ctx;
}
