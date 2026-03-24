"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

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
          Name
        </label>
        <input type="text" name="name" required className={inputClass} placeholder="Your name" />
      </div>

      <div>
        <label className="block text-xs font-[family-name:var(--font-label)] text-on-surface-variant tracking-wider uppercase mb-2">
          Email
        </label>
        <input type="email" name="email" required className={inputClass} placeholder="your@email.com" />
      </div>

      <div>
        <label className="block text-xs font-[family-name:var(--font-label)] text-on-surface-variant tracking-wider uppercase mb-2">
          Subject
        </label>
        <select name="subject" required className={inputClass}>
          <option value="">Select a subject</option>
          <option value="collaboration">Collaboration</option>
          <option value="commission">Commission</option>
          <option value="general">General Inquiry</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-[family-name:var(--font-label)] text-on-surface-variant tracking-wider uppercase mb-2">
          Message
        </label>
        <textarea name="message" required rows={5} className={inputClass} placeholder="Tell me about your project..." />
      </div>

      <Button type="submit" variant="primary" className="w-full">
        {status === "sending" ? "Sending..." : status === "sent" ? "Sent!" : "Send Message"}
      </Button>

      {status === "error" && (
        <p className="text-error text-sm text-center">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
