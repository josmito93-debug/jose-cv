import Shell from "@/app/components/layout/Shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Shell>{children}</Shell>;
}
