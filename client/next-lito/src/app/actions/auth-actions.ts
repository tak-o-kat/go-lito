"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getFormValues, getSession, type FormValues } from "@/lib/session";
import { queryOne } from "@/lib/db";
import { storeUser, updateUserPassword } from "@/lib/auth";
import { comparePasswords } from "@/lib/hashing";

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
    return {
      error: formValues.error.message,
    };
  }

  // Store user in DB
  try {
    await storeUser(formValues.username!, formValues.password);
  } catch (error) {
    // Check if user already exists
    const errorType = (error as Error)?.message.split(" ")[0];
    if (errorType === "UNIQUE") {
      return { error: "user already exists" };
    }
    // Some other sql error
    return { error: (error as Error)?.message };
  }

  // Check DB for username and id
  const query = `SELECT * FROM users WHERE username = ? LIMIT 1`;
  const user = (await queryOne(query, [formValues.username as string])) as user;

  if (user) {
    session.username = user?.username!;
    session.userId = user?.id!;
    session.isLoggedIn = true;
  }

  await session.save();
  redirect(getRedirectToUrl());
}

type authFormState = {
  error: undefined | string;
};

export async function login(_prevState: authFormState, formData: FormData) {
  const session = await getSession();

  const typeName = formData.get("type-name") as string;
  const formValues: FormValues = getFormValues(typeName, formData);

  if (formValues.error) {
    return { error: formValues.error.message };
  }

  // Compare user and password in DB
  const query = `SELECT * FROM users WHERE username = ? LIMIT 1`;
  const user = (await queryOne(query, [formValues.username as string])) as user;

  console.log(user);
  if (user) {
    const match = await comparePasswords(formValues.password, user.password);
    // If passwords do not match return error
    if (!match) {
      return {
        error: "password is incorrect",
      };
    }
  } else {
    return {
      error: "username not found",
    };
  }

  // Store session
  session.username = user?.username!;
  session.userId = user?.id!;
  session.isLoggedIn = true;
  await session.save();

  const redirectTo = getRedirectToUrl();
  console.log(redirectTo);
  redirect(redirectTo);
}

export async function renew(_prevState: authFormState, formData: FormData) {
  const session = await getSession();

  const typeName = formData.get("type-name") as string;
  const formValues: FormValues = getFormValues(typeName, formData);

  if (formValues.error) {
    return { error: formValues.error.message };
  }

  // Update the users password
  session.username = "test@gmail.com";
  updateUserPassword(session.username!, formValues.password);

  // Verify updated password
  const query = `SELECT * FROM users WHERE username = ? LIMIT 1`;
  const user = (await queryOne(query, [session.username as string])) as user;

  if (user) {
    const match = await comparePasswords(formValues.password, user.password);
    if (!match) {
      console.log("Something went wrong with the password update");
    }
  } else {
    console.log("Something went wrong with username");
  }
  await session.save();
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/login");
}
