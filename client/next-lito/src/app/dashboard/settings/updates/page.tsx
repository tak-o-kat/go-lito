import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import UpdateLito from "@/components/settings/update-lito";
import { GOLITO_API, GOLITO_API_REPO } from "@/lib/const";

export default async function GeneralSettingsPage() {
  const session = await getSession();

  if (!session.isLoggedIn) {
    redirect("/login");
  }

  async function getCurrentVersion() {
    // Make a call to get the the current data from the node.log file
    const url = `${GOLITO_API}/version`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to get log data");
    }

    const data = await response.json();
    return data.version;
  }

  async function getRepoLatestVersion() {
    // Make a call to get the the current data from the node.log file
    const url = `${GOLITO_API_REPO}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to get log data");
    }

    const data = await response.json();
    return data.tag_name.split("-")[0];
  }

  const version = await getCurrentVersion();
  const repoVersion = await getRepoLatestVersion();

  return (
    <div className="grid gap-6">
      <UpdateLito
        version={version || "No version found!"}
        repoVersion={repoVersion || "No version found"}
      />
    </div>
  );
}
