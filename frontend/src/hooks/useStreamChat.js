import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import * as Sentry from "@sentry/react";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

// This hook is used to connect the current user to the Stream Chat Api.
// so that users can see each other's message, send message to each other, get realtime update, etc.
// it also handles the disconnection when a user leave the page.

export const useStreamChat = () => {
  const { user } = useUser();
  const [chatClient, setChatClient] = useState(null);

  const {
    data: tokenData,
    isLoading: tokenLoading,
    error: tokenError,
  } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!user?.id, // this will take the object and convert to a boolean value.
  });

  // init stream chat client
  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !user) return;
      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser({
          id: user.id,
          name: user.fullName,
          image: user.imageUrl,
        });
        setChatClient(client)
      } catch (error) {
        console.log("Error Connecting To Stream: ", error);
        Sentry.captureException(error, {
            tags: {component: "useStreamChat"},
            extra: {
                context: "stream_chat_connection",
                userId: user?.id,
                streamApiKey: STREAM_API_KEY ? "present" : "missing",
            }
        });
      }
    };
    initChat();

    return () => {
        if(chatClient)
            chatClient.disconnectUser();
    }
  }, [tokenData, user]);

  return {chatClient, isLoading:tokenLoading, error: tokenError};
};
