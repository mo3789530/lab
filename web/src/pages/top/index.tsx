import { MessageList } from "@/components/MessageList";

export function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <MessageList />
    </div>
  );
}