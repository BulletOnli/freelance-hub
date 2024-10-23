import { getCurrentUser } from "@/lib/sessions";
import { redirect } from "next/navigation";

const ChatPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  redirect(`/chat/${user.id}`);
};

export default ChatPage;
