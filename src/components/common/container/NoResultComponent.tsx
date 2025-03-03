import { API_SUCCESS_PHARSE_TEXT } from 'const/SystemPhraseConst';
import React from 'react';
import ResultComponent from './ResultComponent';

interface NoResultComponentProps {
  title?: string;
  NoResultTitleStyle?: React.CSSProperties;
}

const NoResultComponent: React.FC<NoResultComponentProps> = ({
  title,
  NoResultTitleStyle,
}) => {
  return (
    <ResultComponent
      title={title ? title : API_SUCCESS_PHARSE_TEXT}
      ResultTitleStyle={NoResultTitleStyle}
    />
  );
};

export default NoResultComponent;
