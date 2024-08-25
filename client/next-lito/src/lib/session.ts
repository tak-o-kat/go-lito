import { SessionOptions } from "iron-session";

export interface SessionData {
  userId?: number;
  username?: string;
  isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
  isLoggedIn: process.env.LOGIN_REQUIRED === "true" ? false : true,
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_KEY!,
  cookieName: "lito-session",
  cookieOptions: {
    httpOnly: true,
    secure: false,
  },
};
