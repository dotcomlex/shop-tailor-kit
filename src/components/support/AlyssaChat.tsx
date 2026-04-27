import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Send, X } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import alyssaPhoto from "/alyssa.png";

type Msg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "vw_alyssa_chat_v1";

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi there 👋 I'm Alyssa from VitalWalk. Got a question about sizing, shipping, or anything else? I'm right here to help.",
};

const SUGGESTED = [
  "Will these fit my swollen feet?",
  "How long does shipping take?",
  "What if the size is wrong?",
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/support-chat`;

export function AlyssaChat({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [messages, setMessages] = useState<Msg[]>(() => {
    if (typeof window === "undefined") return [GREETING];
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Msg[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      /* ignore */
    }
    return [GREETING];
  });
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Persist
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* ignore quota */
    }
  }, [messages]);

  // Autoscroll on new content
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isStreaming]);

  // Focus input when opening
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [open]);

  const showSuggestions = useMemo(
    () => messages.length === 1 && messages[0].role === "assistant",
    [messages],
  );

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    setInput("");
    const userMsg: Msg = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setIsStreaming(true);

    // Add empty assistant placeholder for streaming target (shows typing dots)
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    // Realistic 2-3s "typing" pause before the response starts streaming in.
    await new Promise((r) => setTimeout(r, 2000 + Math.random() * 1000));

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next }),
      });

      if (!resp.ok || !resp.body) {
        let errMsg = "Something went wrong. Please try again.";
        try {
          const j = await resp.json();
          if (j?.error) errMsg = j.error;
        } catch {
          /* ignore */
        }
        if (resp.status === 429) toast.error(errMsg);
        else if (resp.status === 402) toast.error(errMsg);
        else toast.error(errMsg);
        // Remove placeholder
        setMessages((prev) => prev.slice(0, -1));
        setIsStreaming(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";
      let done = false;

      const flushChunk = (delta: string) => {
        assistantText += delta;
        setMessages((prev) => {
          const copy = prev.slice();
          copy[copy.length - 1] = { role: "assistant", content: assistantText };
          return copy;
        });
      };

      while (!done) {
        const { done: rDone, value } = await reader.read();
        if (rDone) break;
        buffer += decoder.decode(value, { stream: true });

        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") {
            done = true;
            break;
          }
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) flushChunk(content);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Final flush
      if (buffer.trim()) {
        for (let raw of buffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const json = raw.slice(6).trim();
          if (json === "[DONE]") continue;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) flushChunk(content);
          } catch {
            /* ignore */
          }
        }
      }

      if (!assistantText) {
        setMessages((prev) => {
          const copy = prev.slice();
          copy[copy.length - 1] = {
            role: "assistant",
            content: "Sorry, I didn't catch that — could you ask me again?",
          };
          return copy;
        });
      }
    } catch (e) {
      console.error("chat error", e);
      toast.error("Connection issue. Please try again.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsStreaming(false);
    }
  }

  const lastMsg = messages[messages.length - 1];
  const showTyping = isStreaming && lastMsg?.role === "assistant" && lastMsg.content === "";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className={cn(
          "flex h-[88vh] flex-col gap-0 rounded-t-2xl border-t p-0",
          "sm:inset-y-0 sm:right-0 sm:left-auto sm:h-full sm:max-w-md sm:rounded-none sm:rounded-l-2xl sm:border-l",
          "[&>button.absolute]:hidden",
        )}
      >
        <SheetTitle className="sr-only">Chat with Alyssa from VitalWalk Customer Care</SheetTitle>
        <SheetDescription className="sr-only">
          Live chat with our customer care team about sizing, shipping and orders.
        </SheetDescription>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border bg-[hsl(var(--order-blue))] px-4 py-3 text-white">
          <div className="relative">
            <Avatar className="h-11 w-11 border-2 border-white/80">
              <AvatarImage src={alyssaPhoto} alt="Alyssa, VitalWalk Customer Care" />
              <AvatarFallback className="bg-white text-[hsl(var(--order-blue))] font-bold">A</AvatarFallback>
            </Avatar>
            <span
              className="absolute -bottom-0.5 -right-0.5 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-[hsl(var(--order-blue))]"
              aria-hidden
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-bold leading-tight">Alyssa</p>
            <p className="text-[12px] leading-tight text-white/85">
              <span className="inline-flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-300" />
                Online · VitalWalk Customer Care
              </span>
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="-mr-1 rounded-full p-1.5 text-white/90 hover:bg-white/15"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto bg-[hsl(var(--background))] px-3 py-4 sm:px-4"
        >
          <div className="mx-auto flex max-w-2xl flex-col gap-3">
            {messages.map((m, i) => (
              <MessageBubble key={i} role={m.role} content={m.content} />
            ))}
            {showTyping && <TypingBubble />}

            {showSuggestions && (
              <div className="mt-2 flex flex-col gap-2">
                <p className="px-1 text-[11.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Common questions
                </p>
                {SUGGESTED.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    disabled={isStreaming}
                    className="rounded-2xl border border-border bg-card px-4 py-3 text-left text-[14.5px] font-medium text-[hsl(var(--text-strong))] shadow-sm transition hover:border-[hsl(var(--order-blue))] hover:bg-order-blue-soft disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-border bg-background px-3 py-3 sm:px-4"
        >
          <div className="mx-auto flex max-w-2xl items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder="Type your message…"
              disabled={isStreaming}
              className="flex-1 resize-none rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-[16px] leading-snug placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--order-blue))]/40 disabled:opacity-60"
              style={{ maxHeight: 120 }}
            />
            <button
              type="submit"
              disabled={isStreaming || !input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--order-blue))] text-white shadow-sm transition disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="h-4.5 w-4.5" strokeWidth={2.5} />
            </button>
          </div>
          <p className="mx-auto mt-1.5 max-w-2xl px-1 text-[10.5px] text-muted-foreground">
            Replies in seconds · For order issues email support@vitalwalk.store
          </p>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function MessageBubble({ role, content }: Msg) {
  const isUser = role === "user";
  return (
    <div className={cn("flex items-end gap-2", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="h-7 w-7 shrink-0">
          <AvatarImage src={alyssaPhoto} alt="" />
          <AvatarFallback className="bg-[hsl(var(--order-blue))] text-[11px] font-bold text-white">A</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-relaxed shadow-sm",
          isUser
            ? "rounded-br-md bg-[hsl(var(--order-blue))] text-white"
            : "rounded-bl-md bg-card text-[hsl(var(--text-strong))] border border-border",
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="prose prose-sm max-w-none text-[hsl(var(--text-strong))] [&_p]:my-1.5 [&_ul]:my-1.5 [&_ol]:my-1.5 [&_strong]:font-bold">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex items-end gap-2 justify-start">
      <Avatar className="h-7 w-7 shrink-0">
        <AvatarImage src={alyssaPhoto} alt="" />
        <AvatarFallback className="bg-[hsl(var(--order-blue))] text-[11px] font-bold text-white">A</AvatarFallback>
      </Avatar>
      <div className="rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3 shadow-sm">
        <div className="flex gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" />
        </div>
      </div>
    </div>
  );
}
