/**
 * Determines whether a caught error represents an expected "page not found"
 * condition that should result in a 404, rather than an unhandled 500.
 *
 * Uses duck-typing (.code property check) rather than instanceof, because
 * instanceof Error returns false across Edge runtime VM context boundaries.
 * Falls back to message-string matching for resilience in case .code is
 * stripped during serialization.
 */
export function isExpectedMdxError(e: unknown): boolean {
  const errorCode =
    e && typeof e === 'object' && 'code' in e ? (e as {code: unknown}).code : null;

  if (errorCode === 'ENOENT' || errorCode === 'MDX_RUNTIME_ERROR') {
    return true;
  }

  // Fallback: duck-type the message for Edge runtime where .code may be stripped
  if (
    typeof (e as any)?.message === 'string' &&
    (e as any).message.includes('Failed to find a valid source file')
  ) {
    return true;
  }

  return false;
}
