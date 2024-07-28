import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import React from 'react';

import {
  ACCOUNT_PATH,
  HOME_PATH,
  MAP_PATH,
  SEARCH_PATH,
} from '../const/PathConst';

const TabBar: React.FC = () => {
  return (
    <Container>
      <StyleTab>
        <NavLink
          to={HOME_PATH}
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="43"
            height="44"
            viewBox="0 0 43 44"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 23.1816C0 21.9207 0.476385 20.7064 1.33374 19.7818L17.8606 1.95959C19.8412 -0.176221 23.2208 -0.173683 25.1982 1.9651L41.6714 19.783C42.5256 20.707 43 21.919 43 23.1773V39C43 41.7614 40.7614 44 38 44H32.3188C29.5574 44 27.3188 41.7614 27.3188 39V32.9097C27.3188 30.1482 25.0802 27.9097 22.3188 27.9097H20.5517C17.7903 27.9097 15.5517 30.1482 15.5517 32.9097V39C15.5517 41.7614 13.3131 44 10.5517 44H5C2.23858 44 0 41.7614 0 39V23.1816Z"
              fill="#EAECEF"
            />
          </svg>
        </NavLink>
      </StyleTab>
      <StyleTab>
        <NavLink to={SEARCH_PATH}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="33"
            height="40"
            viewBox="0 0 33 40"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M26.9672 29.0751C33.2051 23.5883 34.4712 14.0823 29.637 7.06363C24.4764 -0.428875 14.3183 -2.24978 6.94821 2.99653C-0.421867 8.24283 -2.21301 18.5697 2.94757 26.0622C7.78172 33.0808 17.0011 35.1226 24.2062 31.0404L30.0266 39.4909C30.3985 40.0308 31.1306 40.1621 31.6617 39.7842L32.4993 39.1878C33.0304 38.8097 33.1595 38.0655 32.7876 37.5255L26.9672 29.0751ZM26.876 9.02857C30.9689 14.9709 29.5483 23.1612 23.7031 27.322C17.8579 31.4829 9.80146 30.0388 5.70856 24.0964C1.6157 18.1541 3.03627 9.96381 8.8815 5.80292C14.7267 1.64205 22.7831 3.08622 26.876 9.02857Z"
              fill="#EAECEF"
            />
          </svg>
        </NavLink>
      </StyleTab>
      <StyleTab>
        <NavLink to={MAP_PATH}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="44"
            viewBox="0 0 35 44"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M17.2802 0.00138823C20.482 -0.0390455 23.6335 0.804476 26.3914 2.4401C29.1494 4.07573 31.4081 6.44075 32.9216 9.27764C34.4352 12.1145 35.1455 15.3145 34.9752 18.5292C34.8109 21.6332 33.8316 24.636 32.1398 27.233C32.0627 27.3922 31.9657 27.5435 31.8492 27.6831L31.6134 27.9658C31.2239 28.5016 30.805 29.0152 30.3586 29.504L19.1763 43.1963C18.7612 43.7047 18.1415 43.9995 17.4872 44C16.833 44.0005 16.2129 43.7065 15.797 43.1987L4.32084 29.1864L4.31658 29.1813C4.08939 28.9071 3.86436 28.6266 3.64182 28.3428L3.34889 27.9856C3.23596 27.8479 3.14172 27.6991 3.06664 27.5427C1.33389 25.002 0.293721 22.0461 0.0536402 18.9702C-0.19686 15.7609 0.433288 12.5439 1.87547 9.66971C3.31765 6.79549 5.51657 4.37417 8.23279 2.66942C10.949 0.964661 14.0784 0.0418218 17.2802 0.00138823ZM24.0482 17.6093C24.0482 21.2531 21.11 24.2069 17.4857 24.2069C13.8613 24.2069 10.9232 21.2531 10.9232 17.6093C10.9232 13.9655 13.8613 11.0116 17.4857 11.0116C21.11 11.0116 24.0482 13.9655 24.0482 17.6093Z"
              fill="#EAECEF"
            />
          </svg>
        </NavLink>
      </StyleTab>

      <StyleTab>
        <NavLink to={ACCOUNT_PATH}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="44"
            height="43"
            viewBox="0 0 44 43"
            fill="none"
          >
            <path
              d="M22 21.5C28.0506 21.5 33 16.6624 33 10.75C33 4.83761 28.0506 0 22 0C15.9494 0 11 4.83761 11 10.75C11 16.6624 15.9494 21.5 22 21.5ZM22 26.875C14.7127 26.875 0 30.5033 0 37.625V43H44V37.625C44 30.5033 29.2873 26.875 22 26.875Z"
              fill="#EAECEF"
            />
          </svg>
        </NavLink>
      </StyleTab>
    </Container>
  );
};

const Container = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  margin: 0px auto;
  padding: 10px 0 3vh 0;
  background-color: white;
  border-top: 1px solid ${({ theme }) => theme.grey.Grey2};

  display: flex;
  justify-content: space-around;
`;

const StyleTab = styled.div`
  svg {
    path {
      fill: ${({ theme }) => theme.grey.Grey2};
    }
  }
  .active {
    svg {
      path {
        fill: ${({ theme }) => theme.mainColor.Black};
      }
    }
  }
`;

export default TabBar;
