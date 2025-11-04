import { GTProvider } from 'gt-next';
import { getLocales } from 'gt-next/server';

export const dynamicParams = false;

export async function generateStaticParams() {
  const locales = getLocales();
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;
  console.log('locale', locale);
  return <GTProvider locale={locale}>{children}</GTProvider>;
}
