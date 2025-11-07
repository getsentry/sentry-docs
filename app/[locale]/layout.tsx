import {getLocales} from 'gt-next/server';

export const dynamicParams = false;

export function generateStaticParams() {
  const locales = getLocales();
  return locales.map(locale => ({locale}));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  // Provider is applied at the root layout; just render children here
  await params; // maintain async signature consistent with app typing
  return children;
}
