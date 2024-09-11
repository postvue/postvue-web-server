import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { FOLLOW_MANAGE_SERACH_INPUT_PHASE_TEXT } from '../../const/SystemPhraseConst';

import MsgHiddenUserListInfiniteScroll from '../../hook/MsgHiddenUserListInfiniteScroll';

import { putUnhiddenUser } from '../../services/message/putUnhiddenUser';
import { msgHiddenUserHashMapAtom } from '../../states/MessageAtom';
import SearchButtonInput from '../common/input/SearchButtonInput';
const MsgHiddenListBody: React.FC = () => {
  const [msgHiddenUserHashMap, setMsgHiddenUserHashMap] = useRecoilState(
    msgHiddenUserHashMapAtom,
  );

  const [hiddenSearchInput, setHiddenSearchInput] = useState<string>('');

  const onClickUnhiddeningUser = (targetUserId: string) => {
    putUnhiddenUser(targetUserId).then((putUnhiddeningUser) => {
      const tempMsgHiddenUserHashMap = new Map(msgHiddenUserHashMap);
      tempMsgHiddenUserHashMap.delete(putUnhiddeningUser.targetUserId);
      setMsgHiddenUserHashMap(tempMsgHiddenUserHashMap);
    });
  };

  const onSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHiddenSearchInput(event.target.value);
  };

  const onSearchInputDelete = () => {
    setHiddenSearchInput('');
  };

  return (
    <MsgHiddenListBodyContainer>
      <MessageSearchContainer>
        <SearchButtonInput
          placeholder={FOLLOW_MANAGE_SERACH_INPUT_PHASE_TEXT}
          onSearchInputChange={onSearchInputChange}
          onClickDelete={onSearchInputDelete}
          value={hiddenSearchInput}
          isActiveDeleteButton={hiddenSearchInput !== ''}
        />
      </MessageSearchContainer>
      <MsgHiddenUserListContainer>
        {Array.from(msgHiddenUserHashMap).map(([key, value]) => {
          if (value.username.startsWith(hiddenSearchInput)) {
            return (
              <MsgHiddenUserWrap key={key}>
                <MsgHiddenUserInfoWrap>
                  <MsgHiddenUserProfileImg src={value.profilePath} />
                  <MsgHiddenUserName>{value.username}</MsgHiddenUserName>
                </MsgHiddenUserInfoWrap>
                <MsgHiddeningButtonWrap>
                  <MsgHiddeningButton
                    onClick={() => onClickUnhiddeningUser(value.targetUserId)}
                  >
                    해제
                  </MsgHiddeningButton>
                </MsgHiddeningButtonWrap>
              </MsgHiddenUserWrap>
            );
          }
        })}
      </MsgHiddenUserListContainer>
      <MsgHiddenUserListInfiniteScroll />
    </MsgHiddenListBodyContainer>
  );
};

const MsgHiddenListBodyContainer = styled.div`
  margin-top: ${({ theme }) => theme.systemSize.header.height};
`;

const MessageSearchContainer = styled.div`
  padding: 16px 15px 16px 15px;
`;

const MsgHiddenUserListContainer = styled.div`
  display: flex;
  flex-flow: column;
  gap: 10px;
`;

const MsgHiddenUserWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
`;

const MsgHiddenUserInfoWrap = styled.div`
  display: flex;
  gap: 11px;
`;

const MsgHiddenUserProfileImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 30px;
`;

const MsgHiddenUserName = styled.div`
  margin: auto 0;
  font: ${({ theme }) => theme.fontSizes.Subhead2};
`;

const MsgHiddeningButtonWrap = styled.div`
  margin: auto 0;
`;

const MsgHiddeningButton = styled.div`
  color: ${({ theme }) => theme.mainColor.Blue};
  font: ${({ theme }) => theme.fontSizes.Subhead2};
  cursor: pointer;
`;

export default MsgHiddenListBody;
