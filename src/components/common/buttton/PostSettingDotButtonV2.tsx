import { ReactComponent as SettingHorizontalDotIcon } from 'assets/images/icon/svg/SettingHorizontalDotIcon.svg';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import { PostRsp } from 'global/interface/post';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import { activePostDotSettingInfoAtom } from 'states/PostAtom';
import styled from 'styled-components';
import { hoverRoundCoverStyle } from 'styles/commonStyles';

interface PostSettingDotButtonProps {
  selectPostRsp: PostRsp;
  scrapId?: string;
  PostSettingDotButtonStyle?: React.CSSProperties;
}

const PostSettingDotButtonV2: React.FC<PostSettingDotButtonProps> = ({
  selectPostRsp,
  scrapId,
  PostSettingDotButtonStyle,
}) => {
  const setActivePostDotSettingInfo = useSetRecoilState(
    activePostDotSettingInfoAtom,
  );

  return (
    <PostSettingDotButtonContainer style={PostSettingDotButtonStyle}>
      <PostSettingDotButtonWrap
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setActivePostDotSettingInfo({
            isActive: true,
            selectedPost: selectPostRsp,
            deletePostByScrapId: scrapId,
          });
        }}
      >
        <PostSettingDotButtonSubWrap>
          <SettingHorizontalDotIcon />
        </PostSettingDotButtonSubWrap>
      </PostSettingDotButtonWrap>
    </PostSettingDotButtonContainer>
  );
};

const PostSettingDotButtonContainer = styled.div`
  flex-shrink: 1;
  width: 100%;
`;

const PostSettingDotButtonWrap = styled.div`
  display: flex;
  justify-content: end;
  margin: auto 0px;
  cursor: pointer;
  position: relative;
`;

const PostSettingDotButtonSubWrap = styled.div`
  display: flex;
  &::before {
    content: '';
    position: absolute;
    top: -15px;
    bottom: -15px;
    left: -15px;
    right: 0px;
    z-index: -1; /* 가상 요소를 버튼 뒤로 배치 */
    background: transparent; /* 투명 */
  }
  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    ${hoverRoundCoverStyle}
  }
`;

export default PostSettingDotButtonV2;
