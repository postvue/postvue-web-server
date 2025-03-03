import BottomNextButton from 'components/common/buttton/BottomNextButton';
import BoundaryStickBar from 'components/common/container/BoundaryStickBar';
import ProfileScrapTargetAudiencePopup from 'components/popups/ProfileScrapTargetAudiencePopup';
import React, { useEffect } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import styled from 'styled-components';
import theme from 'styles/theme';
import { MAKE_NEW_SCRAP_INPUT_PHASE_TEXT } from '../../const/SystemPhraseConst';
import {
  isActiveProfileScarpTargetAudPopupAtom,
  scrapTargetAudienceAtom,
} from '../../states/ProfileAtom';

interface ProfileComposeScrapBodyProps {
  isActive: boolean;
  actionFunc: () => void;
  buttonTitle: string;
  postId?: string;
  postContentUrl?: string;
  postContentType?: string;
  scrapName: string;
  setScrapName: React.Dispatch<React.SetStateAction<string>>;
}

const ProfileComposeScrapBody: React.FC<ProfileComposeScrapBodyProps> = ({
  isActive,
  buttonTitle,
  actionFunc,
  postId,
  postContentUrl,
  postContentType,
  scrapName,
  setScrapName,
}) => {
  const [scrapTargetAudience, setScrapTargetAudience] = useRecoilState(
    scrapTargetAudienceAtom,
  );
  const resetScrapTargetAudience = useResetRecoilState(scrapTargetAudienceAtom);

  const [
    isActiveProfileScarpTargetAudPopup,
    setIsActiveProfileScarpTargetAudPopup,
  ] = useRecoilState(isActiveProfileScarpTargetAudPopupAtom);

  useEffect(() => {
    return () => {
      resetScrapTargetAudience();
      setIsActiveProfileScarpTargetAudPopup(false);
    };
  }, []);

  const onHandleScrapName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScrapName(e.target.value);
  };

  return (
    <>
      <ProfileMakeScrapBodyContainer>
        <div style={{ paddingTop: `env(safe-area-inset-top)` }} />
        {postId && postContentUrl && (
          <TogetherPostWrap>
            <TogetherPostImg src={postContentUrl} />
          </TogetherPostWrap>
        )}
        <ProfileScrapNameWrap>
          <ProfileScrapNameNameDiv>스크랩 명</ProfileScrapNameNameDiv>
          <ProfileScrapNameWriteInput
            placeholder={MAKE_NEW_SCRAP_INPUT_PHASE_TEXT}
            value={scrapName}
            onChange={(e) => {
              onHandleScrapName(e);
            }}
          />
        </ProfileScrapNameWrap>
        <BoundaryStickBar />
        <TargetAudienceWrap>
          <TargetAudienceName>스크랩 공개 대상</TargetAudienceName>
          <TargetAudienceButtonWrap
            onClick={() => setIsActiveProfileScarpTargetAudPopup(true)}
          >
            <TargetAudienceButton>
              {scrapTargetAudience.displayPhrase}
            </TargetAudienceButton>
            <TargetAudienceIcon
              xmlns="http://www.w3.org/2000/svg"
              width="7"
              height="14"
              viewBox="0 0 7 14"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.233236 13.7953C0.490958 14.0682 0.907769 14.0682 1.16486 13.7953L6.61394 8.01075C6.73592 7.88325 6.83304 7.72978 6.89941 7.55969C6.96578 7.3896 7 7.20645 7 7.02135C7 6.83626 6.96578 6.6531 6.89941 6.48301C6.83304 6.31292 6.73592 6.15946 6.61394 6.03195L1.1254 0.204746C1.00084 0.0745156 0.835881 0.00131767 0.664032 1.76173e-05C0.492182 -0.00128244 0.326326 0.0694129 0.200145 0.197746C0.137637 0.261121 0.087623 0.337936 0.0531991 0.423435C0.0187752 0.508934 0.000674706 0.601296 1.85053e-05 0.694801C-0.000637695 0.788307 0.0161644 0.880965 0.0493842 0.967039C0.0826041 1.05311 0.131534 1.13077 0.193145 1.1952L5.21651 6.52683C5.27755 6.59059 5.32615 6.66734 5.35937 6.75242C5.39258 6.83749 5.40971 6.92911 5.40971 7.0217C5.40971 7.11429 5.39258 7.20591 5.35937 7.29099C5.32615 7.37607 5.27755 7.45282 5.21651 7.51658L0.233236 12.8062C0.172216 12.8699 0.123623 12.9466 0.0904164 13.0316C0.05721 13.1166 0.0400853 13.2082 0.0400853 13.3007C0.0400853 13.3933 0.05721 13.4848 0.0904164 13.5699C0.123623 13.6549 0.172216 13.7316 0.233236 13.7953Z"
                fill="black"
              />
            </TargetAudienceIcon>
          </TargetAudienceButtonWrap>
        </TargetAudienceWrap>

        <BottomNextButton
          isActive={isActive}
          actionFunc={actionFunc}
          title={buttonTitle}
          notActiveTitle={buttonTitle}
        />
      </ProfileMakeScrapBodyContainer>

      {isActiveProfileScarpTargetAudPopup && (
        <ProfileScrapTargetAudiencePopup
          targetAudValue={scrapTargetAudience}
          setTargetAudValue={setScrapTargetAudience}
        />
      )}
    </>
  );
};

const ProfileMakeScrapBodyContainer = styled.div`
  height: calc(100dvh - ${theme.systemSize.header.heightNumber}px);
  position: relative;
`;

const TogetherPostWrap = styled.div`
  flex: 0 0 auto;
`;

const TogetherPostImg = styled.div<{ src: string }>`
  width: 30%;
  vertical-align: bottom;
  aspect-ratio: 3/4;
  background: url(${(props) => props.src}) center center / cover;
  border-radius: 8px;
  margin: 14px;
`;

const ProfileScrapNameWrap = styled.div`
  padding: 14px 21px 36px 21px;
`;

const ProfileScrapNameNameDiv = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
  padding-bottom: 4px;
`;

const ProfileScrapNameWriteInput = styled.input`
  outline: none;
  border: 0;
  width: 100%;
  font: ${({ theme }) => theme.fontSizes.Headline1};

  &::placeholder {
    color: ${({ theme }) => theme.grey.Grey4};
  }
  padding: 0;
`;

const TargetAudienceWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 11px 21px;
`;

const TargetAudienceName = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
`;

const TargetAudienceButtonWrap = styled.div`
  display: flex;
  gap: 12px;
  cursor: pointer;
`;

const TargetAudienceButton = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  margin: auto 0px;
`;

const TargetAudienceIcon = styled.svg`
  margin: auto 0px;
`;

export default ProfileComposeScrapBody;
