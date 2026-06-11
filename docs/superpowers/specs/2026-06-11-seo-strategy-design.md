---
name: seo-strategy
description: SEO strategy for cecommunitychurch.com — technical foundation, structured data, meta optimisation, and Google Business Profile guidance to maximise local search visibility
metadata:
  type: project
---

# SEO Strategy — Coopers Edge Community Church

**Goal:** Maximise the chance that people in Coopers Edge and the surrounding area find the church when searching for local Christian community, church services, toddler groups, and related queries.

**Approach:** Technical SEO + JSON-LD structured data + meta description optimisation + Google Business Profile setup guide. No new pages. No visible content changes beyond meta descriptions.

---

## 1. Technical Foundation

### `robots.txt`
A file at the site root welcoming all crawlers and pointing to the sitemap:

```
User-agent: *
Allow: /
Sitemap: https://cecommunitychurch.com/sitemap.xml
```

### `sitemap.xml`
Lists all 6 public pages with canonical URLs, `<lastmod>` dates, and `<changefreq>` hints:

- `https://cecommunitychurch.com/` — weekly
- `https://cecommunitychurch.com/about.html` — monthly
- `https://cecommunitychurch.com/whats-on.html` — weekly
- `https://cecommunitychurch.com/giving.html` — monthly
- `https://cecommunitychurch.com/safeguarding.html` — yearly
- `https://cecommunitychurch.com/privacy.html` — yearly

Does **not** include the `members` link (external URL, not a page on this domain).

### Canonical `<link>` tags
Added to every page's `<head>`:
```html
<link rel="canonical" href="https://cecommunitychurch.com/index.html">
```
Each page gets its own canonical URL. Prevents duplicate-content issues from `www.` variants or HTTP access.

---

## 2. Open Graph & Twitter Card Meta Tags

A consistent meta block added to every page's `<head>`. Per-page values for `og:title`, `og:description`, and `og:url`; shared values for image and site name.

### Shared across all pages
```html
<meta property="og:site_name" content="Coopers Edge Community Church">
<meta property="og:locale" content="en_GB">
<meta property="og:type" content="website">
<meta property="og:image" content="https://cecommunitychurch.com/images/logo-wide.png">
<meta property="og:image:width" content="192">
<meta property="og:image:height" content="48">
<meta property="og:image:alt" content="Coopers Edge Community Church logo">
<meta name="twitter:card" content="summary">
<meta name="twitter:image" content="https://cecommunitychurch.com/images/logo-wide.png">
```

### Per-page values

| Page | `og:title` | `og:description` |
|------|-----------|-----------------|
| `index.html` | Coopers Edge Community Church | A friendly, all-age Christian community in Coopers Edge, Gloucestershire. Join us every Sunday at 4pm. |
| `about.html` | About Us — Coopers Edge Community Church | Meet the people behind Coopers Edge Community Church — our vision, values, and story since April 2024. |
| `whats-on.html` | What's On — Coopers Edge Community Church | Sunday services, Coopers Kids, The Ark toddler group, and more at Coopers Edge Community Church. |
| `giving.html` | Giving — Coopers Edge Community Church | Support Coopers Edge Community Church through online giving, bank transfer, or Gift Aid. |
| `safeguarding.html` | Safeguarding — Coopers Edge Community Church | Safeguarding policy and contacts for Coopers Edge Community Church. |
| `privacy.html` | Privacy & Terms — Coopers Edge Community Church | Privacy policy and terms for cecommunitychurch.com. |

---

## 3. JSON-LD Structured Data

Embedded in `<head>` as `<script type="application/ld+json">` blocks. Invisible to users, fully readable by Google.

### 3a. `Church` schema — every page

The core local SEO signal. Placed on every page so Google associates every URL with this organisation.

```json
{
  "@context": "https://schema.org",
  "@type": ["Church", "PlaceOfWorship"],
  "name": "Coopers Edge Community Church",
  "url": "https://cecommunitychurch.com",
  "logo": "https://cecommunitychurch.com/images/logo-wide.png",
  "description": "A friendly, all-age Christian community in Coopers Edge, Gloucestershire. Part of the Church of England, Diocese of Gloucester.",
  "email": "info@cecommunitychurch.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Typhoon Way",
    "addressLocality": "Brockworth",
    "addressRegion": "Gloucester",
    "postalCode": "GL3 4DY",
    "addressCountry": "GB"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 51.842,
    "longitude": -2.165
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": "Sunday",
    "opens": "16:00",
    "closes": "17:30"
  },
  "denomination": "Church of England",
  "areaServed": "Coopers Edge, Gloucester, Gloucestershire",
  "sameAs": [
    "https://www.facebook.com/people/Coopers-Edge-Community-Church/61555806122654/",
    "https://www.instagram.com/coopers_edge_community_church/"
  ]
}
```

> **Note:** Geo-coordinates should be verified against the actual venue location before publishing. The values above are approximate.

### 3b. `Event` schema — `whats-on.html` only

Three recurring events marked up individually. Each gets `name`, `description`, `location` (same PostalAddress as above), `organizer`, and `eventSchedule` using `Schedule` type for recurrence.

Events to mark up:
1. **Sunday Service** — every Sunday 4pm, @TheEdge Community Centre
2. **The Ark Toddler Group** — every Wednesday, @TheEdge Community Centre
3. **Prayer Meeting** — 1st Wednesday of the month (online)

### 3c. `BreadcrumbList` schema — inner pages only

Added to `about.html`, `whats-on.html`, `giving.html`, `safeguarding.html`:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cecommunitychurch.com/" },
    { "@type": "ListItem", "position": 2, "name": "About Us", "item": "https://cecommunitychurch.com/about.html" }
  ]
}
```

Second breadcrumb varies per page.

---

## 4. Meta Description Optimisation

All `<title>` tags remain unchanged. Only `<meta name="description">` values are updated to add location signals currently missing or buried.

| Page | Updated description |
|------|-------------------|
| `index.html` | A friendly, all-age Christian community in Coopers Edge, Gloucestershire. Join us every Sunday at 4pm at @TheEdge Community Centre, Brockworth. |
| `about.html` | Meet the people behind Coopers Edge Community Church — our vision, values, and story since launching in April 2024 in Coopers Edge, Gloucester. |
| `whats-on.html` | Sunday services, Coopers Kids children's ministry, The Ark toddler group, and more — at Coopers Edge Community Church, Brockworth, Gloucester. |
| `giving.html` | Support Coopers Edge Community Church, Gloucester through online giving, bank transfer, or Gift Aid. Every gift makes a difference. |
| `safeguarding.html` | *(unchanged)* |
| `privacy.html` | *(unchanged)* |

Denomination terminology ("Church of England", "Diocese of Gloucester") is intentionally kept out of visible content and meta descriptions, and surfaced only via JSON-LD.

---

## 5. Google Business Profile Setup Guide

Saved as `docs/google-business-profile-guide.md`. Not deployed to the website.

Covers:
1. Creating the profile at business.google.com — category: "Church"
2. NAP data entry (must exactly match the website)
3. Adding service hours, website URL, email
4. Uploading photos (interior, exterior, logo)
5. Verification process (postcard or instant)
6. Ongoing: encouraging reviews, posting event updates

---

## Out of scope

- New pages or significant content additions
- Any changes to visible page headings, navigation, or body copy
- Paid search or social advertising
- Link-building / off-site SEO beyond Google Business Profile

---

## Files changed

| File | Change |
|------|--------|
| `robots.txt` | New file |
| `sitemap.xml` | New file |
| `index.html` | Canonical tag, full OG/Twitter meta, JSON-LD Church schema, updated meta description |
| `about.html` | Canonical tag, full OG/Twitter meta, JSON-LD Church + Breadcrumb schema, updated meta description |
| `whats-on.html` | Canonical tag, full OG/Twitter meta, JSON-LD Church + Event + Breadcrumb schema, updated meta description |
| `giving.html` | Canonical tag, full OG/Twitter meta, JSON-LD Church + Breadcrumb schema |
| `safeguarding.html` | Canonical tag, full OG/Twitter meta, JSON-LD Church + Breadcrumb schema |
| `privacy.html` | Canonical tag, full OG/Twitter meta, JSON-LD Church schema |
| `docs/google-business-profile-guide.md` | New file |
