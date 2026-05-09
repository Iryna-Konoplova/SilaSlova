// Root "/" is always redirected to "/{locale}" by src/proxy.ts.
// This file satisfies Next.js's root page requirement.
export default function RootPage() {
  return null;
}
