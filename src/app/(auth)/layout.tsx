export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 sm:px-0">
      {children}
    </div>
  );
}
