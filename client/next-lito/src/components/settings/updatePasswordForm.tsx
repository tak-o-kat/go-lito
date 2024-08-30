"use client";

import { useFormState } from "react-dom";

import { renew } from "@/app/actions/auth-actions";
import { getUpdatePassword } from "@/components/common/auth-helpers";

export default function UpdatePasswordForm() {
  const [state, formAction] = useFormState<any, FormData>(renew, undefined);
  return <form action={formAction}>{getUpdatePassword("renew", state)}</form>;
}
