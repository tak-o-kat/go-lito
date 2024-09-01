import ThemeSelect from "@/components/settings/theme-select";
import UpdatePasswordForm from "@/components/settings/updatePasswordForm";
import { getSession } from "@/lib/auth/session";
import TimeIntervalCard from "@/components/settings/time-interval-card";
import { getUserTimeInterval } from "@/lib/db/get-user-data";

export default async function GeneralSettingsPage() {
  const session = await getSession();
  const timeInterval = await getUserTimeInterval();
  return (
    <div className="grid gap-6">
      <ThemeSelect currentTheme={session?.theme || "theme-default"} />
      <TimeIntervalCard timeInterval={timeInterval} />
      <UpdatePasswordForm />
    </div>
  );
}
