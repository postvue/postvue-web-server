import { ReactComponent as PostComposeTagDeleteButtonIcon } from 'assets/images/icon/svg/PostComposeTagDeleteButtonIcon.svg';
import BorderCircleButton from 'components/common/buttton/BorderCircleButton';
import HorizontalGrabScrollContainer from 'components/common/container/HorizontalGrabScrollContainer';
import { ACTIVE_CLASS_NAME } from 'const/ClassNameConst';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import theme from 'styles/theme';

interface TagSelectedListElementProps {
  tagList: string[];
  setTagList: React.Dispatch<React.SetStateAction<string[]>>;
  TagSelectedContainerStyle?: React.CSSProperties;
}
const TagSelectedListElement: React.FC<TagSelectedListElementProps> = ({
  tagList,
  setTagList,
  TagSelectedContainerStyle,
}) => {
  const tagListRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (tagListRef.current) {
      tagListRef.current.scrollLeft = tagListRef.current.scrollWidth;
    }
  }, [tagList]);
  return (
    <HorizontalGrabScrollContainer
      horiontalContainerRef={tagListRef}
      HorizontalGrabScrollContainerStyle={{
        ...{
          gap: '10px',
          padding: `0 ${theme.systemSize.appDisplaySize.bothSidePadding} 0 ${theme.systemSize.appDisplaySize.bothSidePadding}`,
          height: '50px',
        },
        ...TagSelectedContainerStyle,
      }}
    >
      {tagList.map((value, key) => (
        <PostComposeTagWrap key={key}>
          <BorderCircleButton
            className={ACTIVE_CLASS_NAME}
            contentText={value}
            activeBackgroundColor={theme.mainColor.Blue}
            activeBorderColor={theme.mainColor.Blue}
            activeFontColor={theme.mainColor.White}
          />
          <PostComposeTagDeleteWrap
            onClick={() => {
              setTagList((prev) =>
                prev.filter((preValue) => preValue !== value),
              );
            }}
          >
            <PostComposeTagDeleteButtonIcon />
          </PostComposeTagDeleteWrap>
        </PostComposeTagWrap>
      ))}
    </HorizontalGrabScrollContainer>
  );
};

const PostComposeTagWrap = styled.div`
  position: relative;
`;

const PostComposeTagDeleteWrap = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`;

export default TagSelectedListElement;
