import { redirect } from "next/navigation";
import { doesAtLeastOneUserExist } from "@/lib/auth/auth";

export default async function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check if no user exists in the DB
  const userExists = await doesAtLeastOneUserExist();
  if (userExists) {
    redirect("/login");
  }

  return <div>{children}</div>;
}
