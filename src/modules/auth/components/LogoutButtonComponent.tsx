"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

import { notifySessionChange, signOut } from "../services/auth-client";

export default function LogoutButtonComponent() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <ButtonComponent
      variant="secondary"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await signOut();
        notifySessionChange();
        router.replace(ROUTES.signIn);
        router.refresh();
      }}
    >
      {busy ? "Cerrando…" : "Cerrar sesión"}
    </ButtonComponent>
  );
}
