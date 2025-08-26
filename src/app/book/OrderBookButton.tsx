"use client";
import { useRouter } from "next/navigation";

export default function OrderBookButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/book/checkout")}
      className="rounded-2xl bg-rose-500 hover:bg-rose-400 px-4 py-2 font-semibold"
    >
      Zamów książkę w okładce
    </button>
  );
}