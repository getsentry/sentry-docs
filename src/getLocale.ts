// getLocale.ts  
import { unstable_rootParams } from "next/server";
export default async function getLocale() {
  return (await unstable_rootParams())?.locale;
}