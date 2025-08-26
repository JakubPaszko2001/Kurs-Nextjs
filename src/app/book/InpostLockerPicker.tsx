"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    easyPack?: any;
  }
}

export default function InpostLockerPicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (lockerId: string) => void;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = "inpost-geowidget";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id;
      s.src = "https://geowidget.easypack24.net/js/sdk-for-javascript.js";
      s.async = true;
      s.onload = () => {
        window.easyPack?.init({ defaultLocale: "pl", mapType: "osm", searchType: "osm" });
        setReady(true);
      };
      document.body.appendChild(s);
    } else {
      setReady(true);
    }
  }, []);

  const openModal = () => {
    window.easyPack?.modalMap?.((point: any) => {
      onChange(point?.name || "");
    }, { types: ["parcel_locker"] });
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={openModal}
        disabled={!ready}
        className="rounded-2xl bg-rose-500 hover:bg-rose-400 px-4 py-2 font-semibold disabled:opacity-60"
      >
        Wybierz Paczkomat
      </button>
      {value ? (
        <span className="text-white/80 text-sm">Wybrano: <b>{value}</b></span>
      ) : (
        <span className="text-white/50 text-sm">Brak wybranego punktu</span>
      )}
    </div>
  );
}
