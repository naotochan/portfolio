"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useLang } from "@/lib/i18n";

const t = {
  name:        { ja: "お名前", en: "Name" },
  namePh:      { ja: "お名前", en: "Your name" },
  email:       { ja: "メールアドレス", en: "Email" },
  emailPh:     { ja: "your@email.com", en: "your@email.com" },
  subject:     { ja: "件名", en: "Subject" },
  subjectPh:   { ja: "件名を選択", en: "Select a subject" },
  collab:      { ja: "コラボレーション", en: "Collaboration" },
  commission:  { ja: "制作依頼", en: "Commission" },
  general:     { ja: "その他", en: "General Inquiry" },
  message:     { ja: "メッセージ", en: "Message" },
  messagePh:   { ja: "プロジェクトについて教えてください...", en: "Tell me about your project..." },
  send:        { ja: "送信する", en: "Send Message" },
  sending:     { ja: "送信中...", en: "Sending..." },
  sent:        { ja: "送信しました！", en: "Sent!" },
  error:       { ja: "送信に失敗しました。もう一度お試しください。", en: "Something went wrong. Please try again." },
} as const;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const { lang } = useLang();
  const l = (key: keyof typeof t) => t[key][lang];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("sent");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const inputClass = "w-full bg-surface-container-highest rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30 font-[family-name:var(--font-body)] text-sm";

  return (
    <form onSubmit={handleSubmit} className="glass rounded-xl p-8 space-y-6">
      <div>
        <label className="block text-xs font-[family-name:var(--font-label)] text-on-surface-variant tracking-wider uppercase mb-2">
          {l("name")}
        </label>
        <input type="text" name="name" required className={inputClass} placeholder={l("namePh")} />
      </div>

      <div>
        <label className="block text-xs font-[family-name:var(--font-label)] text-on-surface-variant tracking-wider uppercase mb-2">
          {l("email")}
        </label>
        <input type="email" name="email" required className={inputClass} placeholder={l("emailPh")} />
      </div>

      <div>
        <label className="block text-xs font-[family-name:var(--font-label)] text-on-surface-variant tracking-wider uppercase mb-2">
          {l("subject")}
        </label>
        <select name="subject" required className={inputClass}>
          <option value="">{l("subjectPh")}</option>
          <option value="collaboration">{l("collab")}</option>
          <option value="commission">{l("commission")}</option>
          <option value="general">{l("general")}</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-[family-name:var(--font-label)] text-on-surface-variant tracking-wider uppercase mb-2">
          {l("message")}
        </label>
        <textarea name="message" required rows={5} className={inputClass} placeholder={l("messagePh")} />
      </div>

      <Button type="submit" variant="primary" className="w-full">
        {status === "sending" ? l("sending") : status === "sent" ? l("sent") : l("send")}
      </Button>

      {status === "error" && (
        <p className="text-error text-sm text-center">{l("error")}</p>
      )}
    </form>
  );
}
