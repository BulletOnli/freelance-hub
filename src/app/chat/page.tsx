import { redirect } from "next/navigation";

const ROOM_KEY = "66fa56879b2e78b97b1590ad";

const ChatPage = () => {
  redirect(`/chat/${ROOM_KEY}`);
};

export default ChatPage;
