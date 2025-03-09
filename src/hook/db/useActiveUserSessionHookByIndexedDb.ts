import { ActiveUserSession, db } from 'global/db/db';
import { useEffect, useState } from 'react';

export const useActiveUserSessionHookByIndexedDb = (): {
  activeUserSessions: ActiveUserSession[];
  addActiveUserSession: (
    message: Omit<ActiveUserSession, 'id'>,
  ) => Promise<void>;
  addActiveUserSessions: (
    messages: Omit<ActiveUserSession, 'id'>[],
  ) => Promise<void>;
  putActiveUserSessions: (
    messages: Omit<ActiveUserSession, 'id'>[],
  ) => Promise<void>;
  updateActiveUserSession: (
    id: string,
    updatedData: Partial<ActiveUserSession>,
  ) => Promise<void>;
  deleteActiveUserSession: (id: string) => Promise<void>;
  resetActiveUserSessions: () => Promise<void>;
  getActiveUserSession: (id: string) => Promise<ActiveUserSession | undefined>;
} => {
  const [activeUserSessions, setActiveUserSessions] = useState<
    ActiveUserSession[]
  >([]);

  function roundUpMilliseconds(date: Date): Date {
    // 입력된 문자열을 Date 객체로 변환

    // 밀리초 값을 가져오기
    const milliseconds = date.getMilliseconds(); // 43.58 → 43

    // 올림 처리 (10의 자리까지)
    const roundedMilliseconds = Math.ceil(milliseconds / 10) * 10; // 43 → 44

    // 새로운 Date 객체 생성
    const roundedDate = new Date(date);
    roundedDate.setMilliseconds(roundedMilliseconds);

    return roundedDate;
  }

  // Fetch all messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const query = db.activeUserSession.orderBy('id').reverse();
        const msgs = await query.toArray();
        setActiveUserSessions(msgs);
      } catch (e) {
        console.log(e);
      }
    };

    fetchMessages();
  }, []);

  // Add a new message
  const addActiveUserSession = async (
    message: Omit<ActiveUserSession, 'id'>,
  ) => {
    await db.activeUserSession.add(message as ActiveUserSession);
    setActiveUserSessions(await db.activeUserSession.toArray());
  };

  const addActiveUserSessions = async (
    messages: Omit<ActiveUserSession, 'id'>[],
  ) => {
    await db.activeUserSession.bulkAdd(messages as ActiveUserSession[]);
    setActiveUserSessions(await db.activeUserSession.toArray());
  };

  const getActiveUserSession = async (id: string) => {
    return await db.activeUserSession.get(id);
  };

  const putActiveUserSessions = async (
    messages: Omit<ActiveUserSession, 'id'>[],
  ) => {
    try {
      await db.activeUserSession.bulkPut(messages); // ✅ 기존 데이터가 있으면 업데이트됨
      setActiveUserSessions(await db.activeUserSession.toArray());
    } catch (error) {
      console.log('Failed to add active user session:', error);
    }
  };

  const updateActiveUserSession = async (
    id: string,
    updatedData: Partial<ActiveUserSession>,
  ) => {
    try {
      const existingMessage = await db.activeUserSession.get(id);
      if (!existingMessage) {
        throw new Error(`Message with ID ${id} not found.`);
      }

      await db.activeUserSession.update(id, updatedData);
      console.log(`Message with ID ${id} updated successfully.`);
    } catch (error) {
      console.error(`Failed to update message with ID ${id}:`, error);
    }
  };

  // Delete a message
  const deleteActiveUserSession = async (id: string) => {
    await db.activeUserSession.delete(id);
    setActiveUserSessions(await db.activeUserSession.toArray());
  };

  // 📌 **알림 초기화 (모든 데이터 삭제)**
  const resetActiveUserSessions = async () => {
    await db.activeUserSession.clear();
  };

  return {
    activeUserSessions,
    addActiveUserSession,
    addActiveUserSessions,
    putActiveUserSessions,
    updateActiveUserSession,
    deleteActiveUserSession,
    resetActiveUserSessions,
    getActiveUserSession,
  };
};
