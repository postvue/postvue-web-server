import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { SEARCH_PATH, TAG_SEARCH_PATH } from '../../../const/PathConst';
import { SearchRecentKeywordInterface } from '../../../global/interface/localstorage/SearchInterface';
import {
  deleteRecentlyKeyword,
  getRecentSearchWordList,
} from '../../../global/util/SearchUtil';

const SearchBody: React.FC = () => {
  const tag_name_list = [
    '태그명',
    '태그명',
    '태그명',
    '태그명',
    '태그명',
    '태그명',
  ];
  const navigate = useNavigate();

  const [recentSearchWordList, setRecentSearchWordList] = useState<
    SearchRecentKeywordInterface[]
  >([]);

  const onClickDeleteSearchWord = (searchWord: string) => {
    const deletedSearchRecentSearchWordList: SearchRecentKeywordInterface[] =
      deleteRecentlyKeyword(searchWord);

    setRecentSearchWordList(deletedSearchRecentSearchWordList);
  };

  useEffect(() => {
    setRecentSearchWordList(getRecentSearchWordList());
    return () => {
      setRecentSearchWordList([]);
    };
  }, []);

  return (
    <>
      <TagRecommContainer>
        <SearchRecentWordContainer>
          {recentSearchWordList.length > 0 && (
            <>
              <SearchRelatedTitle>최근 검색어</SearchRelatedTitle>
              <RecentSearchWordContainer>
                {recentSearchWordList &&
                  recentSearchWordList
                    .slice(0)
                    .reverse()
                    .map((v, i) => (
                      <RecentSearchWordItemWrap key={i}>
                        <RecenSearchWordItemDeletedWrap>
                          <RecentSearchWordItem
                            onClick={() => {
                              navigate(`${SEARCH_PATH}/${v.name}`);
                            }}
                          >
                            {v.name}
                          </RecentSearchWordItem>
                          <RecentDeleteButtonWrap
                            onClick={() => onClickDeleteSearchWord(v.name)}
                          >
                            <RecentSearchWordDeleteButton
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <g clipPath="url(#clip0_193_2900)">
                                <path
                                  d="M3.99997 4.00003L11.9999 12M3.99997 12L11.9999 4.00003"
                                  stroke="#9199A1"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_193_2900">
                                  <rect width="16" height="16" fill="white" />
                                </clipPath>
                              </defs>
                            </RecentSearchWordDeleteButton>
                          </RecentDeleteButtonWrap>
                        </RecenSearchWordItemDeletedWrap>
                      </RecentSearchWordItemWrap>
                    ))}
              </RecentSearchWordContainer>
            </>
          )}
        </SearchRecentWordContainer>

        <SearchTagRecommContainer>
          <SearchRelatedTitle>추천 태그</SearchRelatedTitle>
          <TagListContainer>
            <TagListContainerWrap>
              {tag_name_list &&
                tag_name_list.map((v, i) => (
                  <TagElementContainer key={i}>
                    <Link to={`${TAG_SEARCH_PATH}/${v}`}>
                      <TagElementWrap>
                        <TagNameDiv>{v}</TagNameDiv>
                      </TagElementWrap>
                    </Link>
                  </TagElementContainer>
                ))}
            </TagListContainerWrap>
          </TagListContainer>
        </SearchTagRecommContainer>
      </TagRecommContainer>
    </>
  );
};

const SearchTagRecommContainer = styled.div``;

const TagRecommContainer = styled.div`
  margin: 40px 10px 0 10px;
`;

const SearchRelatedTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Headline1};
  padding-bottom: 12px;
`;

const TagListContainer = styled.div``;
const TagListContainerWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  gap: 10px;
`;

const TagElementContainer = styled.div`
  cursor: pointer;
`;

const TagElementWrap = styled.div`
  text-align: center;

  background-color: ${({ theme }) => theme.grey.Grey7};
  font: ${({ theme }) => theme.fontSizes.Subhead2};

  padding-top: 30px;
  padding-bottom: 30px;
  border-radius: 8px;
  margin: 0 auto;
  color: white;
`;

const TagNameDiv = styled.div``;

const SearchRecentWordContainer = styled.div`
  margin-bottom: 40px;
`;

const RecentSearchWordContainer = styled.div`
  display: flex;
  gap: 7px;
`;

const RecentSearchWordItemWrap = styled.div`
  border-radius: 14px;
  border: 1px solid var(--Grey1, #f2f3f4);
  background: #fff;
  padding: 4px 9px;
`;

const RecenSearchWordItemDeletedWrap = styled.div`
  display: flex;
  gap: 4px;
`;

const RecentSearchWordItem = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  cursor: pointer;
`;

const RecentDeleteButtonWrap = styled.div`
  display: flex;
  cursor: pointer;
`;

const RecentSearchWordDeleteButton = styled.svg`
  margin: auto 0;
`;

export default SearchBody;
