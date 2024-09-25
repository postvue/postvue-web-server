import SearchButtonInput from 'components/common/input/SearchButtonInput';
import HeaderLayout from 'components/layouts/HeaderLayout';
import PopupLayout from 'components/layouts/PopupLayout';
import { SNS_SHARE_USER_SEARCH_PHASE_TEXT } from 'const/SystemPhraseConst';
import { getSearchQueryByDebounce } from 'global/util/SearchUtil';
import { isValidString } from 'global/util/ValidUtil';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { getTagSearchQuery } from 'services/search/getTagSearchQuery';
import { tagSearchInputAtom, tagSearchQueryHashMapAtom } from 'states/TagAtom';
import styled from 'styled-components';

import loadingBarGif from 'assets/images/gif/loadingBar.gif';
import { ReactComponent as FacebookShareButtonIcon } from 'assets/images/icon/svg/share/FacebookShareButtonIcon.svg';
import { ReactComponent as KakaoShareButtonIcon } from 'assets/images/icon/svg/share/KakaoShareButtonIcon.svg';
import { ReactComponent as MessageShareButtonIcon } from 'assets/images/icon/svg/share/MessageShareButtonIcon.svg';
import { ReactComponent as PinterestShareButtonIcon } from 'assets/images/icon/svg/share/PinterestShareButtonIcon.svg';
import { ReactComponent as ShareMoreButtonIcon } from 'assets/images/icon/svg/share/ShareMoreButtonIcon.svg';
import { ReactComponent as XShareButtonIcon } from 'assets/images/icon/svg/share/XShareButtonIcon.svg';
import { handleShareUtil } from 'global/util/ShareUtil';
import ProfileMyFollowingListInfiniteScroll from 'hook/ProfileMyFollowingListInfiniteScroll';
import {
  FacebookShareButton,
  PinterestShareButton,
  TwitterShareButton,
} from 'react-share';
import { isSharePopupAtom } from 'states/ShareAtom';

//@REFER: 태그 관련 상태관리 삭제 하삼
const SnsSharePopup: React.FC = () => {
  const tagListRef = useRef<HTMLDivElement>(null);
  const tagSearchInputRef: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const [isSharePopup, setIsSharePopup] = useRecoilState(isSharePopupAtom);

  const [tagSearchInput, setTagSearchInput] =
    useRecoilState(tagSearchInputAtom);

  const onSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const word = event.target.value;
    setLoading(true);
    if (isValidString(word)) {
      debouncedGetSearchQuery(word);
    }
    setTagSearchInput(event.target.value);
  };
  const [tagSearchQueryHashMap, setTagSearchQueryHashMap] = useRecoilState(
    tagSearchQueryHashMapAtom,
  );

  const [loading, setLoading] = useState(false); // Loading state

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      event.key === 'Enter' &&
      event.nativeEvent.isComposing === false &&
      isValidString(tagSearchInput)
    ) {
      tagSearchInputRef.current?.blur();
      // saveTagToList(tagSearchInput);
      onSearchInputDelete();
    }
  };

  const onSearchInputDelete = () => {
    setTagSearchInput('');
  };

  const debouncedGetSearchQuery = getSearchQueryByDebounce(
    (word: string) => {
      if (!tagSearchQueryHashMap.get(word)) {
        getTagSearchQuery(word)
          .then((value) => {
            const tempSearchQueryRelationHashMap = new Map(
              tagSearchQueryHashMap,
            );
            tempSearchQueryRelationHashMap.set(word, value);
            setTagSearchQueryHashMap(tempSearchQueryRelationHashMap);
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    },
    [tagSearchQueryHashMap],
  );

  // const saveTagToList = (searchQuery: string) => {
  //   if (!tagList.includes(searchQuery)) {
  //     setTagList((prev) => [...prev, searchQuery]);
  //   }
  // };

  // const onClickTagSearchQuery = (searchQuery: string) => {
  //   saveTagToList(searchQuery);
  //   onSearchInputDelete();
  // };

  useEffect(() => {
    return () => {
      setTagSearchInput('');
    };
  }, []);

  // useEffect(() => {
  //   if (tagListRef.current) {
  //     tagListRef.current.scrollLeft = tagListRef.current.scrollWidth;
  //   }
  // }, [tagList]);

  const SMSShareButtonHref = (url: string, body: string) => {
    const smsHref = `sms:&body=${encodeURIComponent(body)}%20${encodeURIComponent(url)}`;

    return smsHref;
  };

  return (
    <PopupLayout
      setIsPopup={setIsSharePopup}
      isTouchScrollBar={true}
      popupWrapStyle={PopupWrapStyle}
      hasFixedActive={true}
    >
      <SearchButtonInputHeaderContainer>
        <HeaderLayout>
          <PostComposeSearchInputWrap>
            <SearchButtonInputWrap>
              <SearchButtonInput
                searchInputRef={tagSearchInputRef}
                placeholder={SNS_SHARE_USER_SEARCH_PHASE_TEXT}
                onSearchInputChange={onSearchInputChange}
                onSearchInputKeyDown={handleKeyPress}
                onClickDelete={onSearchInputDelete}
                value={tagSearchInput}
                isActiveDeleteButton={tagSearchInput !== ''}
              />
            </SearchButtonInputWrap>
          </PostComposeSearchInputWrap>
        </HeaderLayout>
        {loading ? (
          <SearchLoadingWrap>
            <SearchLoadingGif src={loadingBarGif} />
          </SearchLoadingWrap>
        ) : (
          <TagSearchQueryContainer>
            {tagSearchQueryHashMap.get(tagSearchInput) &&
              tagSearchQueryHashMap.get(tagSearchInput)?.map((value, key) => (
                <TagSearchQueryItem
                  key={key}
                  // onClick={() => onClickTagSearchQuery(value)}
                >
                  {value}
                </TagSearchQueryItem>
              ))}
          </TagSearchQueryContainer>
        )}
        <ProfileMyFollowingListInfiniteScroll />
      </SearchButtonInputHeaderContainer>
      <SelectedTagListContainer ref={tagListRef}>
        {/* {tagList.map((value, key) => (
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
        ))} */}
      </SelectedTagListContainer>

      <AnotherSnsShareContainer>
        <AnotherSnsShareWrap>
          <a href={SMSShareButtonHref(window.location.href, '테스트')}>
            <AnotherSnsShareItem>
              <AnotherSnsShareIconWrap>
                <MessageShareButtonIcon />
              </AnotherSnsShareIconWrap>
              <AnotherSnsShareTitle>메시지</AnotherSnsShareTitle>
            </AnotherSnsShareItem>
          </a>
          <AnotherSnsShareItem>
            <AnotherSnsShareIconWrap>
              <KakaoShareButtonIcon />
            </AnotherSnsShareIconWrap>
            <AnotherSnsShareTitle>Kakao</AnotherSnsShareTitle>
          </AnotherSnsShareItem>
          <PinterestShareButton
            url={window.location.href}
            media={window.location.href}
          >
            <AnotherSnsShareItem>
              <AnotherSnsShareIconWrap>
                <PinterestShareButtonIcon />
              </AnotherSnsShareIconWrap>
              <AnotherSnsShareTitle>Pinterest</AnotherSnsShareTitle>
            </AnotherSnsShareItem>
          </PinterestShareButton>
          <FacebookShareButton url={window.location.href}>
            <AnotherSnsShareItem>
              <AnotherSnsShareIconWrap>
                <FacebookShareButtonIcon />
              </AnotherSnsShareIconWrap>
              <AnotherSnsShareTitle>Facebook</AnotherSnsShareTitle>
            </AnotherSnsShareItem>
          </FacebookShareButton>
          <TwitterShareButton url={window.location.href}>
            <AnotherSnsShareItem>
              <AnotherSnsShareIconWrap>
                <XShareButtonIcon />
              </AnotherSnsShareIconWrap>
              <AnotherSnsShareTitle>X</AnotherSnsShareTitle>
            </AnotherSnsShareItem>
          </TwitterShareButton>
          <AnotherSnsShareItem
            onClick={() => {
              handleShareUtil({
                url: window.location.href,
                text: '이것 좀 보세요! 👀',
              });
            }}
          >
            <AnotherSnsShareIconWrap>
              <ShareMoreButtonIcon />
            </AnotherSnsShareIconWrap>
            <AnotherSnsShareTitle>더 보기</AnotherSnsShareTitle>
          </AnotherSnsShareItem>
        </AnotherSnsShareWrap>
      </AnotherSnsShareContainer>
    </PopupLayout>
  );
};

const PopupWrapStyle: React.CSSProperties = {
  height: '85%',
};

const LoadingBarSize = '50px';

const SearchButtonInputHeaderContainer = styled.div`
  margin-top: 30px;
  flex: 1;
`;

const PostComposeSearchInputWrap = styled.div`
  width: 100%;
  display: flex;
  margin: auto 0;
`;

const SearchButtonInputWrap = styled.div`
  padding: 0 10px;
  width: 100%;
`;

const SearchLoadingWrap = styled.div`
  position: fixed;
  top: calc(30%);
  left: 50%;
  transform: translate(-50%, 50%);
`;

const SearchLoadingGif = styled.img`
  width: ${LoadingBarSize};
  height: ${LoadingBarSize};
`;

const TagSearchQueryContainer = styled.div`
  margin-top: calc(${({ theme }) => theme.systemSize.header.height});
  display: flex;
  flex-flow: column;
  gap: 20px;
`;

const TagSearchQueryItem = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
  padding-left: ${({ theme }) =>
    theme.systemSize.appDisplaySize.bothSidePadding};
`;

const SelectedTagListContainer = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  white-space: nowrap;
  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding}
    30px ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const AnotherSnsShareContainer = styled.div`
  display: flex;

  width: 100%;
  overflow-x: scroll;
`;

const AnotherSnsShareWrap = styled.div`
  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding}
    40px ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 20px;
`;

const AnotherSnsShareItem = styled.div`
  display: flex;
  flex-flow: column;
`;

const AnotherSnsShareIconWrap = styled.div`
  margin: 0 auto;
`;

const AnotherSnsShareTitle = styled.div`
  text-align: center;
  font: ${({ theme }) => theme.fontSizes.Location2};
  color: ${({ theme }) => theme.grey.Grey8};
`;

export default SnsSharePopup;
