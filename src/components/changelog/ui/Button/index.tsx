import {AnchorHTMLAttributes, ButtonHTMLAttributes, forwardRef, Ref} from 'react';
import Link, {LinkProps} from 'next/link';

import styles from './styles.module.scss';

type CommonProps = {
  as?: 'button' | 'a';
  size?: 'sm' | 'default' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'solid';
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & CommonProps;
type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps & CommonProps;

type Props = ButtonProps | AnchorProps;

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, Props>(
  ({as = 'button', variant = 'primary', size = 'default', className, ...props}, ref) => {
    const variants = {
      primary: `${styles.btn} text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300`,
      secondary: `${styles.btn} text-gray-700 border hover:border-indigo-600 disabled:border-indigo-300 disabled:text-gray-300`,
      danger: 'text-white bg-red-600 hover:bg-red-700 disabled:bg-red-300',
      ghost: `${styles.btn} focus:outline focus:outline-2 focus:outline-offset-2 hover:bg-gray-100 !outline-accent-purple`,
      outline: [styles.btn, styles['outline-btn']].join(' '),
      solid: [styles.btn, styles['solid-btn']].join(' '),
    };

    const sizes = {
      sm: 'px-1.5 py-1.5 text-sm',
      default: 'px-4 py-2 text-sm font-medium',
      md: 'px-5 py-3',
      lg: 'px-6 py-3.5',
      xl: 'px-7 py-4',
    };

    if (as === 'a') {
      return (
        <Link
          className={`${variants[variant]} ${
            sizes[size]
          } duration-150 transition-all disabled:cursor-not-allowed inline-flex items-center  ${
            className ?? ''
          }`}
          {...(props as AnchorProps)}
          ref={ref as Ref<HTMLAnchorElement>}
        />
      );
    }

    return (
      <button
        className={`${variants[variant]} ${
          sizes[size]
        } duration-150 transition-all disabled:cursor-not-allowed inline-flex items-center ${
          className ?? ''
        }`}
        {...(props as ButtonProps)}
        ref={ref as Ref<HTMLButtonElement>}
      />
    );
  }
);
