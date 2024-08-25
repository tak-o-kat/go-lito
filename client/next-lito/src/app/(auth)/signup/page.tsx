"use client";

import { signup } from "@/app/actions/auth-actions";
import { useFormState } from "react-dom";
import { getAuthInputs } from "@/components/common/auth-helpers";

export default function Account() {
  const [state, formAction] = useFormState<any, FormData>(signup, undefined);

  return <form action={formAction}>{getAuthInputs("signup", state)}</form>;
}
