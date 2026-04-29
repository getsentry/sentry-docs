'use client';

/**
 * Component: SplitLayout / SplitSection
 *
 * Creates a two-column layout with text content on the left and code samples on the right.
 * Ideal for getting started guides where you want to explain concepts alongside code examples.
 *
 * Usage in MDX:
 * <SplitLayout>
 *   <SplitSection>
 *     <SplitSectionText>
 *       ## Your Heading
 *       Explanatory text goes here...
 *     </SplitSectionText>
 *     <SplitSectionCode>
 *       ```javascript
 *       // Your code sample
 *       ```
 *     </SplitSectionCode>
 *   </SplitSection>
 * </SplitLayout>
 *
 * Props:
 * - SplitLayout: Container for one or more split sections
 * - SplitSection: Individual split section wrapper
 * - SplitSectionText: Left side text content
 * - SplitSectionCode: Right side code samples
 *
 * Note: While SplitSection.Text and SplitSection.Code are available as properties
 * for TypeScript convenience, MDX requires using the direct component names.
 */

import {ReactNode} from 'react';

import styles from './style.module.scss';

type SplitLayoutProps = {
  children: ReactNode;
};

type SplitSectionProps = {
  children: ReactNode;
};

type SplitSectionTextProps = {
  children: ReactNode;
};

type SplitSectionCodeProps = {
  children: ReactNode;
};

export function SplitLayout({children}: SplitLayoutProps) {
  return <div className={styles.splitLayoutContainer}>{children}</div>;
}

export function SplitSectionText({children}: SplitSectionTextProps) {
  return <div className={styles.splitText}>{children}</div>;
}

export function SplitSectionCode({children}: SplitSectionCodeProps) {
  return <div className={styles.splitCode}>{children}</div>;
}

export function SplitSection({children}: SplitSectionProps) {
  return <div className={styles.splitSection}>{children}</div>;
}

// Attach Text and Code as properties of SplitSection for dot notation usage
SplitSection.Text = SplitSectionText;
SplitSection.Code = SplitSectionCode;
