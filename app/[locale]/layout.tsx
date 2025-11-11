import {getLocales} from 'gt-next/server';
import {GTProvider} from 'gt-next';

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
  const {locale} = await params;
  return <GTProvider locale={locale}>{children}</GTProvider>;
}
