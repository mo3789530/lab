import { useEffect, useState } from "react";
import { MessageCard } from "./MessageCard";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface Message {
  Id?: string;
  ImageUrl?: string;
  Name: string;
  Message: string;
}

const mockData: Message[] = [
  {
    Id: "1",
    ImageUrl: "/building_takoyaki_yatai.png",
    Name: "ユーザー1",
    Message: "こんにちは！これはテストメッセージです。",
  },
  {
    Id: "2",
    Name: "ユーザー2",
    Message: "APIが準備できるまでモックデータを使用します。",
  },
    {
    Id: "3",
    Name: "ユーザー3",
    Message: "APIが準備できるまでモックデータを使用します。",
  },
      {
    Id: "4",
    Name: "ユーザー3",
    Message: "APIが準備できるまでモックデータを使用します。",
    ImageUrl: "/building_takoyaki_yatai.png",
  },
]

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const fetchMessages = async (currentOffset: number) => {
    setLoading(true);
    try {

      let data: Message[] = []
      const response = await fetch(
        `/api/v1/messages?offset=${currentOffset}&limit=${limit}`
      );
      // if (!response.ok) {
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // }

      // data = await response.json();

      data = mockData

      if (currentOffset === 0) {
        setMessages(data);
      } else {
        setMessages((prev) => [...prev, ...data]);
      }

      // モックデータを使用しているため、追加データはない
      setHasMore(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "通信エラーが発生しました。ネットワーク接続を確認してください。";
      setError(errorMessage);
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(0);
  }, []);

  const loadMore = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchMessages(newOffset);
  };

  return (
    <div className="flex flex-col gap-4">
      {messages.length === 0 && !loading ? (
        <div>Post is not found</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {messages.map((message) => (
              <MessageCard
                key={message.Id || `${message.Name}-${Date.now()}`}
                message={message}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center my-4">
              <Button onClick={loadMore} disabled={loading} className="px-6">
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </>
      )}

      {loading && offset === 0 && <div>Loading messages...</div>}
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>通信エラーが発生しました</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
