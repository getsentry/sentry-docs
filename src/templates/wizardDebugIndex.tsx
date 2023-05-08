import React from 'react';
import {graphql} from 'gatsby';

import BasePage from '~src/components/basePage';
import SmartLink from '~src/components/smartLink';

export default function WizardDebug({
  data: {
    allFile: {nodes},
  },
}) {
  return (
    <BasePage pageContext={{title: 'Wizard Previews'}}>
      <ul>
        {nodes
          .sort((a, b) =>
            a.childMarkdownRemark.frontmatter.name.localeCompare(
              b.childMarkdownRemark.frontmatter.name
            )
          )
          .map(({childMarkdownRemark}) => {
            return (
              <li key={childMarkdownRemark.fields.slug}>
                <SmartLink to={`/_debug/wizard${childMarkdownRemark.fields.slug}`}>
                  {childMarkdownRemark.frontmatter.name}
                </SmartLink>
              </li>
            );
          })}
      </ul>
    </BasePage>
  );
}

export const pageQuery = graphql`
  query WizardDebugIndexQuery {
    allFile(filter: {sourceInstanceName: {eq: "wizard"}}) {
      nodes {
        childMarkdownRemark {
          frontmatter {
            name
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;
