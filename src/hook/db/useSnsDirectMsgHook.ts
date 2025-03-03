import { db, SnsDirectMsg } from 'global/db/db';
import { useEffect, useState } from 'react';

export const useDirectMsgs = (): {
  messages: SnsDirectMsg[];
  addMessage: (message: Omit<SnsDirectMsg, 'id'>) => Promise<void>;
  deleteMessage: (id: number) => Promise<void>;
} => {
  const [messages, setMessages] = useState<SnsDirectMsg[]>([]);

  // Fetch all messages
  useEffect(() => {
    const fetchMessages = async () => {
      const msgs = await db.snsDirectMsgs.toArray();
      setMessages(msgs);
    };

    fetchMessages();
  }, []);

  // Add a new message
  const addMessage = async (message: Omit<SnsDirectMsg, 'id'>) => {
    await db.snsDirectMsgs.add(message as SnsDirectMsg);
    setMessages(await db.snsDirectMsgs.toArray());
  };

  const updateMessage = async (
    id: number,
    updatedData: Partial<SnsDirectMsg>,
  ) => {
    try {
      const existingMessage = await db.snsDirectMsgs.get(id);
      if (!existingMessage) {
        throw new Error(`Message with ID ${id} not found.`);
      }

      await db.snsDirectMsgs.update(id, updatedData);
      console.log(`Message with ID ${id} updated successfully.`);
    } catch (error) {
      console.error(`Failed to update message with ID ${id}:`, error);
    }
  };

  // Delete a message
  const deleteMessage = async (id: number) => {
    await db.snsDirectMsgs.delete(id);
    setMessages(await db.snsDirectMsgs.toArray());
  };

  return { messages, addMessage, deleteMessage };
};
