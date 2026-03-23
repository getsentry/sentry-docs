import type {ReactNode} from 'react';
import Link from 'next/link';

export type AnchorLinkGridItem = {
  href: string;
  title: ReactNode;
  description?: ReactNode;
};

type Props = {
  items: AnchorLinkGridItem[];
};

/**
 * Same layout as {@link PageGrid}: nav → ul → li with h4 link + optional description,
 * for in-page section anchors instead of child routes.
 */
export function AnchorLinkGrid({items}: Props) {
  return (
    <nav>
      <ul>
        {items.map(item => (
          <li key={item.href} style={{marginBottom: '1rem'}}>
            <h4 style={{marginBottom: '0px'}}>
              <Link href={item.href}>{item.title}</Link>
            </h4>
            {item.description ? <p>{item.description}</p> : null}
          </li>
        ))}
      </ul>
    </nav>
  );
}
