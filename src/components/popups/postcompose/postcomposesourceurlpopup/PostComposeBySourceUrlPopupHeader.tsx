import { ReactComponent as XButtonIcon } from 'assets/images/icon/svg/XButtonIcon.svg';
import SearchButtonInput from 'components/common/input/SearchButtonInput';
import HeaderLayout from 'components/layouts/HeaderLayout';
import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import { POST_COMPOSEUPLOAD_MAX_NUM } from 'const/PostComposeConst';
import { POST_IMAGE_TYPE } from 'const/PostContentTypeConst';
import { MAX_DELAY_SETTIMEOUT_TIME } from 'const/SystemAttrConst';
import { POST_COMPOSE_LINK_INPUT_PHASE_TEXT } from 'const/SystemPhraseConst';
import { isValidString } from 'global/util/ValidUtil';
import { QueryStatePostResourceDocImageList } from 'hook/queryhook/QueryStatePostResourceDocImageList';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  postComposeBySourceUrlListAtom,
  uploadResourceListAtom,
} from 'states/PostComposeAtom';
import styled from 'styled-components';

interface PostComposeBySourceUrlPopupHeaderProps {
  HeaderStyle?: React.CSSProperties;
  funcPrevButton: () => void;
  postComposeSearchInput: string;
  setPostComposeSearchInput: React.Dispatch<React.SetStateAction<string>>;
}

const PostComposeBySourceUrlPopupHeader: React.FC<
  PostComposeBySourceUrlPopupHeaderProps
> = ({
  HeaderStyle,
  postComposeSearchInput,
  setPostComposeSearchInput,
  funcPrevButton,
}) => {
  const searchInputRef: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);

  const [isFetching, setFetching] = useState<boolean>(false);

  const { data, isSuccess } = QueryStatePostResourceDocImageList(
    postComposeSearchInput,
    isFetching,
  );

  const setPostComposeBySourceUrlList = useSetRecoilState(
    postComposeBySourceUrlListAtom,
  );

  const [uploadResourceList, setUploadResourceList] = useRecoilState(
    uploadResourceListAtom,
  );

  const onSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPostComposeSearchInput(event.target.value);
  };

  const onSearchInputDelete = () => {
    setPostComposeSearchInput('');
    setPostComposeBySourceUrlList([]);
    setUploadResourceList([]);
  };

  const isImageUrl = (url: string) => {
    const imageExtensions = [
      'jpg',
      'jpeg',
      'png',
      'gif',
      'bmp',
      'tiff',
      'webp',
      'svg',
      'ico',
    ];
    const extension =
      url.split('.').pop()?.split('?')[0].toLowerCase() || 'none';
    return imageExtensions.includes(extension);
  };

  const isValidImageUrl = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });

      const contentType = response.headers.get('Content-Type');

      return contentType?.startsWith('image/') || false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      event.key === 'Enter' &&
      event.nativeEvent.isComposing === false &&
      isValidString(postComposeSearchInput) &&
      !isFetching
    ) {
      setUploadResourceList([]);

      const validImage =
        isImageUrl(postComposeSearchInput) ||
        (await isValidImageUrl(postComposeSearchInput));

      if (validImage) {
        setPostComposeBySourceUrlList([
          {
            contentType: POST_IMAGE_TYPE,
            contentUrl: postComposeSearchInput,
          },
        ]);
      } else {
        setFetching(true);

        setTimeout(() => {
          setFetching(false);
        }, MAX_DELAY_SETTIMEOUT_TIME);
      }
      searchInputRef.current?.blur();
    }
  };

  useEffect(() => {
    return () => {
      setPostComposeBySourceUrlList([]);
    };
  }, []);

  useEffect(() => {
    if (!data) return;

    setPostComposeBySourceUrlList(data);
    setFetching(false);
  }, [data]);

  useEffect(() => {
    if (!isSuccess) {
      setPostComposeBySourceUrlList([]);
    }
  }, [isSuccess]);

  return (
    <div
      style={{
        ...{ width: '100%' },
        ...HeaderStyle,
      }}
    >
      <PrevButtonHeaderHeader
        titleName="이미지 고르기"
        isActionFunc={true}
        actionFunc={funcPrevButton}
        preNodeByState={<XButtonIcon />}
        HeaderLayoutStyle={{
          backgroundColor: 'transparent',
          position: 'static',
          zIndex: 100,
        }}
        isInsetTopMatin={false}
        RightButtonNode={
          <PostComposeUploadNumWrap>
            {uploadResourceList.length}/{POST_COMPOSEUPLOAD_MAX_NUM}
          </PostComposeUploadNumWrap>
        }
      />
      <HeaderLayout
        HeaderLayoutStyle={{ position: 'static', maxWidth: '' }}
        isInsetTopMatin={false}
      >
        <PostComposeSearchInputWrap>
          <SearchButtonInputWrap>
            <SearchButtonInput
              searchInputRef={searchInputRef}
              placeholder={POST_COMPOSE_LINK_INPUT_PHASE_TEXT}
              onSearchInputChange={onSearchInputChange}
              onSearchInputKeyDown={handleKeyPress}
              onClickDelete={onSearchInputDelete}
              value={postComposeSearchInput}
              isActiveDeleteButton={postComposeSearchInput !== ''}
            />
          </SearchButtonInputWrap>
        </PostComposeSearchInputWrap>
      </HeaderLayout>
    </div>
  );
};

const PostComposeSearchInputWrap = styled.div`
  width: 100%;
  display: flex;
  margin: auto 0;
`;

const SearchButtonInputWrap = styled.div`
  padding: 0 10px;
  width: 100%;
`;

const PostComposeUploadNumWrap = styled.div`
  display: flex;
  margin: auto 0px;
  font: ${({ theme }) => theme.fontSizes.Body2};
`;

export default PostComposeBySourceUrlPopupHeader;
