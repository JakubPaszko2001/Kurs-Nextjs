"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function AuthPage() {
  // ▶️ Domyślnie LOGOWANIE
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setMessage("");

    try {
      if (mode === "register") {
        if (password !== confirmPassword) {
          setMessage("❌ Hasła nie są takie same");
          return;
        }
        if (password.length < 6) {
          setMessage("❌ Hasło musi mieć co najmniej 6 znaków");
          return;
        }

        setLoading(true);
        const { error } = await supabase.from("users").insert([
          {
            email,
            password,           // PRODUKCJA: hashuj!
            status: "unpaid",   // <-- to dodaj
          },
        ]);
        setLoading(false);

        if (error) {
          setMessage("Błąd rejestracji: " + error.message);
          return;
        }

        setMessage("✅ Zarejestrowano. Teraz zaloguj się.");
        setPassword("");
        setConfirmPassword("");
        setMode("login"); // po rejestracji przełączamy na logowanie
      } else {
        // LOGIN
        setLoading(true);
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        setLoading(false);

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setMessage("Błąd logowania: " + (data?.error ?? res.statusText));
          return;
        }

        setMessage("✅ Zalogowano pomyślnie");
        router.replace("/"); // główna pokaże Userpage
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setMessage("Wystąpił nieoczekiwany błąd.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1222] text-white px-4">
      <div className="w-full max-w-md bg-[#1a1d2e] rounded-2xl shadow-xl p-8 border border-white/10">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {mode === "login" ? "Zaloguj się" : "Zarejestruj się"}
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg bg-[#0f1222] border border-white/20 px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Hasło"
            className="w-full rounded-lg bg-[#0f1222] border border-white/20 px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {mode === "register" && (
            <input
              type="password"
              placeholder="Powtórz hasło"
              className="w-full rounded-lg bg-[#0f1222] border border-white/20 px-3 py-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-500 hover:bg-rose-400 disabled:opacity-60 rounded-lg py-2 font-semibold"
          >
            {loading ? "Przetwarzanie..." : mode === "login" ? "Zaloguj się" : "Zarejestruj się"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
          {mode === "login" ? (
            <>
              Nie masz konta?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                className="text-rose-400 hover:text-rose-300"
              >
                Zarejestruj się
              </button>
            </>
          ) : (
            <>
              Masz już konto?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-rose-400 hover:text-rose-300"
              >
                Zaloguj się
              </button>
            </>
          )}
        </p>

        {message && (
          <p className="mt-4 text-center text-sm text-white/80">{message}</p>
        )}
      </div>
    </div>
  );
}
