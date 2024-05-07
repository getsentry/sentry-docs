export type NavItemsProps = {
  id: string;
  type: 'button' | 'a';
  variant: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'solid';
  children?: NavItemChildrenProps[];
  className?: string;
  target?: string;
  title?: string;
  to?: string;
  withArrowBtn?: boolean;
};

export type NavItemChildrenProps = {
  id: string;
  children?: NavItemsProps[];
  title?: string;
};
