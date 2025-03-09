import { ReactComponent as LocationSmallIcon } from 'assets/images/icon/svg/LocationSmallIcon.svg';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import { Location } from 'global/interface/post';
import React from 'react';
import styled from 'styled-components';

interface PostElementLocationProps {
  location: Location;
  ContentBorderRadius: number;
}

const PostElementLocation: React.FC<PostElementLocationProps> = ({
  location,
  ContentBorderRadius,
}) => {
  return (
    <PostAddressWrap $ContentBorderRadius={ContentBorderRadius}>
      <PostAddressSubWrap>
        <LocationSmallIconWrap>
          <LocationSmallIcon />
        </LocationSmallIconWrap>
        <PostAddress>
          {location.buildName ? location.buildName : location.address}
        </PostAddress>
      </PostAddressSubWrap>
    </PostAddressWrap>
  );
};

const PostAddressWrap = styled.div<{ $ContentBorderRadius: number }>`
  position: absolute;
  bottom: 0px;
  width: 100%;
  z-index: 110;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent);
  border-radius: 0 0 ${(props) => props.$ContentBorderRadius}px
    ${(props) => props.$ContentBorderRadius}px;
`;

const PostAddressSubWrap = styled.div`
  display: flex;
  gap: 2px;
  padding: 0 0 9px 8px;
`;

const PostAddress = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    font: ${({ theme }) => theme.fontSizes.Body3};
  }
  color: ${({ theme }) => theme.mainColor.White};

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LocationSmallIconWrap = styled.div`
  display: flex;
  margin: auto 0px;
`;

export default PostElementLocation;
