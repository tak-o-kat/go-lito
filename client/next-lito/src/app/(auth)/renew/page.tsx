"use client";

import { renew } from "../../actions/auth-actions";
import { useFormState } from "react-dom";
import { getAuthInputs } from "@/components/common/auth-helpers";

export default function Login() {
  const [state, formAction] = useFormState<any, FormData>(renew, undefined);

  return <form action={formAction}>{getAuthInputs("renew", state)}</form>;
}
