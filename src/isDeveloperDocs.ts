/** Check if the developer docs are enabled, practically the `NEXT_PUBLIC_DEVELOPER_DOCS` env var is set to something */
export const isDeveloperDocs = !!process.env.NEXT_PUBLIC_DEVELOPER_DOCS;
