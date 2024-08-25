import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  if (session.isLoggedIn) {
    redirect("/");
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-start px-4 py-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center text-sm lg:flex">
        {children}
      </div>
    </main>
  );
}
