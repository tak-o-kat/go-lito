"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getFormValues, getSession, type FormValues } from "@/lib/auth/session";
import { queryOne } from "@/lib/db/db";
import { storeUser } from "@/lib/auth/auth";
import { comparePasswords, hashPassword } from "@/lib/auth/hashing";
import { updateUserPassword } from "./update-actions";
import { user } from "@/lib/types";

function getRedirectToUrl() {
  const headersList = headers();
  const referer = headersList.get("referer") as string | URL;
  const url = new URL(referer);
  const searchParams = url.searchParams;
  const redirect = searchParams.get("redirect");
  return redirect || "/";
}

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
    Object.assign(session, user);
    session.isLoggedIn = true;
    await session.save();
  }
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

  if (user) {
    const match = await comparePasswords(formValues.password, user.password);
    // If passwords do not match return error
    if (!match) {
      return {
        error: "password is incorrect",
      };
    }

    // Sync session data with the database
    Object.assign(session, user);
    session.isLoggedIn = true;

    await session.save();
  } else {
    return {
      error: "username not found",
    };
  }

  const redirectTo = getRedirectToUrl();
  redirect(redirectTo);
}

export async function renew(_prevState: authFormState, formData: FormData) {
  const session = await getSession();

  const typeName = formData.get("type-name") as string;
  const formValues: FormValues = getFormValues(typeName, formData);
  if (formValues.error) {
    return { error: formValues.error.message };
  }

  // check if the current password is correct
  const currentPasswordQuery = `SELECT * FROM users WHERE username = ? LIMIT 1`;
  const currPass = (await queryOne(currentPasswordQuery, [
    session.username as string,
  ])) as user;

  if (currPass) {
    const match = await comparePasswords(
      formValues.currentPassword!,
      currPass.password
    );
    // If passwords do not match return error
    if (!match) {
      return {
        error: "current password is incorrect",
      };
    }
  } else {
    return {
      error: "user in session not found",
    };
  }

  try {
    await updateUserPassword(session.username!, formValues);
  } catch (error) {
    console.log(error);
    throw error;
  }

  // Verify updated password
  const query = `SELECT * FROM users WHERE username = ? LIMIT 1`;
  const user = (await queryOne(query, [session.username as string])) as user;

  if (user) {
    const match = await comparePasswords(formValues.password, user.password);
    if (!match) {
      console.log("Form Password and password in db do not match");
    }
  } else {
    console.log("Something went wrong with username");
  }
  // TODO: Add notification on success
  await session.save();
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/login");
}
