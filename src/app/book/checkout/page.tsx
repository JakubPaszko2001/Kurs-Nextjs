import Link from "next/link";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import CheckoutForm from "../CheckoutForm";

export const dynamic = "force-dynamic";

async function getEmail() {
  const token = (await cookies()).get("session")?.value;
  if (!token) return "";
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    const email = (payload as any)?.email;
    return typeof email === "string" ? email : "";
  } catch {
    return "";
  }
}

export default async function BookCheckoutPage() {
  const email = await getEmail();

  return (
    <div className="min-h-screen bg-[#0f1222] text-white">
      {/* Top bar */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-white/70 hover:text-white">
            ← Wróć na stronę główną
          </Link>
          {email ? (
            <div className="text-white/60 text-sm">
              Zalogowano jako <span className="text-white">{email}</span>
            </div>
          ) : (
            <div className="text-white/40 text-sm">Niezalogowany</div>
          )}
        </div>
      </div>
      {/* Formularz */}
      <div className="mx-auto max-w-6xl px-4 pb-10">
        <CheckoutForm defaultEmail={email} />
      </div>
    </div>
  );
}
