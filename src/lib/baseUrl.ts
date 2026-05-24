/**
 * Returns the absolute base URL for server-side fetch calls.
 *
 * Priority:
 * 1. VERCEL_PROJECT_PRODUCTION_URL — stable production domain, never changes between deploys
 * 2. VERCEL_URL                    — deployment-specific URL, used on preview deploys
 * 3. localhost:3000                — local development fallback
 */
export function getBaseUrl(): string {
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
        return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    return 'http://localhost:3000';
}
