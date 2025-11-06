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
  // Provider is applied at the root layout; just render children here
  await params; // ensure params are awaited to keep async signature
  return children;
}
