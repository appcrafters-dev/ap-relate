"use client";

import { useEffect } from "react";
import { MarkConversationAsRead } from "../[id]/actions";

export default function MarkAsRead({ messageId }) {
  useEffect(() => {
    MarkConversationAsRead(messageId);
  }, []);
  return <></>;
}
