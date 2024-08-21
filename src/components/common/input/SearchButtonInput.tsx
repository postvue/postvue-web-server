import React from 'react';
import styled from 'styled-components';

interface SearchButtonInputProps {
  placeholder: string;
  onSearchInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchInputKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  value?: string | number | readonly string[] | undefined;
  onClickDelete?: () => void;
}

const SearchButtonInput: React.FC<SearchButtonInputProps> = ({
  placeholder,
  onSearchInputChange,
  onSearchInputKeyDown,
  value,
  onClickDelete,
}) => {
  return (
    <SearchWrap>
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
      <SearchInput
        placeholder={placeholder}
        onChange={onSearchInputChange}
        onKeyDown={onSearchInputKeyDown}
        value={value}
      />
      {onClickDelete !== undefined && (
        <>
          {value !== '' && (
            <DeleteSearchButton>
              <DeleteSearchIcon
                width="24"
                height="24"
                viewBox="0 0 32 32"
                color="#A1A9AD"
                onClick={onClickDelete}
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M16 27c6.075 0 11-4.925 11-11S22.075 5 16 5 5 9.925 5 16s4.925 11 11 11Zm-3.47-6.47L16 17.06l3.47 3.47 1.06-1.06L17.06 16l3.47-3.47-1.06-1.06L16 14.94l-3.47-3.47-1.06 1.06L14.94 16l-3.47 3.47 1.06 1.06Z"
                  clipRule="evenodd"
                ></path>
              </DeleteSearchIcon>
            </DeleteSearchButton>
          )}
        </>
      )}
    </SearchWrap>
  );
};

const SearchWrap = styled.div`
  border-radius: 17px;
  background-color: ${({ theme }) => theme.grey.Grey1};
  height: 36px;

  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const SearchInput = styled.input`
  color: #d3d5d6;
  width: 100%;
  border: 0px;
  height: 100%;
  background: none;
  padding-left: 7px;

  font: ${({ theme }) => theme.fontSizes.Body3};
  color: ${({ theme }) => theme.grey.Grey6};

  &: focus {
    outline: none;
  }
  &::placeholder {
    color: ${({ theme }) => theme.grey.Grey6};
  }
`;

const SearchButton = styled.div``;

const SearchIcon = styled.svg`
  padding-left: 10px;
`;

const DeleteSearchButton = styled.div``;
const DeleteSearchIcon = styled.svg`
  padding-right: 10px;
  cursor: pointer;
`;

export default SearchButtonInput;
