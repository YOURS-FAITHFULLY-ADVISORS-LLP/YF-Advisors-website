"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ChatWidget = dynamic(() => import("@/src/components/chatbot"), {
  ssr: false,
});

export default function ClientChatWidget() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 3000);

    const handleInteract = () => {
      setShouldRender(true);
    };

    window.addEventListener("pointerdown", handleInteract, { once: true });
    window.addEventListener("keydown", handleInteract, { once: true });
    window.addEventListener("scroll", handleInteract, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointerdown", handleInteract);
      window.removeEventListener("keydown", handleInteract);
      window.removeEventListener("scroll", handleInteract);
    };
  }, []);

  if (!shouldRender) return null;

  return <ChatWidget />;
}
