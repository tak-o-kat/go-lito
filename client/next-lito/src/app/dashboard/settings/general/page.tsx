import ThemeSelect from "@/components/settings/theme-select";
import UpdatePasswordForm from "@/components/settings/updatePasswordForm";
import { getSession } from "@/lib/auth/session";

export default async function AccountsPage() {
  const session = await getSession();
  console.log(session.theme);
  return (
    <div className="grid gap-6">
      <ThemeSelect currentTheme={session?.theme || "theme-default"} />
      <UpdatePasswordForm />
    </div>
  );
}
