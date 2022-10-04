import React from "react";
import PageContext from "~src/components/pageContext";

export const wrapPageElement = ({ element, props: { pageContext } }) => (
  <PageContext.Provider value={pageContext}>{element}</PageContext.Provider>
);

export const onPreRenderHTML = ({getHeadComponents}) => {
    if (process.env.NODE_ENV !== 'production')
        return

    getHeadComponents().forEach(el => {
        // Remove inline css. https://github.com/gatsbyjs/gatsby/issues/1526
        if (el.type === 'style') {
            el.type = 'link'
            el.props['href'] = el.props['data-href']
            el.props['rel'] = 'stylesheet'
            el.props['type'] = 'text/css'

            delete el.props['data-href']
            delete el.props['dangerouslySetInnerHTML']
            delete el.props['children']
        }
    })
};
