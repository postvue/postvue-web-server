import { ACTIVE_CLASS_NAME } from 'const/ClassNameConst';
import { SIGNUP_FAVORITE_TAG_MAX_NUM } from 'const/SignupConst';
import { isValidString } from 'global/util/ValidUtil';
import { QueryStateRecommFavoriteTagList } from 'hook/queryhook/QueryStateRecommFavoriteTagList';
import RecommFavoriteTagListInfiniteScroll from 'hook/RecommFavoriteTagListInfiniteScroll';
import React, { useEffect, useRef, useState } from 'react';
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
    const borderStyle = `${theme.mainColor.White} 0px 0px 0px 0px, ${theme.mainColor.Blue} 0px 0px 0px 3px`; // border style example, modify as needed
    if (isActive) {
      ref.classList.remove(ACTIVE_CLASS_NAME);
      ref.style.boxShadow = '';
      setSignupInfo((prev) => ({
        ...prev,
        favoriteTagList: prev.favoriteTagList.filter(
          (value) => value !== tagId,
        ),
      }));
    } else {
      if (signupInfo.favoriteTagList.length >= SIGNUP_FAVORITE_TAG_MAX_NUM)
        return;
      ref.classList.add(ACTIVE_CLASS_NAME);
      ref.style.boxShadow = borderStyle;

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

  useEffect(() => {
    setSignupInfo((prev) => ({ ...prev, favoriteTagList: [] }));
  }, []);

  return (
    <>
      <SignupHeader />
      <SignupStepTitleWrap>
        <SignupStepTitle>관심 태그를 5개 선택해보세요.</SignupStepTitle>
        <SignupStepSubTitle></SignupStepSubTitle>
      </SignupStepTitleWrap>

      <FavoriteTagSuggestItemListContainer>
        {!isValidString(tagSearchInput) ? (
          <>
            <FavoriteTagSuggestItemListWrap>
              {data &&
                !isLoading &&
                data?.pages.flatMap((value, pageIndex) =>
                  value.map((v, index) => {
                    const refIndex = pageIndex * value.length + index;

                    return (
                      <TagElementContainer
                        key={refIndex}
                        ref={(el) => (tagRefs.current[refIndex] = el)}
                        onClick={() => {
                          const tagRef = tagRefs.current[refIndex];
                          if (tagRef) {
                            actionFuncByRef(tagRef, v.tagId);
                          }
                        }}
                      >
                        <TagElementWrap $tagBkgdPath={v.tagBkgdContent}>
                          <TagNameDiv>
                            #{v.tagName} {refIndex}
                          </TagNameDiv>
                        </TagElementWrap>
                      </TagElementContainer>
                    );
                  }),
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

const SignupStepTitleWrap = styled.div`
  padding: 30px 0px 30px 0px;
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
`;

const FavoriteTagSuggestItemListWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const TagElementContainer = styled.div`
  cursor: pointer;
  border-radius: 8px;
`;

const TagElementWrap = styled.div<{ $tagBkgdPath: string }>`
  border-radius: 8px;
  text-align: center;

  font: ${({ theme }) => theme.fontSizes.Subhead2};
  padding: 39px 0px;

  margin: 0 auto;
  color: white;

  ${(props) =>
    props.$tagBkgdPath
      ? `background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${props.$tagBkgdPath}) center center / cover;`
      : `background-color: ${theme.grey.Grey7};`};
`;

const TagNameDiv = styled.div``;

const SearchButtonInputWrap = styled.div`
  padding: 0 10px;
`;

const MasonryLayoutWrap = styled.div<{ $isActive: boolean }>`
  padding-top: 10px;
  opacity: ${(props) => (props.$isActive ? 1 : 0.5)};
`;

export default SignupFavoriteTagStep;
