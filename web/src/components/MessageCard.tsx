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
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>{message.Name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{message.Message}</CardDescription>
        {message.ImageUrl && (
          <div className="mt-4">
            <img 
              src={message.ImageUrl} 
              alt="Message attachment" 
              className="rounded-md max-h-64 w-auto"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}