"use client";
import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { generate } from "./fetch-api/generate";
import { Send, Brain, User, Loader2, Sparkles, Activity, TrendingUp, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Halo! Saya Mentalytics AI, asisten analisis kesehatan mental Anda. Saya dapat membantu menganalisis data tentang penggunaan media sosial, pola tidur, tingkat stres, kecemasan, dan dampaknya terhadap remaja. Silakan ajukan pertanyaan Anda!",
      timestamp: new Date(),
    },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError("Prompt tidak boleh kosong");
      return;
    }

    setError(null);
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setIsLoading(true);

    try {
      const result = await generate(prompt.trim());
      const text =
        result?.outputs?.[0]?.outputs?.[0]?.results?.message?.text ??
        "Maaf, tidak dapat memproses respons.";

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memproses permintaan.");
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Maaf, terjadi kesalahan. Silakan coba lagi nanti.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex h-screen bg-neutral-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-neutral-900 border-r border-neutral-800 p-6 gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Mentalytics AI</h2>
            <p className="text-xs text-neutral-400">Data-Driven Mental Health</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Topik Analisis</p>
          <div className="flex flex-col gap-3">
            <TopicCard icon={<Activity className="w-4 h-4" />} label="Pola Tidur" desc="Analisis durasi & kualitas tidur" />
            <TopicCard icon={<TrendingUp className="w-4 h-4" />} label="Media Sosial" desc="Pengaruh penggunaan harian" />
            <TopicCard icon={<AlertCircle className="w-4 h-4" />} label="Stres & Kecemasan" desc="Identifikasi level & pemicu" />
            <TopicCard icon={<Sparkles className="w-4 h-4" />} label="Rekomendasi" desc="Saran berbasis data" />
          </div>
        </div>

        <div className="rounded-xl bg-neutral-800/50 border border-neutral-700/50 p-4">
          <p className="text-xs text-neutral-400 leading-relaxed">
            AI ini dibangun untuk menganalisis dataset tentang kesehatan mental remaja. Ajukan pertanyaan dalam bahasa Indonesia maupun Inggris.
          </p>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex flex-col flex-1 min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center gap-3 px-5 py-4 border-b border-neutral-800 bg-neutral-900">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <h1 className="font-bold">Mentalytics AI</h1>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 md:px-8 py-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === "user"
                    ? "bg-neutral-700"
                    : "bg-linear-to-br from-violet-500 to-fuchsia-500"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="w-4 h-4 text-neutral-300" />
                ) : (
                  <Brain className="w-4 h-4 text-white" />
                )}
              </div>
              <div
                className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-neutral-800 text-white rounded-br-sm"
                    : "bg-neutral-800/60 text-neutral-100 rounded-bl-sm border border-neutral-800 markdown-content"
                }`}
              >
                {msg.role === "assistant" ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shrink-0">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="bg-neutral-800/60 border border-neutral-800 rounded-2xl rounded-bl-sm px-5 py-4 flex items-center gap-3">
                <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                <span className="text-sm text-neutral-400">AI sedang menganalisis data...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4 text-red-400" />
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl rounded-bl-sm px-5 py-3 text-sm text-red-300">
                {error}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-4 md:px-8 pb-6 pt-2">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex flex-col gap-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-3 shadow-xl shadow-black/20 focus-within:border-neutral-700 transition-colors">
              <Textarea
                ref={textareaRef}
                placeholder="Tanyakan tentang kesehatan mental, pola tidur, media sosial..."
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  if (e.target.value.trim() !== "") setError(null);
                }}
                onKeyDown={handleKeyDown}
                rows={1}
                className="min-h-[24px] max-h-40 resize-none border-0 bg-transparent text-white placeholder:text-neutral-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              />
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] text-neutral-500">
                  Tekan Enter untuk kirim, Shift+Enter untuk baris baru
                </span>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || !prompt.trim()}
                  size="sm"
                  className="rounded-lg bg-white text-black hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function TopicCard({ icon, label, desc }: { icon: React.ReactNode; label: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-800/50 transition-colors cursor-default group">
      <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-violet-400 group-hover:bg-violet-500/10 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-neutral-200">{label}</p>
        <p className="text-xs text-neutral-500">{desc}</p>
      </div>
    </div>
  );
}
