import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import CheckoutClient from "./CheckoutClient";

export const dynamic = "force-dynamic";

async function getUserEmail(): Promise<string> {
  const token = (await cookies()).get("session")?.value;
  if (!token) return "";
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    return String(payload.email ?? "");
  } catch {
    return "";
  }
}

export default async function Page() {
  const userEmail = await getUserEmail(); // "" gdy niezalogowany
  return <CheckoutClient userEmail={userEmail} />;
}
