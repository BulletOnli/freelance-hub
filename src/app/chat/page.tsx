import { redirect } from "next/navigation";

const ROOM_KEY = "roomkey";

const ChatPage = () => {
  redirect(`/chat/${ROOM_KEY}`);
};

export default ChatPage;
