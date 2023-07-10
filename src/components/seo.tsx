import React from 'react';
import Helmet from 'react-helmet';
import {graphql, useStaticQuery} from 'gatsby';

const detailsQuery = graphql`
  query DefaultSEOQuery {
    site {
      siteMetadata {
        title
        description
        author
        sitePath
      }
    }
  }
`;

type Props = {
  title: string;
  description?: string;
  keywords?: string[];
  lang?: string;
  meta?: any[];
  noindex?: boolean;
};

type ChildProps = Props & {
  data: {
    site: {
      siteMetadata: {
        sitePath: string;
        title: string;
        author?: string;
        description?: string;
      };
    };
  };
};

export function BaseSEO({
  data,
  description,
  lang,
  meta = [],
  keywords = [],
  title,
  noindex,
}: ChildProps) {
  const metaDescription = description || data.site.siteMetadata.description;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${data.site.siteMetadata.title}`}
      meta={[
        {
          name: 'description',
          content: metaDescription,
        },
        {
          property: 'og:title',
          content: title,
        },
        {
          property: 'og:description',
          content: metaDescription,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:image',
          content: `https://${data.site.siteMetadata.sitePath}/meta.png`,
        },
        {
          property: 'og:image:width',
          content: '1200',
        },
        {
          property: 'og:image:height',
          content: '630',
        },
        {
          name: 'twitter:card',
          content: 'summary',
        },
        {
          name: 'twitter:creator',
          content: data.site.siteMetadata.author,
        },
        {
          name: 'twitter:title',
          content: title,
        },
        {
          name: 'twitter:image',
          content: `https://${data.site.siteMetadata.sitePath}/meta-avatar.png`,
        },
        {
          name: 'twitter:description',
          content: metaDescription,
        },
        {rel: 'icon', type: 'image/png', href: 'favicon.ico'},
      ]
        .concat(
          keywords.length > 0
            ? {
                name: 'keywords',
                content: keywords.join(', '),
              }
            : []
        )
        .concat(
          noindex
            ? {
                name: 'robots',
                content: 'noindex',
              }
            : []
        )
        .concat(meta)}
    />
  );
}

export function SEO(props: Props) {
  const data = useStaticQuery(detailsQuery);

  return <BaseSEO data={data} {...props} />;
}
