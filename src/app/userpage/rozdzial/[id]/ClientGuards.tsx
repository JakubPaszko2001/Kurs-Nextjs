"use client";

import { useEffect } from "react";

export default function ClientGuards({ email }: { email?: string }) {
  useEffect(() => {
    const prevent = (e: Event) => { e.preventDefault(); e.stopPropagation(); };

    const onCopyOrCut = (e: ClipboardEvent) => {
      e.preventDefault();
      e.clipboardData?.setData(
        "text/plain",
        `Treść chroniona${email ? ` • Konto: ${email}` : ""}`
      );
    };

    const onKey = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      // Użyj zarówno .key jak i .code dla układów klawiatur
      const key = (e.key || "").toLowerCase();
      const code = (e.code || "").toLowerCase();

      // Blokujemy popularne skróty przeglądarki
      if (
        (ctrl && (["s","p","o","u","a","c","x"].includes(key) ||
                  ["keys","keyp","keyo","keyu","keya","keyc","keyx"].includes(code))) ||
        (ctrl && shift && (key === "i" || code === "keyi" || key === "c" || code === "keyc" || key === "s")) ||
        key === "f12"
      ) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // UWAGA: systemowe skróty jak Win+Shift+S nie są możliwe do zablokowania z przeglądarki.
    };

    // Document (capturing) + Window — żeby przechwycić niezależnie od focusu
    document.addEventListener("contextmenu", prevent, true);
    document.addEventListener("selectstart", prevent, true);
    document.addEventListener("dragstart", prevent, true);
    document.addEventListener("copy", onCopyOrCut, true);
    document.addEventListener("cut", onCopyOrCut, true);
    document.addEventListener("keydown", onKey, true);

    window.addEventListener("keydown", onKey, true);

    return () => {
      document.removeEventListener("contextmenu", prevent, true);
      document.removeEventListener("selectstart", prevent, true);
      document.removeEventListener("dragstart", prevent, true);
      document.removeEventListener("copy", onCopyOrCut, true);
      document.removeEventListener("cut", onCopyOrCut, true);
      document.removeEventListener("keydown", onKey, true);
      window.removeEventListener("keydown", onKey, true);
    };
  }, [email]);

  return null;
}
