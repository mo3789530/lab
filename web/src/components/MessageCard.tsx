import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";

interface Message {
  Id?: string;
  ImageUrl?: string;
  Name: string;
  Message: string;
}

export function MessageCard({ message }: { message: Message }) {
  return (
    <Card className="w-full h-full flex flex-col">
      {/* 画像を一番上に表示 */}
      {message.ImageUrl && (
        <div className="w-full">
          <img 
            src={message.ImageUrl} 
            alt="Message attachment" 
            className="w-full h-48 object-cover rounded-t-lg"
          />
        </div>
      )}
      
      <CardContent className="flex-grow">
        <CardDescription className="mb-4">{message.Message}</CardDescription>
      </CardContent>
      
      {/* 名前を右下に配置 */}
      <div className="p-4 pt-0 text-right">
        <span className="text-sm font-medium">{message.Name}</span>
      </div>
    </Card>
  );
}