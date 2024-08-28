import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { doesAtLeastOneUserExist } from "@/lib/auth/auth";

export default async function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check if no user exists in the DB
  const userExists = await doesAtLeastOneUserExist();
  if (!userExists) {
    redirect("/signup");
  }

  return <div>{children}</div>;
}
