import React from 'react';
import ProfileScrapViewBody from '../../common/body/ProfileScrapViewBody';

interface ScrapViewPopupBodyProps {
  selectedScrapList: string[];
  setSelectedScrapList: React.Dispatch<React.SetStateAction<string[]>>;
  ScrapViewPopupBodyStyle?: React.CSSProperties;
}

const ScrapViewPopupBody: React.FC<ScrapViewPopupBodyProps> = ({
  selectedScrapList,
  setSelectedScrapList,
  ScrapViewPopupBodyStyle,
}) => {
  const onSelectScraps = (scrapId: string) => {
    if (selectedScrapList.includes(scrapId)) {
      setSelectedScrapList((prev) => prev.filter((value) => value !== scrapId));
    } else {
      setSelectedScrapList((prev) => [...prev, scrapId]);
    }
  };

  return (
    <ProfileScrapViewBody
      isAddMove={true}
      onButtonEvent={onSelectScraps}
      scrapIdList={selectedScrapList}
      mainContainerStyle={ScrapViewPopupBodyStyle}
    />
  );
};

export default ScrapViewPopupBody;
