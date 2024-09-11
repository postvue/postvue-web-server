import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { FOLLOW_MANAGE_SERACH_INPUT_PHASE_TEXT } from '../../const/SystemPhraseConst';
import MsgBlockUserListInfiniteScroll from '../../hook/MsgBlockUserListInfiniteScroll';
import { putUnblockingUser } from '../../services/message/putUnblockingUser';
import { msgBlockUserHashMapAtom } from '../../states/MessageAtom';
import SearchButtonInput from '../common/input/SearchButtonInput';
const MsgBlockListBody: React.FC = () => {
  const [msgBlockUserHashMap, setMsgBlockUserHashMap] = useRecoilState(
    msgBlockUserHashMapAtom,
  );

  const [blockSearchInput, setBlockSearchInput] = useState<string>('');

  const onClickUnblockingUser = (targetUserId: string) => {
    putUnblockingUser(targetUserId).then((putUnblockingUser) => {
      const tempMsgBlockUserHashMap = new Map(msgBlockUserHashMap);
      tempMsgBlockUserHashMap.delete(putUnblockingUser.targetUserId);
      setMsgBlockUserHashMap(tempMsgBlockUserHashMap);
    });
  };

  const onSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBlockSearchInput(event.target.value);
  };

  const onSearchInputDelete = () => {
    setBlockSearchInput('');
  };

  return (
    <MsgBlockListBodyContainer>
      <MessageSearchContainer>
        <SearchButtonInput
          placeholder={FOLLOW_MANAGE_SERACH_INPUT_PHASE_TEXT}
          onSearchInputChange={onSearchInputChange}
          onClickDelete={onSearchInputDelete}
          value={blockSearchInput}
          isActiveDeleteButton={blockSearchInput !== ''}
        />
      </MessageSearchContainer>
      <MsgBlockUserListContainer>
        {Array.from(msgBlockUserHashMap).map(([key, value]) => {
          if (value.username.startsWith(blockSearchInput)) {
            return (
              <MsgBlockUserWrap key={key}>
                <MsgBlockUserInfoWrap>
                  <MsgBlockUserProfileImg src={value.profilePath} />
                  <MsgBlockUserName>{value.username}</MsgBlockUserName>
                </MsgBlockUserInfoWrap>
                <MsgBlockingButtonWrap>
                  <MsgBlockingButton
                    onClick={() => onClickUnblockingUser(value.targetUserId)}
                  >
                    해제
                  </MsgBlockingButton>
                </MsgBlockingButtonWrap>
              </MsgBlockUserWrap>
            );
          }
        })}
      </MsgBlockUserListContainer>
      <MsgBlockUserListInfiniteScroll />
    </MsgBlockListBodyContainer>
  );
};

const MsgBlockListBodyContainer = styled.div`
  margin-top: ${({ theme }) => theme.systemSize.header.height};
`;

const MessageSearchContainer = styled.div`
  padding: 16px 15px 16px 15px;
`;

const MsgBlockUserListContainer = styled.div`
  display: flex;
  flex-flow: column;
  gap: 10px;
`;

const MsgBlockUserWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
`;

const MsgBlockUserInfoWrap = styled.div`
  display: flex;
  gap: 11px;
`;

const MsgBlockUserProfileImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 30px;
`;

const MsgBlockUserName = styled.div`
  margin: auto 0;
  font: ${({ theme }) => theme.fontSizes.Subhead2};
`;

const MsgBlockingButtonWrap = styled.div`
  margin: auto 0;
`;

const MsgBlockingButton = styled.div`
  color: ${({ theme }) => theme.mainColor.Blue};
  font: ${({ theme }) => theme.fontSizes.Subhead2};
  cursor: pointer;
`;

export default MsgBlockListBody;
