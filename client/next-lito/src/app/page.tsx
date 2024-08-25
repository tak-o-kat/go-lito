import { getSession } from "@/lib/session";
import { logout } from "./actions/auth-actions";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await getSession();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm lg:flex">
        {session.isLoggedIn && `Welcome ${session.username}`}
        <form action={logout}>
          <Button
            variant="outline"
            className="bg-primary text-primary-foreground focus-visible:ring-0 focus-visible:ring-offset-0 box-shadow-none"
          >
            logout
          </Button>
        </form>
      </div>
    </main>
  );
}
