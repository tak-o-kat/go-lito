import { SessionOptions } from "iron-session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  userId?: number;
  username?: string;
  theme?: string;
  isLoggedIn: boolean;
}

export interface FormValues {
  username?: string;
  password: string;
  confirmPassword?: string;
  currentPassword?: string;
  error?: {
    name?: boolean;
    password?: boolean;
    confirmPassword?: boolean;
    message?: string;
  };
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_KEY!,
  cookieName: "lito-session",
  cookieOptions: {
    httpOnly: true,
    secure: false,
  },
};

export function getFormValues(typeName: string, formData: FormData) {
  const retValue: FormValues = {
    username: typeName !== "renew" ? (formData.get("username") as string) : "",
    password: formData.get("password") as string,
    confirmPassword:
      typeName !== "login" ? (formData.get("confirm-password") as string) : "",
    currentPassword:
      typeName === "renew" ? (formData.get("current-password") as string) : "",
    error: undefined,
  };

  if (typeName !== "login" && retValue.password !== retValue.confirmPassword) {
    retValue.error = {
      message: "passwords do not match!",
    };
  }

  return retValue;
}

export async function getSession() {
  "use server";
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  // If user visits for the first time session returns an empty object.
  // Let's add the isLoggedIn property to this object and its value will be the default value which is false
  if (!session.isLoggedIn) {
    session.isLoggedIn = process.env.LOGIN_REQUIRED === "true" ? false : true;
  }

  return session;
}
