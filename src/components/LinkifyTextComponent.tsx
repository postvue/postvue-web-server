import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
interface LinkifyTextProps {
  text: string;
}

const LinkifyTextComponent: React.FC<LinkifyTextProps> = ({ text }) => {
  const navigate = useNavigate();
  const linkify = (inputText: string): JSX.Element[] => {
    const urlPattern = new RegExp(
      '(https?:\\/\\/[^\\s]+)', // URL 패턴 수정
      'g',
    );
    return inputText.split(urlPattern).flatMap((part, index) => {
      // 빈 문자열은 필터링
      if (part === '') {
        return []; // 빈 문자열일 경우 빈 배열을 반환
      }
      // URL인 경우에는 <a> 태그로 변환
      if (urlPattern.test(part)) {
        return (
          <LinkedText
            key={index}
            onClick={(e) => {
              e.stopPropagation(); // 기본 링크 동작 방지

              try {
                const urlObj = new URL(part);

                if (urlObj.origin === location.origin) {
                  // 같은 도메인일 경우 navigate로 이동

                  const url = urlObj.pathname + urlObj.search + urlObj.hash;
                  navigate(url);
                } else {
                  // 다른 도메인일 경우 새 탭에서 열기
                  window.open(part, '_blank', 'width=800,height=600');
                }
              } catch (error) {
                console.error('유효하지 않은 URL입니다:', error);
              }
            }}
          >
            {part}
          </LinkedText>
        );
      }
      // 일반 텍스트인 경우에는 <span> 태그로 감싸서 반환
      return <span key={index}>{part}</span>;
    });
  };

  return <>{linkify(text)}</>;
};

const LinkedText = styled.div`
  color: ${({ theme }) => theme.grey.Grey5};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
`;

export default LinkifyTextComponent;
