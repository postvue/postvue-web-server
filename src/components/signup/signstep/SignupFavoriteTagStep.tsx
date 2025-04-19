import { ReactComponent as ScrapSelectIcon } from 'assets/images/icon/svg/scrap/ScrapSelectIcon.svg';
import { ACTIVE_CLASS_NAME } from 'const/ClassNameConst';
import { SIGNUP_FAVORITE_TAG_MAX_NUM } from 'const/SignupConst';
import { sendVibrationLightEvent } from 'global/util/reactnative/nativeRouter';
import { isValidString } from 'global/util/ValidUtil';
import { QueryStateRecommFavoriteTagList } from 'hook/queryhook/QueryStateRecommFavoriteTagList';
import RecommFavoriteTagListInfiniteScroll from 'hook/RecommFavoriteTagListInfiniteScroll';
import React, { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useRecoilState } from 'recoil';
import { signupInfoAtom } from 'states/SignupAtom';
import { tagSearchInputAtom } from 'states/TagAtom';
import styled from 'styled-components';
import theme from 'styles/theme';
import SignupHeader from '../SignupHeader';
import SignupNextButton from '../SignupNextButton';

const SignupFavoriteTagStep: React.FC = () => {
  const [signupInfo, setSignupInfo] = useRecoilState(signupInfoAtom);

  const [tagSearchInput, setTagSearchInput] =
    useRecoilState(tagSearchInputAtom);

  const [isActive, setIsActive] = useState<boolean>(false);

  const { data, isLoading } = QueryStateRecommFavoriteTagList();

  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);

  const hasClass = (ref: HTMLDivElement, className: string): boolean => {
    return ref?.classList.contains(className) || false;
  };

  const handleElementAction = (ref: HTMLDivElement, tagId: string) => {
    const isActive = hasClass(ref, ACTIVE_CLASS_NAME);
    // const borderStyle = `${theme.mainColor.White} 0px 0px 0px 0px, ${theme.mainColor.Blue} 0px 0px 0px 2px`; // border style example, modify as needed
    if (isActive) {
      ref.classList.remove(ACTIVE_CLASS_NAME);
      // ref.style.boxShadow = '';
      setSignupInfo((prev) => ({
        ...prev,
        favoriteTagList: prev.favoriteTagList.filter(
          (value) => value !== tagId,
        ),
      }));
    } else {
      if (signupInfo.favoriteTagList.length >= SIGNUP_FAVORITE_TAG_MAX_NUM)
        return;

      sendVibrationLightEvent();
      ref.classList.add(ACTIVE_CLASS_NAME);
      // ref.style.boxShadow = borderStyle;

      setSignupInfo((prev) => ({
        ...prev,
        favoriteTagList: [...prev.favoriteTagList, tagId],
      }));
    }
  };

  const actionFuncByRef = (ref: HTMLDivElement, tagId: string) => {
    handleElementAction(ref, tagId);
  };

  useEffect(() => {
    if (signupInfo.favoriteTagList.length < SIGNUP_FAVORITE_TAG_MAX_NUM) {
      setIsActive(false);
    } else {
      setIsActive(true);
    }
  }, [signupInfo.favoriteTagList]);

  const [init, setInit] = useState<boolean>(false);
  useEffect(() => {
    setSignupInfo((prev) => ({ ...prev, favoriteTagList: [] }));
    setTimeout(() => {
      setInit(true);
    }, 1000);
  }, []);

  const _MOCK_LIST = Array(30).fill(0);

  return (
    <>
      <SignupHeader />
      <SignupStepTitleWrap>
        <SignupStepTitle>
          관심 태그를 {SIGNUP_FAVORITE_TAG_MAX_NUM}개 선택해보세요.
        </SignupStepTitle>
        <SignupStepSubTitle></SignupStepSubTitle>
      </SignupStepTitleWrap>

      <FavoriteTagSuggestItemListContainer>
        {!isValidString(tagSearchInput) ? (
          <>
            <FavoriteTagSuggestItemListWrap>
              {init && data && !isLoading ? (
                <>
                  {data?.pages
                    .flatMap((v) => v)
                    .map((v, index) => {
                      return (
                        <TagElementContainer
                          key={index}
                          ref={(el) => (tagRefs.current[index] = el)}
                          onClick={() => {
                            const tagRef = tagRefs.current[index];
                            if (tagRef) {
                              actionFuncByRef(tagRef, v.tagId);
                            }
                          }}
                        >
                          <TagElementWrap $tagBkgdPath={v.tagBkgdContent}>
                            <TagNameDiv>#{v.tagName}</TagNameDiv>
                          </TagElementWrap>
                          {signupInfo.favoriteTagList.includes(v.tagId) && (
                            <ActiveSelecteScrapdWrap>
                              <ActiveSelecteScrapIconWrap>
                                <ScrapSelectIcon />
                              </ActiveSelecteScrapIconWrap>
                            </ActiveSelecteScrapdWrap>
                          )}
                        </TagElementContainer>
                      );
                    })}
                </>
              ) : (
                <>
                  {_MOCK_LIST.map((v, index) => {
                    return (
                      <TagElementContainer key={index}>
                        <Skeleton
                          style={{
                            borderRadius: BORDER_RADIUS_NUM,
                            aspectRatio: ASPECT_RATIO,
                          }}
                        />
                      </TagElementContainer>
                    );
                  })}
                </>
              )}
            </FavoriteTagSuggestItemListWrap>

            <RecommFavoriteTagListInfiniteScroll />
          </>
        ) : (
          <>
            {/* {tagSearchQueryHashMap.get(tagSearchInput) &&
              tagSearchQueryHashMap.get(tagSearchInput)?.map((value, key) => (
                <TagElementContainer key={key}>
                  <TagElementWrap $tagBkgdPath={value}>
                    <TagNameDiv>#{v.tagName}</TagNameDiv>
                  </TagElementWrap>
                </TagElementContainer>
              ))} */}
          </>
        )}
      </FavoriteTagSuggestItemListContainer>

      <SignupNextButton isActive={isActive} />
    </>
  );
};

const BORDER_RADIUS_NUM = 20;
const ASPECT_RATIO = '2/1';

const SignupStepTitleWrap = styled.div`
  padding: 20px 0px 10px 0px;
`;

const SignupStepTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Headline3};
  text-align: center;
  margin-bottom: 10px;
`;

const SignupStepSubTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  text-align: center;
`;

const FavoriteTagSuggestItemListContainer = styled.div`
  padding-bottom: 20px;
  overflow: auto;
  flex: 1;
`;

const FavoriteTagSuggestItemListWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 10px ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding}
    0px ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const TagElementContainer = styled.div`
  cursor: pointer;
  position: relative;
  border-radius: ${BORDER_RADIUS_NUM}px;
`;

const TagElementWrap = styled.div<{ $tagBkgdPath: string }>`
  color: white;
  aspect-ratio: ${ASPECT_RATIO};
  border-radius: ${BORDER_RADIUS_NUM}px;
  text-align: center;

  font: ${({ theme }) => theme.fontSizes.Subhead2};

  margin: 0 auto;

  display: flex;

  ${(props) =>
    props.$tagBkgdPath
      ? `background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${props.$tagBkgdPath}) center center / cover;`
      : `background-color: ${theme.grey.Grey7};`};
`;

const TagNameDiv = styled.div`
  display: flex;
  margin: auto;
`;

const ActiveSelecteScrapdWrap = styled.div`
  display: flex;
  animation: 0.4s cubic-bezier(0.4, 0, 0, 1.5) 0s 1 normal scale-and-fadein;
  position: absolute;
  bottom: 0px;
  right: 0px;
  padding: 5px;
`;

const ActiveSelecteScrapIconWrap = styled.div`
  margin: auto 0px;
`;

export default SignupFavoriteTagStep;
