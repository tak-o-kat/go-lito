"use client";

import { signup } from "@/app/actions/auth-actions";
import { useFormState } from "react-dom";
import { getAuthInputs } from "@/components/common/auth-helpers";
import { useFormStatus } from "react-dom";

export default function Account() {
  const [state, formAction] = useFormState<any, FormData>(signup, {
    message: "",
  });

  return <form action={formAction}>{getAuthInputs("signup", state)}</form>;
}
