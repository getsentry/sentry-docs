import { GTProvider } from 'gt-next';

export const dynamicParams = false;

export async function generateStaticParams() {
  // Keep in sync with gt.config.json
  return [{ locale: 'en' }, { locale: 'fr' }, { locale: 'es' }, { locale: 'de' }];
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

