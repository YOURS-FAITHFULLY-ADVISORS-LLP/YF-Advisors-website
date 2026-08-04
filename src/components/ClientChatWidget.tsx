"use client";

import dynamic from "next/dynamic";

const ChatWidget = dynamic(() => import("@/src/components/chatbot"), {
  ssr: false,
});

export default function ClientChatWidget() {
  return <ChatWidget />;
}
