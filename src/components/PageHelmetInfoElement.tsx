import React from 'react';
import { Helmet } from 'react-helmet-async';

interface PageHelmentInfoElementProps {
  title: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
}

const PageHelmentInfoElement: React.FC<PageHelmentInfoElementProps> = ({
  title,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
}) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={ogUrl} />
      </Helmet>
    </>
  );
};

export default PageHelmentInfoElement;
