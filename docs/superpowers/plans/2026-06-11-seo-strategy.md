# SEO Strategy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full local SEO stack to cecommunitychurch.com — robots.txt, sitemap.xml, canonical tags, Open Graph/Twitter card meta, and JSON-LD structured data on every page — so Google can confidently identify the site as a local church at a specific address.

**Architecture:** Pure static file edits — no build step, no new dependencies. Each HTML page gets a canonical `<link>`, a complete OG/Twitter meta block, and a `<script type="application/ld+json">` block embedded just before `</head>`. Two new root files (`robots.txt`, `sitemap.xml`) are added. JSON-LD blocks are data, not executable scripts, so the existing `script-src 'self'` CSP requires no change.

**Tech Stack:** Static HTML, Schema.org JSON-LD, XML sitemap, robots.txt

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `robots.txt` | Create | Tell crawlers they're welcome; point to sitemap |
| `sitemap.xml` | Create | List all 6 public pages with canonical URLs |
| `index.html` | Modify head | Canonical, OG/Twitter, Church schema, updated description |
| `about.html` | Modify head | Canonical, OG/Twitter, Church + Breadcrumb schema, updated description; fix duplicate DOCTYPE |
| `whats-on.html` | Modify head | Canonical, OG/Twitter, Church + Event + Breadcrumb schema, updated description |
| `giving.html` | Modify head | Canonical, OG/Twitter, Church + Breadcrumb schema, updated description |
| `safeguarding.html` | Modify head | Canonical, OG/Twitter, Church + Breadcrumb schema |
| `privacy.html` | Modify head | Canonical, OG/Twitter, Church schema |
| `docs/google-business-profile-guide.md` | Create | Plain-English GBP setup instructions for the church |

---

## Task 1: robots.txt and sitemap.xml

**Files:**
- Create: `robots.txt`
- Create: `sitemap.xml`

- [ ] **Step 1: Create robots.txt**

  Create `/Users/chris/cecc-website/robots.txt` with this exact content:

  ```
  User-agent: *
  Allow: /
  Sitemap: https://cecommunitychurch.com/sitemap.xml
  ```

- [ ] **Step 2: Create sitemap.xml**

  Create `/Users/chris/cecc-website/sitemap.xml` with this exact content:

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://cecommunitychurch.com/</loc>
      <lastmod>2026-06-11</lastmod>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>https://cecommunitychurch.com/about.html</loc>
      <lastmod>2026-06-11</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>https://cecommunitychurch.com/whats-on.html</loc>
      <lastmod>2026-06-11</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>
    <url>
      <loc>https://cecommunitychurch.com/giving.html</loc>
      <lastmod>2026-06-11</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>
    <url>
      <loc>https://cecommunitychurch.com/safeguarding.html</loc>
      <lastmod>2026-06-11</lastmod>
      <changefreq>yearly</changefreq>
      <priority>0.5</priority>
    </url>
    <url>
      <loc>https://cecommunitychurch.com/privacy.html</loc>
      <lastmod>2026-06-11</lastmod>
      <changefreq>yearly</changefreq>
      <priority>0.3</priority>
    </url>
  </urlset>
  ```

- [ ] **Step 3: Verify sitemap is valid XML**

  Run: `xmllint --noout sitemap.xml && echo "Valid XML"`
  Expected: `Valid XML`

- [ ] **Step 4: Verify robots.txt references sitemap**

  Run: `grep "Sitemap" robots.txt`
  Expected: `Sitemap: https://cecommunitychurch.com/sitemap.xml`

- [ ] **Step 5: Commit**

  ```bash
  git add robots.txt sitemap.xml
  git commit -m "feat(seo): add robots.txt and sitemap.xml"
  ```

---

## Task 2: index.html — canonical, OG/Twitter meta, JSON-LD, updated description

**Files:**
- Modify: `index.html` (head section)

- [ ] **Step 1: Replace description and existing OG block with full meta block**

  In `index.html`, find and replace:

  ```html
    <meta name="description" content="A friendly all-age Christian community in Coopers Edge, Gloucestershire. Join us every Sunday at 4pm at @TheEdge Community Centre.">
    <meta property="og:title" content="Coopers Edge Community Church">
    <meta property="og:description" content="A place where people of all ages can belong, grow and flourish. Join us every Sunday at 4pm.">
    <meta property="og:type" content="website">
  ```

  Replace with:

  ```html
    <meta name="description" content="A friendly, all-age Christian community in Coopers Edge, Gloucestershire. Join us every Sunday at 4pm at @TheEdge Community Centre, Brockworth.">
    <link rel="canonical" href="https://cecommunitychurch.com/">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://cecommunitychurch.com/">
    <meta property="og:title" content="Coopers Edge Community Church">
    <meta property="og:description" content="A friendly, all-age Christian community in Coopers Edge, Gloucestershire. Join us every Sunday at 4pm.">
    <meta property="og:site_name" content="Coopers Edge Community Church">
    <meta property="og:locale" content="en_GB">
    <meta property="og:image" content="https://cecommunitychurch.com/images/logo-wide.png">
    <meta property="og:image:width" content="768">
    <meta property="og:image:height" content="192">
    <meta property="og:image:alt" content="Coopers Edge Community Church logo">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="Coopers Edge Community Church">
    <meta name="twitter:description" content="A friendly, all-age Christian community in Coopers Edge, Gloucestershire. Join us every Sunday at 4pm.">
    <meta name="twitter:image" content="https://cecommunitychurch.com/images/logo-wide.png">
  ```

- [ ] **Step 2: Add JSON-LD Church schema just before `</head>`**

  In `index.html`, find and replace:

  ```html
    <link rel="stylesheet" href="css/style.css">
  </head>
  ```

  Replace with:

  ```html
    <link rel="stylesheet" href="css/style.css">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": ["Church", "PlaceOfWorship"],
      "name": "Coopers Edge Community Church",
      "url": "https://cecommunitychurch.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://cecommunitychurch.com/images/logo-wide.png",
        "width": 768,
        "height": 192
      },
      "image": "https://cecommunitychurch.com/images/logo-wide.png",
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
        "closes": "18:00"
      },
      "areaServed": "Coopers Edge, Gloucester, Gloucestershire",
      "sameAs": [
        "https://www.facebook.com/people/Coopers-Edge-Community-Church/61555806122654/",
        "https://www.instagram.com/coopers_edge_community_church/"
      ]
    }
    </script>
  </head>
  ```

- [ ] **Step 3: Verify canonical and og:url are present**

  Run: `grep -c 'canonical\|og:url' index.html`
  Expected: `2`

- [ ] **Step 4: Verify JSON-LD is present**

  Run: `grep -c 'application/ld+json' index.html`
  Expected: `1`

- [ ] **Step 5: Commit**

  ```bash
  git add index.html
  git commit -m "feat(seo): add canonical, OG meta, and JSON-LD to index.html"
  ```

---

## Task 3: about.html — canonical, OG/Twitter meta, JSON-LD, fix duplicate DOCTYPE

**Files:**
- Modify: `about.html` (head section)

- [ ] **Step 1: Fix duplicate DOCTYPE and update description**

  In `about.html`, find and replace:

  ```html
  <!DOCTYPE html>
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About — Coopers Edge Community Church</title>
    <meta name="description" content="Learn about Coopers Edge Community Church — our vision, values, history, and the people who make us who we are.">
  ```

  Replace with:

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About — Coopers Edge Community Church</title>
    <meta name="description" content="Meet the people behind Coopers Edge Community Church — our vision, values, and story since launching in April 2024 in Coopers Edge, Gloucester.">
    <link rel="canonical" href="https://cecommunitychurch.com/about.html">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://cecommunitychurch.com/about.html">
    <meta property="og:title" content="About Us — Coopers Edge Community Church">
    <meta property="og:description" content="Meet the people behind Coopers Edge Community Church — our vision, values, and story since April 2024 in Coopers Edge, Gloucester.">
    <meta property="og:site_name" content="Coopers Edge Community Church">
    <meta property="og:locale" content="en_GB">
    <meta property="og:image" content="https://cecommunitychurch.com/images/logo-wide.png">
    <meta property="og:image:width" content="768">
    <meta property="og:image:height" content="192">
    <meta property="og:image:alt" content="Coopers Edge Community Church logo">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="About Us — Coopers Edge Community Church">
    <meta name="twitter:description" content="Meet the people behind Coopers Edge Community Church — our vision, values, and story since April 2024 in Coopers Edge, Gloucester.">
    <meta name="twitter:image" content="https://cecommunitychurch.com/images/logo-wide.png">
  ```

- [ ] **Step 2: Add JSON-LD Church + Breadcrumb schema just before `</head>`**

  In `about.html`, find and replace:

  ```html
    <link rel="stylesheet" href="css/style.css">
  </head>
  ```

  Replace with:

  ```html
    <link rel="stylesheet" href="css/style.css">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": ["Church", "PlaceOfWorship"],
      "name": "Coopers Edge Community Church",
      "url": "https://cecommunitychurch.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://cecommunitychurch.com/images/logo-wide.png",
        "width": 768,
        "height": 192
      },
      "image": "https://cecommunitychurch.com/images/logo-wide.png",
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
        "closes": "18:00"
      },
      "areaServed": "Coopers Edge, Gloucester, Gloucestershire",
      "sameAs": [
        "https://www.facebook.com/people/Coopers-Edge-Community-Church/61555806122654/",
        "https://www.instagram.com/coopers_edge_community_church/"
      ]
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cecommunitychurch.com/" },
        { "@type": "ListItem", "position": 2, "name": "About Us", "item": "https://cecommunitychurch.com/about.html" }
      ]
    }
    </script>
  </head>
  ```

- [ ] **Step 3: Verify duplicate DOCTYPE is gone**

  Run: `grep -c "DOCTYPE" about.html`
  Expected: `1`

- [ ] **Step 4: Verify JSON-LD blocks are present**

  Run: `grep -c 'application/ld+json' about.html`
  Expected: `2`

- [ ] **Step 5: Commit**

  ```bash
  git add about.html
  git commit -m "feat(seo): add canonical, OG meta, and JSON-LD to about.html; fix duplicate DOCTYPE"
  ```

---

## Task 4: whats-on.html — canonical, OG/Twitter meta, Church + Event + Breadcrumb JSON-LD

**Files:**
- Modify: `whats-on.html` (head section)

- [ ] **Step 1: Update description and add canonical + OG/Twitter meta**

  In `whats-on.html`, find and replace:

  ```html
    <meta name="description" content="Find out what's happening at Coopers Edge Community Church — Sunday services, Coopers Kids, The Ark Toddler Group, prayer meetings, and more.">
  ```

  Replace with:

  ```html
    <meta name="description" content="Sunday services, Coopers Kids children's ministry, The Ark toddler group, and more — at Coopers Edge Community Church, Brockworth, Gloucester.">
    <link rel="canonical" href="https://cecommunitychurch.com/whats-on.html">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://cecommunitychurch.com/whats-on.html">
    <meta property="og:title" content="What's On — Coopers Edge Community Church">
    <meta property="og:description" content="Sunday services, Coopers Kids children's ministry, The Ark toddler group, and more at Coopers Edge Community Church, Brockworth, Gloucester.">
    <meta property="og:site_name" content="Coopers Edge Community Church">
    <meta property="og:locale" content="en_GB">
    <meta property="og:image" content="https://cecommunitychurch.com/images/logo-wide.png">
    <meta property="og:image:width" content="768">
    <meta property="og:image:height" content="192">
    <meta property="og:image:alt" content="Coopers Edge Community Church logo">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="What's On — Coopers Edge Community Church">
    <meta name="twitter:description" content="Sunday services, Coopers Kids, The Ark toddler group, and more at Coopers Edge Community Church, Brockworth, Gloucester.">
    <meta name="twitter:image" content="https://cecommunitychurch.com/images/logo-wide.png">
  ```

- [ ] **Step 2: Add Church + Event + Breadcrumb JSON-LD just before `</head>`**

  In `whats-on.html`, find and replace:

  ```html
    <link rel="stylesheet" href="css/style.css">
  </head>
  ```

  Replace with:

  ```html
    <link rel="stylesheet" href="css/style.css">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": ["Church", "PlaceOfWorship"],
      "name": "Coopers Edge Community Church",
      "url": "https://cecommunitychurch.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://cecommunitychurch.com/images/logo-wide.png",
        "width": 768,
        "height": 192
      },
      "image": "https://cecommunitychurch.com/images/logo-wide.png",
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
        "closes": "18:00"
      },
      "areaServed": "Coopers Edge, Gloucester, Gloucestershire",
      "sameAs": [
        "https://www.facebook.com/people/Coopers-Edge-Community-Church/61555806122654/",
        "https://www.instagram.com/coopers_edge_community_church/"
      ]
    }
    </script>
    <script type="application/ld+json">
    [
      {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "Sunday Gathering",
        "description": "All-age Sunday church service at Coopers Edge Community Church. We gather weekly to worship, learn from the Bible, and share life together.",
        "location": {
          "@type": "Place",
          "name": "@TheEdge Community Centre",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Typhoon Way",
            "addressLocality": "Brockworth",
            "addressRegion": "Gloucester",
            "postalCode": "GL3 4DY",
            "addressCountry": "GB"
          }
        },
        "organizer": {
          "@type": "Organization",
          "name": "Coopers Edge Community Church",
          "url": "https://cecommunitychurch.com"
        },
        "eventSchedule": {
          "@type": "Schedule",
          "byDay": "https://schema.org/Sunday",
          "startTime": "16:00",
          "endTime": "18:00",
          "scheduleTimezone": "Europe/London"
        },
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode"
      },
      {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "The Ark Toddler Group",
        "description": "A warm, welcoming space for families with toddlers. Free play, snacks, a short Bible story, and songs. Every Wednesday at @TheEdge Community Centre, Brockworth.",
        "location": {
          "@type": "Place",
          "name": "@TheEdge Community Centre",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Typhoon Way",
            "addressLocality": "Brockworth",
            "addressRegion": "Gloucester",
            "postalCode": "GL3 4DY",
            "addressCountry": "GB"
          }
        },
        "organizer": {
          "@type": "Organization",
          "name": "Coopers Edge Community Church",
          "url": "https://cecommunitychurch.com"
        },
        "eventSchedule": {
          "@type": "Schedule",
          "byDay": "https://schema.org/Wednesday",
          "scheduleTimezone": "Europe/London"
        },
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode"
      },
      {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "Prayer Meeting",
        "description": "Online prayer gathering on the first Wednesday of each month, 8–9pm via Zoom. Open to everyone.",
        "organizer": {
          "@type": "Organization",
          "name": "Coopers Edge Community Church",
          "url": "https://cecommunitychurch.com"
        },
        "eventSchedule": {
          "@type": "Schedule",
          "byDay": "https://schema.org/Wednesday",
          "byMonthWeek": 1,
          "startTime": "20:00",
          "endTime": "21:00",
          "scheduleTimezone": "Europe/London"
        },
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode"
      }
    ]
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cecommunitychurch.com/" },
        { "@type": "ListItem", "position": 2, "name": "What's On", "item": "https://cecommunitychurch.com/whats-on.html" }
      ]
    }
    </script>
  </head>
  ```

- [ ] **Step 3: Verify three JSON-LD blocks are present**

  Run: `grep -c 'application/ld+json' whats-on.html`
  Expected: `3`

- [ ] **Step 4: Commit**

  ```bash
  git add whats-on.html
  git commit -m "feat(seo): add canonical, OG meta, and JSON-LD to whats-on.html"
  ```

---

## Task 5: giving.html — canonical, OG/Twitter meta, JSON-LD, updated description

**Files:**
- Modify: `giving.html` (head section)

- [ ] **Step 1: Update description and add canonical + OG/Twitter meta**

  In `giving.html`, find and replace:

  ```html
    <meta name="description" content="Support Coopers Edge Community Church through online giving, bank transfer, or Gift Aid. Every gift makes a difference.">
  ```

  Replace with:

  ```html
    <meta name="description" content="Support Coopers Edge Community Church, Gloucester through online giving, bank transfer, or Gift Aid. Every gift makes a difference.">
    <link rel="canonical" href="https://cecommunitychurch.com/giving.html">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://cecommunitychurch.com/giving.html">
    <meta property="og:title" content="Giving — Coopers Edge Community Church">
    <meta property="og:description" content="Support Coopers Edge Community Church, Gloucester through online giving, bank transfer, or Gift Aid.">
    <meta property="og:site_name" content="Coopers Edge Community Church">
    <meta property="og:locale" content="en_GB">
    <meta property="og:image" content="https://cecommunitychurch.com/images/logo-wide.png">
    <meta property="og:image:width" content="768">
    <meta property="og:image:height" content="192">
    <meta property="og:image:alt" content="Coopers Edge Community Church logo">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="Giving — Coopers Edge Community Church">
    <meta name="twitter:description" content="Support Coopers Edge Community Church, Gloucester through online giving, bank transfer, or Gift Aid.">
    <meta name="twitter:image" content="https://cecommunitychurch.com/images/logo-wide.png">
  ```

- [ ] **Step 2: Add JSON-LD Church + Breadcrumb schema just before `</head>`**

  In `giving.html`, find and replace:

  ```html
    <link rel="stylesheet" href="css/style.css">
  </head>
  ```

  Replace with:

  ```html
    <link rel="stylesheet" href="css/style.css">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": ["Church", "PlaceOfWorship"],
      "name": "Coopers Edge Community Church",
      "url": "https://cecommunitychurch.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://cecommunitychurch.com/images/logo-wide.png",
        "width": 768,
        "height": 192
      },
      "image": "https://cecommunitychurch.com/images/logo-wide.png",
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
        "closes": "18:00"
      },
      "areaServed": "Coopers Edge, Gloucester, Gloucestershire",
      "sameAs": [
        "https://www.facebook.com/people/Coopers-Edge-Community-Church/61555806122654/",
        "https://www.instagram.com/coopers_edge_community_church/"
      ]
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cecommunitychurch.com/" },
        { "@type": "ListItem", "position": 2, "name": "Giving", "item": "https://cecommunitychurch.com/giving.html" }
      ]
    }
    </script>
  </head>
  ```

- [ ] **Step 3: Verify JSON-LD blocks are present**

  Run: `grep -c 'application/ld+json' giving.html`
  Expected: `2`

- [ ] **Step 4: Commit**

  ```bash
  git add giving.html
  git commit -m "feat(seo): add canonical, OG meta, and JSON-LD to giving.html"
  ```

---

## Task 6: safeguarding.html — canonical, OG/Twitter meta, JSON-LD

**Files:**
- Modify: `safeguarding.html` (head section)

- [ ] **Step 1: Add canonical + OG/Twitter meta after existing description**

  In `safeguarding.html`, find and replace:

  ```html
    <meta name="description" content="Contact information for safeguarding enquiries at Coopers Edge Community Church.">
  ```

  Replace with:

  ```html
    <meta name="description" content="Contact information for safeguarding enquiries at Coopers Edge Community Church.">
    <link rel="canonical" href="https://cecommunitychurch.com/safeguarding.html">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://cecommunitychurch.com/safeguarding.html">
    <meta property="og:title" content="Safeguarding — Coopers Edge Community Church">
    <meta property="og:description" content="Contact information for safeguarding enquiries at Coopers Edge Community Church.">
    <meta property="og:site_name" content="Coopers Edge Community Church">
    <meta property="og:locale" content="en_GB">
    <meta property="og:image" content="https://cecommunitychurch.com/images/logo-wide.png">
    <meta property="og:image:width" content="768">
    <meta property="og:image:height" content="192">
    <meta property="og:image:alt" content="Coopers Edge Community Church logo">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="Safeguarding — Coopers Edge Community Church">
    <meta name="twitter:description" content="Contact information for safeguarding enquiries at Coopers Edge Community Church.">
    <meta name="twitter:image" content="https://cecommunitychurch.com/images/logo-wide.png">
  ```

- [ ] **Step 2: Add JSON-LD Church + Breadcrumb schema just before `</head>`**

  In `safeguarding.html`, find and replace:

  ```html
    <link rel="stylesheet" href="css/style.css">
  </head>
  ```

  Replace with:

  ```html
    <link rel="stylesheet" href="css/style.css">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": ["Church", "PlaceOfWorship"],
      "name": "Coopers Edge Community Church",
      "url": "https://cecommunitychurch.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://cecommunitychurch.com/images/logo-wide.png",
        "width": 768,
        "height": 192
      },
      "image": "https://cecommunitychurch.com/images/logo-wide.png",
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
        "closes": "18:00"
      },
      "areaServed": "Coopers Edge, Gloucester, Gloucestershire",
      "sameAs": [
        "https://www.facebook.com/people/Coopers-Edge-Community-Church/61555806122654/",
        "https://www.instagram.com/coopers_edge_community_church/"
      ]
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cecommunitychurch.com/" },
        { "@type": "ListItem", "position": 2, "name": "Safeguarding", "item": "https://cecommunitychurch.com/safeguarding.html" }
      ]
    }
    </script>
  </head>
  ```

- [ ] **Step 3: Verify JSON-LD blocks are present**

  Run: `grep -c 'application/ld+json' safeguarding.html`
  Expected: `2`

- [ ] **Step 4: Commit**

  ```bash
  git add safeguarding.html
  git commit -m "feat(seo): add canonical, OG meta, and JSON-LD to safeguarding.html"
  ```

---

## Task 7: privacy.html — canonical, OG/Twitter meta, JSON-LD

**Files:**
- Modify: `privacy.html` (head section)

- [ ] **Step 1: Add canonical + OG/Twitter meta after existing description**

  In `privacy.html`, find and replace:

  ```html
    <meta name="description" content="How Coopers Edge Community Church handles your personal data, and our GDPR compliance policies.">
  ```

  Replace with:

  ```html
    <meta name="description" content="How Coopers Edge Community Church handles your personal data, and our GDPR compliance policies.">
    <link rel="canonical" href="https://cecommunitychurch.com/privacy.html">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://cecommunitychurch.com/privacy.html">
    <meta property="og:title" content="Privacy &amp; Terms — Coopers Edge Community Church">
    <meta property="og:description" content="How Coopers Edge Community Church handles your personal data and our GDPR compliance policies.">
    <meta property="og:site_name" content="Coopers Edge Community Church">
    <meta property="og:locale" content="en_GB">
    <meta property="og:image" content="https://cecommunitychurch.com/images/logo-wide.png">
    <meta property="og:image:width" content="768">
    <meta property="og:image:height" content="192">
    <meta property="og:image:alt" content="Coopers Edge Community Church logo">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="Privacy &amp; Terms — Coopers Edge Community Church">
    <meta name="twitter:description" content="How Coopers Edge Community Church handles your personal data and our GDPR compliance policies.">
    <meta name="twitter:image" content="https://cecommunitychurch.com/images/logo-wide.png">
  ```

- [ ] **Step 2: Add JSON-LD Church schema just before `</head>`**

  In `privacy.html`, find and replace:

  ```html
    <link rel="stylesheet" href="css/style.css">
    <style>
  ```

  Replace with:

  ```html
    <link rel="stylesheet" href="css/style.css">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": ["Church", "PlaceOfWorship"],
      "name": "Coopers Edge Community Church",
      "url": "https://cecommunitychurch.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://cecommunitychurch.com/images/logo-wide.png",
        "width": 768,
        "height": 192
      },
      "image": "https://cecommunitychurch.com/images/logo-wide.png",
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
        "closes": "18:00"
      },
      "areaServed": "Coopers Edge, Gloucester, Gloucestershire",
      "sameAs": [
        "https://www.facebook.com/people/Coopers-Edge-Community-Church/61555806122654/",
        "https://www.instagram.com/coopers_edge_community_church/"
      ]
    }
    </script>
    <style>
  ```

- [ ] **Step 3: Verify JSON-LD is present**

  Run: `grep -c 'application/ld+json' privacy.html`
  Expected: `1`

- [ ] **Step 4: Commit**

  ```bash
  git add privacy.html
  git commit -m "feat(seo): add canonical, OG meta, and JSON-LD to privacy.html"
  ```

---

## Task 8: Google Business Profile guide

**Files:**
- Create: `docs/google-business-profile-guide.md`

- [ ] **Step 1: Create the guide**

  Create `/Users/chris/cecc-website/docs/google-business-profile-guide.md` with this content:

  ````markdown
  # Setting Up a Google Business Profile for Coopers Edge Community Church

  A Google Business Profile (GBP) is the listing that appears in Google Maps and the "local pack" — the box of 3 results that shows at the top of searches like "church near me" or "church Coopers Edge". Setting one up is free and is the single most impactful action for local search visibility.

  ---

  ## Step 1: Create the profile

  1. Go to [business.google.com](https://business.google.com) and sign in with a Google account the church controls (ideally a shared account, not a personal one).
  2. Click **Add your business**.
  3. Enter the business name: **Coopers Edge Community Church**
  4. When asked for a category, search for and select **Church**.
  5. When asked for a location, enter: **Typhoon Way, Brockworth, Gloucester GL3 4DY**
  6. Add the service area as **Coopers Edge** and **Gloucester** if prompted.

  ---

  ## Step 2: Add contact and website details

  - **Website:** `https://cecommunitychurch.com`
  - **Email:** `info@cecommunitychurch.com`
  - **Phone:** Add if the church has one (not required)
  - **Description:** Use this text (under 750 characters):
    > Coopers Edge Community Church is a friendly, all-age Christian community in Coopers Edge, Gloucestershire. We meet every Sunday at 4pm at @TheEdge Community Centre, Typhoon Way, Brockworth. Everyone is welcome — whether you're new to faith or have been following Jesus for years. Part of the Diocese of Gloucester.

  ---

  ## Step 3: Add opening hours

  Set hours for **Sunday: 4:00 PM – 6:00 PM**.

  If the profile asks about other days, you can add Wednesday hours for The Ark Toddler Group.

  ---

  ## Step 4: Upload photos

  Upload at least 3 photos:
  - The exterior of @TheEdge Community Centre
  - A photo of the congregation during a service (if available)
  - The church logo (`images/logo-wide.png` from this repo)

  Photos significantly improve click-through rate from Google Maps results.

  ---

  ## Step 5: Verify the listing

  Google requires verification to make the listing live. Options vary by account:
  - **Postcard by mail** — Google sends a card to the church address with a verification code (arrives in ~5 days). Enter the code in Google Business Manager.
  - **Phone or email verification** — may be offered instantly for some accounts.
  - **Video verification** — Google may ask you to record a short video of the premises.

  Complete verification as soon as possible — the listing is not publicly visible until verified.

  ---

  ## Step 6: Ongoing maintenance

  Once live, a few habits will keep the listing working hard:

  - **Encourage reviews.** Ask regular attendees to leave a Google review. Even 5–10 reviews make a significant difference to how prominently the listing appears.
  - **Post updates.** Use the "Add update" feature to post about special events (Christmas, Easter, community events). Posts appear directly on the listing.
  - **Keep hours accurate.** Update hours for bank holidays or when services change time.
  - **Respond to reviews.** A brief, warm response to every review (positive or negative) signals an active, cared-for listing.

  ---

  ## Important: NAP consistency

  "NAP" stands for Name, Address, Phone — the three contact signals Google uses to verify a business is real. The name and address on your Google Business Profile must **exactly match** what appears on the website and in the JSON-LD structured data already added to the site:

  - Name: **Coopers Edge Community Church**
  - Address: **Typhoon Way, Brockworth, Gloucester GL3 4DY**
  ````

- [ ] **Step 2: Commit**

  ```bash
  git add docs/google-business-profile-guide.md
  git commit -m "docs: add Google Business Profile setup guide"
  ```

---

## Post-implementation verification

After all tasks are complete, run this final check to confirm every page has the required signals:

```bash
for f in index.html about.html whats-on.html giving.html safeguarding.html privacy.html; do
  echo "=== $f ==="
  echo "canonical: $(grep -c 'rel="canonical"' $f)"
  echo "og:url:    $(grep -c 'og:url' $f)"
  echo "og:image:  $(grep -c 'og:image"' $f)"
  echo "ld+json:   $(grep -c 'ld+json' $f)"
done
```

Expected output: every page shows `canonical: 1`, `og:url: 1`, `og:image: 1`, and `ld+json: 1` (index.html and whats-on.html will show higher counts for ld+json).

Once deployed, validate the homepage structured data using Google's Rich Results Test: `https://search.google.com/test/rich-results` (paste `https://cecommunitychurch.com` into the URL field).
