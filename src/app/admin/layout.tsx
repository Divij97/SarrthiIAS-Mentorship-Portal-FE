export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add admin-specific layout elements here */}
      {children}
    </div>
  );
} 