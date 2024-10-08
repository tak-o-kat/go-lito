import NavBar from "@/components/navbar/navbar";
import { pause } from "@/utils/helpers";

export default async function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col justify-center w-full">
      <NavBar />
      {children}
    </div>
  );
}
