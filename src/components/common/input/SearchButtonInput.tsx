import React from 'react';
import styled from 'styled-components';
import SearchButtonInputLayout from '../../layouts/SearchButtonInputLayout';

interface SearchButtonInputProps {
  placeholder: string;
  onSearchInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchInputKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  value?: string | number | readonly string[] | undefined;
  onClickDelete?: () => void;
  onSearchInputOnFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onSearchInputOnBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  deleteButtonRef?: React.RefObject<HTMLDivElement>;
  searchInputRef?: React.RefObject<HTMLInputElement>;
  isActiveDeleteButton: boolean;
  isShowAddElement?: boolean;
  addElement?: React.ReactNode;
}

const SearchButtonInput: React.FC<SearchButtonInputProps> = ({
  placeholder,
  onSearchInputChange,
  onSearchInputKeyDown,
  value,
  onClickDelete,
  onSearchInputOnFocus,
  onSearchInputOnBlur,
  deleteButtonRef,
  searchInputRef,
  isActiveDeleteButton,
  isShowAddElement = false,
  addElement,
}) => {
  return (
    <SearchButtonInputLayout>
      <SearchInput
        placeholder={placeholder}
        onChange={onSearchInputChange}
        onKeyDown={onSearchInputKeyDown}
        value={value}
        onFocus={onSearchInputOnFocus}
        onBlur={onSearchInputOnBlur}
        ref={searchInputRef}
      />
      {onClickDelete !== undefined && (
        <>
          {isActiveDeleteButton && (
            <DeleteSearchButton ref={deleteButtonRef}>
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
      {isShowAddElement && addElement}
    </SearchButtonInputLayout>
  );
};

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

const DeleteSearchButton = styled.div`
  display: flex;
`;
const DeleteSearchIcon = styled.svg`
  padding-right: 10px;
  cursor: pointer;
`;

export default SearchButtonInput;
