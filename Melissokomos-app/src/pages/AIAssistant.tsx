import React, { useState, useRef, useEffect } from "react";
import { SendIcon, Bug, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm your beekeeping assistant. How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true); // Set loading to true when sending a message

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:8080", // Replace with your actual URL
          "X-Title": "Buzzkeeper",
        },
        body: JSON.stringify({
          model: "google/gemma-3-27b-it:free",
          messages: [
            { role: "user", content: userMessage.text },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantResponse = data.choices[0].message.content;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: assistantResponse,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(
        `Failed to get a response: ${error.message}`
      );
      // Add a default error message to the chat
      const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'm having trouble connecting right now. Please try again later.",
          sender: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false); // Set loading to false after response or error
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-3xl font-bold mb-6">AI Beekeeping Assistant</h1>

      <Card className="flex flex-col flex-grow">
        <CardHeader className="pb-2">
          <CardTitle>Chat with BeeGPT</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col h-[calc(100vh-300px)] pb-0">
          <div className="overflow-y-auto flex-grow mb-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start gap-2.5 max-w-3/4 ${
                    message.sender === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                      message.sender === "user" ? "bg-primary" : "bg-amber-500"
                    }`}
                  >
                    {message.sender === "user" ? (
                      <User2 className="h-4 w-4" />
                    ) : (
                      <Bug className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t pt-4 mb-2">
            <div className="flex gap-2">
              <Textarea
                placeholder="Ask me anything about beekeeping..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="resize-none"
                disabled={isLoading}
              />
              <Button
                className="shrink-0"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
              >
                {isLoading ? "Sending..." : <><SendIcon className="h-4 w-4" /><span className="sr-only">Send</span></>}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
