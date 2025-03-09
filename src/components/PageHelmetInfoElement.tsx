import { APP_SERVICE_NAME } from 'const/AppInfoConst';
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface PageHelmentInfoElementProps {
  title: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  canonicalHref?: string;
}

const PageHelmentInfoElement: React.FC<PageHelmentInfoElementProps> = ({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  canonicalHref,
}) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta
          name="description"
          content={description}
          data-react-helmet="true"
        />
        <meta property="og:title" content={ogTitle} data-react-helmet="true" />
        <meta
          property="og:description"
          content={ogDescription}
          data-react-helmet="true"
        />
        {/* <meta property="og:image" content={ogImage} data-react-helmet="true" /> */}
        <meta property="og:url" content={ogUrl} data-react-helmet="true" />
        <meta property="og:type" content="article" data-react-helmet="true" />
        <meta name="robots" content="index, follow" data-react-helmet="true" />
        <link rel="canonical" href={canonicalHref}></link>
        <link
          rel="search"
          type="application/opensearchdescription+xml"
          title={APP_SERVICE_NAME}
          href="/opensearch.xml"
        ></link>
      </Helmet>
    </>
  );
};

export default PageHelmentInfoElement;
