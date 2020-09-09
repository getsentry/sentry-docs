import React from "react";
import Helmet from "react-helmet";
import { StaticQuery, graphql } from "gatsby";

const detailsQuery = graphql`
  query DefaultSEOQuery {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`;

type Props = {
  title: string;
  lang?: string;
  description?: string;
  meta?: any[];
  file?: {
    [key: string]: any;
  };
  keywords?: string[];
};

type ChildProps = Props & {
  data: {
    site: {
      siteMetadata: {
        title: string;
        description?: string;
        author?: string;
      };
    };
  };
};

export const SEO = ({
  data,
  description,
  lang,
  meta = [],
  keywords = [],
  title,
  file,
}: ChildProps): JSX.Element => {
  const noindex =
    (file &&
      file.childMarkdownRemark &&
      file.childMarkdownRemark.frontmatter &&
      file.childMarkdownRemark.frontmatter.noindex) ||
    (file &&
      file.childMdx &&
      file.childMdx.frontmatter &&
      file.childMdx.frontmatter.noindex);

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
          name: "description",
          content: metaDescription,
        },
        {
          property: "og:title",
          content: title,
        },
        {
          property: "og:description",
          content: metaDescription,
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          name: "twitter:card",
          content: "summary",
        },
        {
          name: "twitter:creator",
          content: data.site.siteMetadata.author,
        },
        {
          name: "twitter:title",
          content: title,
        },
        {
          name: "twitter:description",
          content: metaDescription,
        },
        { rel: "icon", type: "image/png", href: "favicon.ico" },
      ]
        .concat(
          keywords.length > 0
            ? {
                name: "keywords",
                content: keywords.join(", "),
              }
            : []
        )
        .concat(
          noindex
            ? {
                property: "robots",
                content: "noindex",
              }
            : []
        )
        .concat(meta)}
    />
  );
};

export default (props: Props): JSX.Element => {
  return (
    <StaticQuery
      query={detailsQuery}
      render={data => <SEO data={data} {...props} />}
    />
  );
};
