"use client";

import { login } from "../../actions/auth-actions";
import { useFormState } from "react-dom";
import { getAuthInputs } from "@/components/common/auth-helpers";

export default function Login() {
  const [state, formAction] = useFormState<any, FormData>(login, undefined);

  return <form action={formAction}>{getAuthInputs("login", state)}</form>;
}
