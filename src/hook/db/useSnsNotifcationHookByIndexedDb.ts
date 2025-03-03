import { liveQuery } from 'dexie';
import { db, SnsNotification } from 'global/db/db';
import { useCallback, useEffect, useRef, useState } from 'react';

const PAGE_SIZE = 10; // 한 번에 가져올 데이터 개수

export const useSnsNotificationHookByIndexedDb = (): {
  notifications: SnsNotification[];
  hasUnreadNotifications: boolean;
  latestNotificationAt: Date | null;
  addNotification: (message: Omit<SnsNotification, 'id'>) => Promise<void>;
  addNotifications: (messages: Omit<SnsNotification, 'id'>[]) => Promise<void>;
  putNotifications: (messages: Omit<SnsNotification, 'id'>[]) => Promise<void>;
  updateNotification: (
    id: string,
    updatedData: Partial<SnsNotification>,
  ) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  resetNotifications: () => Promise<void>;
  readNotificationMsgList: () => Promise<void>;
  loadMoreNotifications: () => Promise<SnsNotification[] | undefined>;
  hasMore: boolean;
} => {
  const [latestNotificationAt, setLatestNotificationAt] = useState<Date | null>(
    null,
  );
  const [notifications, setNotifications] = useState<SnsNotification[]>([]);

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
    // 📌 가장 최신 `sendAt`을 가진 데이터 가져오기
    const subscription = liveQuery(() =>
      db.snsNotification.orderBy('id').reverse().first(),
    ).subscribe((value) => {
      if (!value) return;
      setLatestNotificationAt(roundUpMilliseconds(value.notifiedAt));
    });

    const fetchMessages = async () => {
      const msgs = await loadMoreNotifications();
      if (msgs && msgs.length > 0) {
        setLatestNotificationAt(roundUpMilliseconds(msgs[0].notifiedAt));
      } else {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1); // 현재 날짜에서 한 달 전으로 설정
        setLatestNotificationAt(roundUpMilliseconds(oneMonthAgo));
      }
    };

    fetchMessages();

    return () => {
      subscription.unsubscribe();
    }; // 메모리 누수 방지
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const lastFetchedId = useRef<string | null>(null); // 마지막으로 가져온 데이터의 ID 저장
  const [hasUnreadNotifications, setHasUnreadNotifications] =
    useState<boolean>(false);

  // 실시간 알림 감지
  useEffect(() => {
    const subscription = liveQuery(() =>
      db.snsNotification.toArray(),
    ).subscribe((msgs) => {
      // 기존 상태 업데이트

      // 최신 알림 감지 및 표시
      const newNotifications = msgs.filter((v) => !v.isRead);

      console.log('Unread Notifications:', newNotifications);

      if (newNotifications.length > 0) {
        setHasUnreadNotifications(true);
      } else {
        setHasUnreadNotifications(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [notifications]);

  // // 실시간 알림 감지
  // useEffect(() => {
  //   const subscription = liveQuery(() =>
  //     db.snsNotification.toArray(),
  //   ).subscribe((msgs) => {
  //     // 기존 상태 업데이트
  //     setNotifications(msgs);
  //     // 최신 알림 감지 및 표시
  //     const newNotifications = msgs.filter((msg) => msg.id > lastCheckedId);

  //     if (newNotifications.length > 0) {
  //       setLastCheckedId(newNotifications[newNotifications.length - 1].id);
  //     }
  //   });

  //   return () => subscription.unsubscribe();
  // }, [lastCheckedId]);

  // 📌 무한 스크롤: IndexedDB에서 데이터 가져오기
  const loadMoreNotifications = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      let query = db.snsNotification.orderBy('id').reverse(); // 최신순 정렬

      // 마지막으로 가져온 데이터 이후부터 가져오기 (BigInt 변환 후 비교)

      const latFetchedObject = lastFetchedId.current;
      if (latFetchedObject !== null) {
        query = query.filter(
          (msg) => BigInt(msg.id) < BigInt(latFetchedObject),
        );
      }

      const newNotifications = await query.limit(PAGE_SIZE).toArray();

      if (newNotifications.length > 0) {
        setNotifications((prev) => [...prev, ...newNotifications]);
        lastFetchedId.current =
          newNotifications[newNotifications.length - 1].id;
      }

      // 데이터가 PAGE_SIZE보다 적으면 더 이상 로드할 데이터 없음
      if (newNotifications.length < PAGE_SIZE) {
        setHasMore(false);
      }

      return newNotifications;
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore]);

  const readNotificationMsgList = async () => {
    try {
      await db.snsNotification.toCollection().modify((notification) => {
        notification.isRead = true;
      });
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  // Add a new message
  const addNotification = async (message: Omit<SnsNotification, 'id'>) => {
    await db.snsNotification.add(message as SnsNotification);
    setNotifications(await db.snsNotification.toArray());
  };

  const addNotifications = async (messages: Omit<SnsNotification, 'id'>[]) => {
    await db.snsNotification.bulkAdd(messages as SnsNotification[]);
    setNotifications(await db.snsNotification.toArray());
  };

  const putNotifications = async (messages: Omit<SnsNotification, 'id'>[]) => {
    try {
      await db.snsNotification.bulkPut(messages); // ✅ 기존 데이터가 있으면 업데이트됨
      setNotifications(await db.snsNotification.toArray());
    } catch (error) {
      console.error('Failed to add notifications:', error);
    }
  };

  const updateNotification = async (
    id: string,
    updatedData: Partial<SnsNotification>,
  ) => {
    try {
      const existingMessage = await db.snsNotification.get(id);
      if (!existingMessage) {
        throw new Error(`Message with ID ${id} not found.`);
      }

      await db.snsNotification.update(id, updatedData);
      console.log(`Message with ID ${id} updated successfully.`);
    } catch (error) {
      console.error(`Failed to update message with ID ${id}:`, error);
    }
  };

  // Delete a message
  const deleteNotification = async (id: string) => {
    await db.snsNotification.delete(id);
    setNotifications(await db.snsNotification.toArray());
  };

  // 📌 **알림 초기화 (모든 데이터 삭제)**
  const resetNotifications = async () => {
    await db.snsNotification.clear();
  };

  return {
    notifications,
    hasUnreadNotifications,
    latestNotificationAt,
    addNotification,
    addNotifications,
    putNotifications,
    deleteNotification,
    updateNotification,
    resetNotifications,
    readNotificationMsgList,
    loadMoreNotifications,
    hasMore,
  };
};
