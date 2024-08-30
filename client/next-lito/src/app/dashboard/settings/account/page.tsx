import { getSession } from "@/lib/auth/session";

export default async function AccountsPage() {
  const session = await getSession();
  console.log(session.theme);
  return <div className="grid gap-6">Account</div>;
}
