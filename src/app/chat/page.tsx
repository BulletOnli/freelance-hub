import OnlineUsers from "./_components/OnlineUsers";

const ChatPage = () => {
  return (
    <main className="w-full h-full flex justify-center items-center sm:p-10">
      <div className="max-w-lg text-center flex flex-col gap-2">
        <p className="text-3xl font-black uppercase">
          Welcome to Freelance Chats
        </p>
        <p className="text-sm">
          Connect with freelancers and clients effortlessly
        </p>
      </div>

      <OnlineUsers />
    </main>
  );
};

export default ChatPage;
