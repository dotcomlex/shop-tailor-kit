import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { AlyssaChat } from "./AlyssaChat";

type Ctx = { open: boolean; openChat: () => void; closeChat: () => void };

const SupportChatContext = createContext<Ctx | null>(null);

export function SupportChatProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openChat = useCallback(() => setOpen(true), []);
  const closeChat = useCallback(() => setOpen(false), []);

  return (
    <SupportChatContext.Provider value={{ open, openChat, closeChat }}>
      {children}
      <AlyssaChat open={open} onOpenChange={setOpen} />
    </SupportChatContext.Provider>
  );
}

export function useSupportChat() {
  const ctx = useContext(SupportChatContext);
  if (!ctx) throw new Error("useSupportChat must be used inside <SupportChatProvider>");
  return ctx;
}
