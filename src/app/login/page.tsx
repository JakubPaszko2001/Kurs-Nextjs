"use client";

import { useState } from "react";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "register" && password !== confirmPassword) {
      alert("Hasła się nie zgadzają!");
      return;
    }

    try {
      const endpoint = mode === "login" ? "/api/login" : "/api/register";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Błąd");
        return;
      }

      alert(mode === "login" ? "Zalogowano!" : "Rejestracja udana!");
      // np. zapisz token w localStorage
      if (data.token) localStorage.setItem("token", data.token);
    } catch (err) {
      console.error("Auth error:", err);
      alert("Wystąpił błąd.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1222] text-white px-4">
      <div className="w-full max-w-md bg-[#1a1d2e] rounded-2xl shadow-xl p-8 border border-white/10">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {mode === "login" ? "Zaloguj się" : "Zarejestruj się"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg bg-[#0f1222] border border-white/20 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Hasło</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg bg-[#0f1222] border border-white/20 px-3 py-2"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-sm mb-1">Powtórz hasło</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-lg bg-[#0f1222] border border-white/20 px-3 py-2"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-rose-500 hover:bg-rose-400 rounded-lg py-2 font-semibold"
          >
            {mode === "login" ? "Zaloguj się" : "Zarejestruj się"}
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
      </div>
    </div>
  );
}
