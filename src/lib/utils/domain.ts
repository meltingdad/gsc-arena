/**
 * Utility functions for domain name handling
 */

/**
 * Cleans a domain/URL by removing common prefixes and formatting
 * Removes: sc-domain:, https://, http://, www., trailing slashes
 *
 * @param domain - The raw domain/URL string
 * @returns Clean, display-friendly domain name
 *
 * @example
 * cleanDomain('sc-domain:example.com') // 'example.com'
 * cleanDomain('https://www.example.com/') // 'example.com'
 * cleanDomain('http://example.com') // 'example.com'
 */
export function cleanDomain(domain: string): string {
  if (!domain) return ''

  return domain
    .replace(/^sc-domain:/, '') // Remove Google Search Console domain prefix
    .replace(/^https?:\/\//, '') // Remove http:// or https://
    .replace(/^www\./, '') // Remove www.
    .replace(/\/$/, '') // Remove trailing slash
    .trim()
}

/**
 * Extracts a clean domain from a full site URL
 * Used when storing domains from Google Search Console API
 *
 * @param siteUrl - The full site URL from GSC
 * @returns Clean domain for storage
 */
export function extractDomain(siteUrl: string): string {
  return cleanDomain(siteUrl)
}

/**
 * Constructs a full HTTPS URL from a clean domain
 * Used for creating clickable links to websites
 *
 * @param domain - The clean domain name (e.g., 'example.com')
 * @returns Full HTTPS URL (e.g., 'https://example.com')
 *
 * @example
 * getDomainUrl('example.com') // 'https://example.com'
 * getDomainUrl('subdomain.example.com') // 'https://subdomain.example.com'
 */
export function getDomainUrl(domain: string): string {
  if (!domain) return ''

  // Ensure the domain is clean (no protocols, www, etc.)
  const cleanedDomain = cleanDomain(domain)

  // Return with https:// prefix
  return `https://${cleanedDomain}`
}
