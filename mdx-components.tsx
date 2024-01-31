import type { MDXComponents } from 'mdx/types'
import { PageGrid } from 'src/components/pageGrid';
 
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    PageGrid,
    ...components,
  }
}
