export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main data-theme="default">
      {children}
    </main>
  );
}
