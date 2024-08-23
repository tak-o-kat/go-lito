import { SessionOptions } from "iron-session";

export interface SessionData {
  userId?: number;
  username?: string;
  img?: string;
  isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_KEY!,
  cookieName: "lito-session",
  cookieOptions: {
    httpOnly: true,
    secure: false,
  },
};
