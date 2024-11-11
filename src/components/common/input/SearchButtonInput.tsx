import { ReactComponent as DeleteSearchInputIcon } from 'assets/images/icon/svg/DeleteSearchInputIcon.svg';
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
  SearchButtonInputLayoutStyle?: React.CSSProperties;
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
  SearchButtonInputLayoutStyle,
}) => {
  return (
    <SearchButtonInputLayout
      SearchButtonInputLayoutStyle={SearchButtonInputLayoutStyle}
    >
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
            <DeleteSearchButton ref={deleteButtonRef} onClick={onClickDelete}>
              <DeleteSearchInputIcon />
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
  padding-right: 10px;
  cursor: pointer;
`;

export default SearchButtonInput;
