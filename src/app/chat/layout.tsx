import ChatSidebar from "./_components/ChatSidebar";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen2">
      <ChatSidebar />

      <div className="w-full p-4">{children}</div>
    </div>
  );
}
