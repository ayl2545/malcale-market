import { notFound } from "next/navigation";
import {
  getConversation,
  getUser,
  getListing,
  CURRENT_USER_ID,
  conversations,
} from "@/lib/mock-data";
import { ChatThread } from "@/components/ChatThread";

export async function generateStaticParams() {
  return conversations.map((c) => ({ id: c.id }));
}

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const convo = getConversation(id);
  if (!convo) notFound();
  const other = getUser(convo.participantId);
  const listing = getListing(convo.listingId);
  if (!other || !listing) notFound();

  return (
    <ChatThread
      conversationId={convo.id}
      initialMessages={convo.messages}
      currentUserId={CURRENT_USER_ID}
      other={{
        id: other.id,
        displayName: other.displayName,
        username: other.username,
        avatarUrl: other.avatarUrl,
      }}
      listing={{
        id: listing.id,
        title: listing.title,
        price: listing.price,
        image: listing.images[0],
      }}
    />
  );
}
