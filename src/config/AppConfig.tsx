import React from 'react';
import AppInitConfig from './appconfig/AppInitConfig';
import KakaoInitConfig from './appconfig/KakaoInitConfig';

const AppConfig: React.FC = () => {
  // console.log('APP 호출');
  // const lastNotficationReadAt = getLastNotificationReadAt();
  // const { data: notifcationList } = QueryStateNotificationMsg(
  //   lastNotficationReadAt,
  // );

  // useEffect(() => {
  //   if (notifcationList) {
  //     saveNotificationMsgListByLocalStorage(notifcationList);
  //   }
  // }, [notifcationList]);

  return (
    <>
      <AppInitConfig />
      <KakaoInitConfig />
    </>
  );
};

export default AppConfig;
