"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Mic, Volume2, X } from "lucide-react";
// Deep-import the pure leaf modules, not the @/lib/commerce barrel: the barrel
// re-exports the Supabase provider (server-only), which would poison the client
// bundle. money/types carry no backend code, so the commerce boundary holds.
import { formatMoney } from "@/lib/commerce/money";
import type { ProductListItem } from "@/lib/commerce/types";
import { interpretQuery, type AnswerResult } from "@/lib/voice/answer-engine";

// Browser-native voice shopping assistant (free, no API keys — see plan).
// Web Speech API does STT + TTS; the "brain" is the catalog rule engine in
// @/lib/voice/answer-engine. Falls back gracefully where the API is missing
// (Safari/Firefox). All copy comes from the `Voice` message namespace.

// BCP-47 tags Web Speech expects, per app locale.
const SPEECH_LANG: Record<string, string> = {
  ko: "ko-KR",
  ja: "ja-JP",
  zh: "zh-CN",
  en: "en-US",
};

// Minimal Web Speech typings (not in the default DOM lib).
type SpeechResultLike = { transcript: string };
interface SpeechEventLike {
  results: ArrayLike<ArrayLike<SpeechResultLike>>;
}
interface RecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((e: SpeechEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}
type RecognitionCtor = new () => RecognitionLike;

interface LogEntry {
  id: number;
  role: "you" | "assistant";
  text: string;
}

export function VoiceAssistant() {
  const t = useTranslations("Voice");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const recognitionRef = useRef<RecognitionLike | null>(null);
  const productsRef = useRef<ProductListItem[]>([]);
  const idRef = useRef(0);
  const logEndRef = useRef<HTMLDivElement | null>(null);

  const nextId = () => (idRef.current += 1);

  // Lazily load the catalog the first time the panel is opened.
  useEffect(() => {
    if (!open || productsRef.current.length > 0) return;
    let cancelled = false;
    fetch(`/api/voice-catalog?locale=${locale}`)
      .then((r) => r.json())
      .then((data: { products?: ProductListItem[] }) => {
        if (cancelled) return;
        const list = data.products ?? [];
        productsRef.current = list;
        setProducts(list);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [open, locale]);

  useEffect(() => {
    const Ctor =
      (window as unknown as { SpeechRecognition?: RecognitionCtor })
        .SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: RecognitionCtor })
        .webkitSpeechRecognition;
    setSupported(!!Ctor && "speechSynthesis" in window);
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  const speak = useCallback(
    (text: string) => {
      if (!("speechSynthesis" in window)) return;
      const utter = new SpeechSynthesisUtterance(text);
      const bcp = SPEECH_LANG[locale] ?? "en-US";
      utter.lang = bcp;
      const voice = window.speechSynthesis
        .getVoices()
        .find((v) => v.lang === bcp || v.lang.startsWith(`${locale}-`));
      if (voice) utter.voice = voice;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    },
    [locale],
  );

  // Turn a structured intent into a localized sentence.
  const renderAnswer = useCallback(
    (r: AnswerResult): string => {
      const priceOf = (p: ProductListItem) =>
        p.price ? formatMoney(p.price, locale) : t("priceNA");
      switch (r.kind) {
        case "greeting":
          return t("greeting");
        case "help":
          return t("help");
        case "list": {
          const names = r.products
            .slice(0, 5)
            .map((p) => p.title)
            .join(", ");
          return t("listIntro", { count: r.products.length, names });
        }
        case "price":
          return t("priceAnswer", {
            name: r.product.title,
            price: priceOf(r.product),
          });
        case "info":
          return t("infoAnswer", {
            name: r.product.title,
            subtitle: r.product.subtitle ?? "",
            price: priceOf(r.product),
          });
        case "notFound":
          return t("notFound");
        default:
          return t("fallback");
      }
    },
    [locale, t],
  );

  const handleTranscript = useCallback(
    (transcript: string) => {
      setLog((prev) => [
        ...prev,
        { id: nextId(), role: "you", text: transcript },
      ]);
      const result = interpretQuery(transcript, products, locale);
      const answer = renderAnswer(result);
      setLog((prev) => [
        ...prev,
        { id: nextId(), role: "assistant", text: answer },
      ]);
      speak(answer);
    },
    [products, locale, renderAnswer, speak],
  );

  const startListening = useCallback(() => {
    const Ctor =
      (window as unknown as { SpeechRecognition?: RecognitionCtor })
        .SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: RecognitionCtor })
        .webkitSpeechRecognition;
    if (!Ctor) {
      setSupported(false);
      return;
    }
    const recognition = new Ctor();
    recognition.lang = SPEECH_LANG[locale] ?? "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (e: SpeechEventLike) => {
      const transcript = e.results?.[0]?.[0]?.transcript?.trim();
      if (transcript) handleTranscript(transcript);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }, [locale, handleTranscript]);

  const toggleListening = useCallback(() => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
    } else {
      startListening();
    }
  }, [listening, startListening]);

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("open")}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition hover:scale-105 active:scale-95"
      >
        {open ? <X className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex max-h-[70vh] w-[min(22rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
          <header className="flex items-center gap-2 border-b border-border px-4 py-3">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold">{t("title")}</span>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm">
            {log.length === 0 ? (
              <p className="py-6 text-center text-muted-foreground">
                {supported ? t("prompt") : t("unsupported")}
              </p>
            ) : (
              log.map((entry) => (
                <div
                  key={entry.id}
                  className={
                    entry.role === "you" ? "text-right" : "text-left"
                  }
                >
                  <span className="mb-0.5 block text-xs text-muted-foreground">
                    {entry.role === "you" ? t("you") : t("assistant")}
                  </span>
                  <span
                    className={`inline-block rounded-2xl px-3 py-2 ${
                      entry.role === "you"
                        ? "bg-foreground text-background"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {entry.text}
                  </span>
                </div>
              ))
            )}
            <div ref={logEndRef} />
          </div>

          <footer className="border-t border-border px-4 py-3">
            <button
              type="button"
              onClick={toggleListening}
              disabled={!supported}
              className={`flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                listening
                  ? "bg-red-500 text-white"
                  : "bg-foreground text-background hover:opacity-90"
              }`}
            >
              <Mic className={`h-4 w-4 ${listening ? "animate-pulse" : ""}`} />
              {listening ? t("listening") : t("open")}
            </button>
          </footer>
        </div>
      )}
    </>
  );
}
