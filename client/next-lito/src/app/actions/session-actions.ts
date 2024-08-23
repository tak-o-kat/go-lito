"use server";

import { SessionData, sessionOptions, defaultSession } from "@/lib/session";
// import { defaultSession, sessionOptions } from "@/libs/lib";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ADD THE GETSESSION ACTION
export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  // If user visits for the first time session returns an empty object.
  // Let's add the isLoggedIn property to this object and its value will be the default value which is false
  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }

  return session;
}

export async function login(
  prevState: { error: undefined | string },
  formData: FormData
) {
  const session = await getSession();

  const formUsername = formData.get("username") as string;
  const formPassword = formData.get("password") as string;

  console.log(formUsername, formPassword);

  // Check DB for username and password
  // const user = await db.getUser(formUsername, formPassword);
  const user = {
    id: 1,
    username: formUsername,
    img: "avatar.png",
  };

  // if (formUsername !== user.username || formPassword !== user.password) {

  if (!user) {
    return { error: "Wrong Credentials!" };
  }

  session.isLoggedIn = true;
  session.userId = user.id;
  session.username = user.username;

  await session.save();
  redirect("/");
}

export async function logout(formData: FormData) {
  const session = await getSession();
  session.destroy();
  redirect("/login");
}
