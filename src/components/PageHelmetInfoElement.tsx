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
        <meta
          name="description"
          content="이 페이지는 SEO 최적화를 위한 예시 페이지입니다."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:type" content="article" />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://namu.wiki/w/%EC%A0%95%EC%9A%B0%EC%84%B1"
        ></link>
        <link
          rel="search"
          type="application/opensearchdescription+xml"
          title="나무위키"
          href="/opensearch.xml"
        ></link>
      </Helmet>
    </>
  );
};

export default PageHelmentInfoElement;
