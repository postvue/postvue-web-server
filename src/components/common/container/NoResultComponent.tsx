import { API_SUCCESS_PHARSE_TEXT } from 'const/SystemPhraseConst';
import React from 'react';
import ResultComponent from './ResultComponent';

const NoResultComponent: React.FC = () => {
  return <ResultComponent title={API_SUCCESS_PHARSE_TEXT} />;
};

export default NoResultComponent;
