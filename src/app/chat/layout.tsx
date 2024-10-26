import ChatSidebar from "./_components/ChatSidebar";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen2 overflow-hidden">
      <ChatSidebar />

      <div className="w-full h-full px-4 py-2">{children}</div>
    </div>
  );
}
