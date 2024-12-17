import LoadingComponent from 'components/common/container/LoadingComponent';
import { isValidString } from 'global/util/ValidUtil';
import React, { useEffect, useRef } from 'react';
import { SetterOrUpdater } from 'recoil';
import styled from 'styled-components';

interface TagSearchPopupBodyProps {
  tagSearchInput: string;
  setTagSearchInput: SetterOrUpdater<string>;
  loading: boolean;
  onClickTagSearchQuery: (searchQuery: string) => void;
  tagSearchQueryHashMap: Map<string, string[]>;
}

const TagSearchPopupBody: React.FC<TagSearchPopupBodyProps> = ({
  tagSearchInput,
  setTagSearchInput,
  loading,
  onClickTagSearchQuery,
  tagSearchQueryHashMap,
}) => {
  useEffect(() => {
    return () => {
      setTagSearchInput('');
    };
  }, []);

  const TagSearchContainerRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <TagSearchContainer ref={TagSearchContainerRef}>
        {loading ? (
          <LoadingComponent />
        ) : (
          <TagSearchQueryContainer>
            {isValidString(tagSearchInput) &&
              tagSearchQueryHashMap.get(tagSearchInput) &&
              tagSearchQueryHashMap.get(tagSearchInput)?.map((value, key) => (
                <TagSearchQueryItem
                  key={key}
                  onClick={() => {
                    onClickTagSearchQuery(value);
                  }}
                >
                  <TagSearchQueryName>{value}</TagSearchQueryName>
                  <TagSearchQueryAdd>추가</TagSearchQueryAdd>
                </TagSearchQueryItem>
              ))}
            {isValidString(tagSearchInput) &&
              (tagSearchQueryHashMap.get(tagSearchInput)?.length || 0) <= 0 && (
                <TagSearchQueryItem
                  onClick={() => {
                    onClickTagSearchQuery(tagSearchInput);
                  }}
                >
                  <TagSearchQueryName>{tagSearchInput}</TagSearchQueryName>
                  <TagSearchQueryAdd>추가</TagSearchQueryAdd>
                </TagSearchQueryItem>
              )}
          </TagSearchQueryContainer>
        )}
      </TagSearchContainer>
    </>
  );
};

const TagSearchContainer = styled.div`
  flex: 1;
`;

const TagSearchQueryContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-flow: column;
  gap: 20px;
`;

const TagSearchQueryItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const TagSearchQueryName = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
`;

const TagSearchQueryAdd = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  color: ${({ theme }) => theme.grey.Grey7};
`;

export default TagSearchPopupBody;
