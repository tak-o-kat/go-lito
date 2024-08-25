"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getFormValues, getSession, type FormValues } from "@/lib/session";
import { queryOne } from "@/lib/db";
import { storeUser } from "@/lib/auth";

function getRedirectToUrl() {
  const headersList = headers();
  const referer = headersList.get("referer") as string | URL;
  const url = new URL(referer);
  const searchParams = url.searchParams;
  const redirect = searchParams.get("redirect");
  return redirect || "/";
}

type user = {
  id: number;
  username: string;
  password: string;
};

export async function signup(
  prevState: { error: undefined | string },
  formData: FormData
) {
  const session = await getSession();

  const typeName = formData.get("type-name") as string;
  const formValues: FormValues = getFormValues(typeName, formData);

  if (formValues.error) {
    return { error: formValues.error.message };
  }

  // Store user in DB
  try {
    await storeUser(formValues.username!, formValues.password);
  } catch (error) {
    console.log(error);
    return { error: "Failed to store user in database" };
  }

  // Check DB for username and id
  const query = `SELECT * FROM users LIMIT 1`;
  const user = (await queryOne(query)) as user;

  if (user) {
    session.username = user?.username!;
    session.userId = user?.id!;
    session.isLoggedIn = true;
  }

  await session.save();
  redirect(getRedirectToUrl());
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/login");
}
