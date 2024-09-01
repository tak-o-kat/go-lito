import { syncSession } from "@/app/actions/update-actions";

export default async function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="bg-muted/10  min-h-screen">{children}</div>;
}
