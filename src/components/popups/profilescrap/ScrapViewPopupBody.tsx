import { ScrapThumnailInfo } from 'components/common/body/ProfileScrapThumbnailListView';
import React from 'react';
import ProfileScrapViewBody from '../../common/body/ProfileScrapViewBody';

interface ScrapViewPopupBodyProps {
  selectedScrapList: ScrapThumnailInfo[];
  setSelectedScrapList: React.Dispatch<
    React.SetStateAction<ScrapThumnailInfo[]>
  >;
  ScrapViewPopupBodyStyle?: React.CSSProperties;
  isInitTimout: boolean;
}

const ScrapViewPopupBody: React.FC<ScrapViewPopupBodyProps> = ({
  selectedScrapList,
  setSelectedScrapList,
  ScrapViewPopupBodyStyle,
  isInitTimout,
}) => {
  const onSelectScraps = (scrapThumnailInfo: ScrapThumnailInfo) => {
    if (
      selectedScrapList
        .map((v) => v.scrapId)
        .includes(scrapThumnailInfo.scrapId)
    ) {
      setSelectedScrapList((prev) =>
        prev.filter((value) => value.scrapId !== scrapThumnailInfo.scrapId),
      );
    } else {
      setSelectedScrapList((prev) => [...prev, scrapThumnailInfo]);
    }
  };

  return (
    <ProfileScrapViewBody
      isAddMove={true}
      onButtonEvent={onSelectScraps}
      scrapIdList={selectedScrapList.map((v) => v.scrapId)}
      mainContainerStyle={ScrapViewPopupBodyStyle}
      isInitTimout={isInitTimout}
    />
  );
};

export default ScrapViewPopupBody;
