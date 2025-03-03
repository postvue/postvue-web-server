import React from 'react';
import styled from 'styled-components';

interface SearchButtonInputLayoutProps {
  children: React.ReactNode;
  SearchButtonInputLayoutStyle?: React.CSSProperties;
}

const SearchButtonInputLayout: React.FC<SearchButtonInputLayoutProps> = ({
  children,
  SearchButtonInputLayoutStyle,
}) => {
  return (
    <SearchWrap style={SearchButtonInputLayoutStyle}>
      <SearchButton>
        <SearchIcon
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="19"
          viewBox="0 0 15 19"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.243 14.48C8.12495 16.2708 4.13578 15.3744 2.04394 12.2942C-0.189465 9.00541 0.585712 4.47256 3.77535 2.16975C6.96499 -0.133055 11.3612 0.666209 13.5946 3.95496C15.6871 7.03617 15.1387 11.2094 12.4381 13.6176L14.8338 17.1454C15.0624 17.4821 14.9803 17.9481 14.6503 18.1864C14.3204 18.4246 13.8675 18.3448 13.6389 18.0081L11.243 14.48ZM10.9518 12.9002C8.42859 14.6609 4.99281 14.014 3.23888 11.4313C1.46756 8.82296 2.08235 5.22794 4.61207 3.40157C7.14178 1.57521 10.6285 2.20911 12.3998 4.81742C14.1537 7.40014 13.5681 10.9503 11.1005 12.7928L10.9518 12.9002Z"
            fill="#535B63"
          />
        </SearchIcon>
      </SearchButton>
      {children}
    </SearchWrap>
  );
};

const SearchWrap = styled.div`
  border-radius: 20px;
  background-color: ${({ theme }) => theme.grey.Grey1};
  height: 36px;

  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const SearchButton = styled.div`
  display: flex;
`;

const SearchIcon = styled.svg`
  padding-left: 10px;
  margin: auto 0;
`;

export default SearchButtonInputLayout;
