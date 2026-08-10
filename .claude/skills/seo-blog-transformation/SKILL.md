---
name: SEO Blog Transformation
description: Transform an existing HTML blog post (in this project's posts/ folder or elsewhere) into a substantially improved, original, SEO-optimized article while preserving its focus keyword, search intent, and URL. Use when the user asks to rewrite, regenerate, optimize, or improve an existing blog post's SEO, fix an existing article, or process a new raw HTML post file dropped into posts/ (e.g. scraped/AI-generated content that needs cleanup). Also handles featured-image matching from /assets/images/FeatureImagePost/ and automatic PNG-to-WebP conversion for featured images.
---

# SEO Blog Transformation Skill for Claude Code

## ROLE

You are an expert SEO content editor, technical SEO specialist, HTML developer, and content optimizer.

Your job is to transform an existing HTML blog post into a substantially improved, original, useful, and SEO-optimized article while preserving the original search intent and primary focus keyword.

The input will normally be an existing `.html` blog post.

IMPORTANT:

* Do NOT simply paraphrase sentence by sentence.
* Do NOT only replace words with synonyms.
* Rebuild and improve the article structure and wording.
* Preserve factual accuracy.
* Do not invent statistics, claims, quotes, studies, prices, dates, or sources.
* Do not intentionally create content designed to deceive search engines or bypass spam/duplicate-content systems.
* The goal is to create genuinely differentiated, higher-quality content.

---

# INPUT

The user will provide an existing HTML blog post, for example:

`post.html`

The file may already contain:

* `<title>`
* meta description
* headings
* paragraphs
* images
* links
* tables
* lists
* schema
* CSS classes
* internal links
* external links

Before modifying anything:

1. Read the entire HTML file.
2. Understand the topic.
3. Identify the primary focus keyword.
4. Identify secondary keywords and related entities.
5. Identify the article's search intent.
6. Identify the current H1/H2/H3 structure.
7. Identify existing internal links.
8. Identify existing external links.
9. Identify all images and their current ALT attributes.
10. Identify missing SEO elements.
11. Identify weak, repetitive, thin, outdated, or generic sections.

---

# MAIN OBJECTIVE

Transform the existing article into a substantially improved version.

The final article should:

* Keep the same main topic.
* Keep the same search intent.
* Preserve the primary focus keyword.
* Use natural keyword placement.
* Have a substantially different structure and wording where appropriate.
* Add useful information where it genuinely improves the article.
* Remove unnecessary repetition.
* Improve readability.
* Improve semantic SEO.
* Improve internal linking.
* Improve external references.
* Improve image SEO.
* Add a professional Table of Contents.
* Improve title and meta description.
* Improve heading hierarchy.
* Improve user experience.

---

# 1. FOCUS KEYWORD

FIRST identify the article's primary focus keyword.

If the existing HTML clearly contains a focus keyword, preserve it.

If it is not explicitly provided, infer the most likely primary keyword from:

* `<title>`
* `<h1>`
* existing meta description
* article topic
* URL slug
* repeated natural terminology

Do NOT change the primary keyword unnecessarily.

Use the focus keyword naturally in:

* SEO title
* meta description
* H1
* introduction
* at least one relevant H2 where natural
* body content
* conclusion where natural
* image ALT where the image actually relates to the keyword

Do NOT keyword stuff.

Never force the keyword into every heading.

---

# 2. SEO TITLE

Create an improved SEO title.

Requirements:

* Focus keyword should appear naturally.
* Make it compelling.
* Avoid clickbait.
* Avoid unnecessary repetition.
* Prefer a concise title suitable for Google search results.
* Keep the title aligned with the actual article.

Update:

`<title>`

Also update the Open Graph title if present.

---

# 3. META DESCRIPTION

Create a new meta description.

Requirements:

* Approximately 140–160 characters when practical.
* Include the focus keyword naturally.
* Clearly communicate what the reader will learn.
* Encourage clicks without clickbait.
* Make it unique to this article.

Update:

```html
<meta name="description" content="...">
```

If an existing meta description exists, replace it.

If none exists, create one.

Also update relevant Open Graph/Twitter description tags when present.

---

# 4. ARTICLE STRUCTURE

Rebuild the article structure when necessary.

Use a logical hierarchy:

H1
H2
H3

There must normally be:

* One primary H1.
* Multiple useful H2 sections where appropriate.
* H3 sections only when they improve organization.

Do not create headings just to increase keyword density.

The structure should match the user's search intent.

---

# 5. INTRODUCTION

Rewrite the introduction completely when necessary.

The introduction should:

* Immediately explain what the article covers.
* Address the user's search intent.
* Naturally mention the focus keyword.
* Avoid generic AI-style introductions.
* Avoid unnecessary filler.
* Give the reader a reason to continue.

Prefer concise, useful introductions.

---

# 6. TABLE OF CONTENTS

Add a professional Table of Contents near the beginning of the article, preferably after the introduction or immediately before the main content.

Example:

```html
<nav class="table-of-contents" aria-label="Table of Contents">
  <h2>Table of Contents</h2>
  <ul>
    <li><a href="#section-one">Section One</a></li>
    <li><a href="#section-two">Section Two</a></li>
    <li><a href="#section-three">Section Three</a></li>
  </ul>
</nav>
```

Requirements:

* Automatically derive entries from important H2 sections.
* Every TOC link must point to an existing ID.
* IDs must be unique.
* Do not include the H1.
* Do not include every minor H3.
* Use readable anchor text.
* Do not break existing CSS.

If the website already has a TOC style, preserve and reuse it.

If there is no existing style, use clean semantic HTML and minimal inline styling only when necessary.

---

# 7. CONTENT REWRITING

Do NOT perform simple synonym replacement.

Instead:

1. Understand the original section.
2. Identify its purpose.
3. Rewrite it naturally.
4. Improve the explanation.
5. Change sentence structure.
6. Reorganize paragraphs when beneficial.
7. Add useful context where appropriate.
8. Remove redundant information.
9. Improve transitions.
10. Make the article feel naturally written.

The resulting article should read like a new editorial version, not a thesaurus-generated version.

Avoid repetitive phrases such as:

* "In today's digital world..."
* "In this comprehensive guide..."
* "Whether you're..."
* "It's important to note..."
* "Let's dive in..."
* "In conclusion..."

unless they genuinely fit the article.

---

# 8. ADD USEFUL CONTENT

Where appropriate, improve the article with genuinely useful sections such as:

* Key points
* Comparison table
* Features
* Pros and cons
* How it works
* Important considerations
* Common mistakes
* FAQ
* Practical tips
* Alternatives
* Updated information

Only add information that is relevant and supportable.

NEVER fabricate facts simply to make the article longer.

Quality is more important than word count.

---

# 9. INTERNAL LINKS

Analyze the existing website structure.

Add relevant internal links where they genuinely help the reader.

Rules:

* Prefer contextual links inside paragraphs.
* Use descriptive anchor text.
* Do not use "click here" unnecessarily.
* Do not repeat the exact same anchor text excessively.
* Do not create irrelevant internal links.
* Do not link every paragraph.
* Preserve useful existing internal links.
* Replace weak or generic anchor text when appropriate.

Example:

```html
<a href="/related-article">relevant descriptive anchor text</a>
```

IMPORTANT:

Do not invent URLs.

Before adding an internal link, inspect the website/project files and identify real existing URLs whenever possible.

If a relevant article exists in the project, use its real URL.

---

# 10. EXTERNAL LINKS

Improve external references when useful.

Use authoritative and relevant sources.

Good examples can include:

* Official organizations
* Official product documentation
* Government websites
* Universities
* Recognized industry organizations
* Original research
* Official company pages when appropriate

Rules:

* Do not add random external links.
* Do not add links simply for SEO.
* Do not link to low-quality websites.
* Do not invent URLs.
* Verify that the target exists whenever possible.
* Use descriptive anchor text.
* Keep external links relevant to the specific statement.

When appropriate:

```html
<a href="https://example.com"
   target="_blank"
   rel="noopener noreferrer">
   descriptive anchor text
</a>
```

Do not automatically add `nofollow` to every external link.

---

# 11. IMAGES

Inspect every image in the article.

For each relevant image:

* Add or improve ALT text.
* Make ALT descriptive.
* Describe what the image actually shows.
* Include the focus keyword only when naturally relevant.
* Never keyword stuff ALT attributes.
* Never use the same ALT text for multiple unrelated images.

Bad:

```html
alt="best IPTV best IPTV 2026 IPTV service"
```

Good:

```html
alt="Smart TV showing an IPTV channel guide"
```

Also check:

* missing `alt`
* empty `alt`
* broken image paths
* meaningless filenames where practical
* missing width/height when appropriate
* lazy loading where appropriate

Do not alter image URLs unless necessary.

---

# 12. IMAGE SEO

Where appropriate, improve:

```html
<img
  src="..."
  alt="..."
  width="..."
  height="..."
  loading="lazy">
```

For the main/hero image, do NOT blindly use lazy loading if it is the primary above-the-fold image.

Preserve existing image classes and styling.

---

# 13. LINKS AND ANCHORS

Check every link.

Detect:

* broken internal links
* empty hrefs
* incorrect relative paths
* duplicated links
* irrelevant anchors
* poor anchor text

Do not modify links unless there is a clear reason.

---

# 14. FAQ SECTION

If the topic naturally supports FAQs, add a useful FAQ section near the end.

Example:

```html
<section id="faq">
  <h2>Frequently Asked Questions</h2>

  <h3>Question?</h3>
  <p>Clear answer...</p>

  <h3>Question?</h3>
  <p>Clear answer...</p>
</section>
```

Do not create fake FAQs just to increase word count.

Questions should reflect realistic user searches.

If FAQ structured data already exists, update it to match the visible FAQ content.

Never create schema content that is not visible on the page.

---

# 15. SCHEMA

Inspect existing structured data.

Preserve valid schema.

Where appropriate, improve:

* Article
* BlogPosting
* BreadcrumbList
* FAQPage only when appropriate and compliant with Google's guidelines

Ensure structured data matches visible page content.

Never invent:

* author identities
* publication dates
* ratings
* reviews
* prices
* organizations
* facts

Do not create fake review/rating schema.

---

# 16. CANONICAL

Check the canonical URL.

Ensure:

```html
<link rel="canonical" href="...">
```

points to the correct canonical version of the current article.

Do not point the canonical to another article simply to solve duplicate-content concerns.

---

# 17. OPEN GRAPH

If Open Graph metadata exists, update:

```html
<meta property="og:title">
<meta property="og:description">
<meta property="og:url">
<meta property="og:image">
```

Make sure they correspond to the current article.

Also inspect Twitter/X metadata:

```html
<meta name="twitter:title">
<meta name="twitter:description">
<meta name="twitter:image">
```

---

# 18. URL / SLUG

DO NOT automatically change the existing URL slug.

If the article is already indexed by Google, preserving the existing URL is normally preferable.

Do not create unnecessary redirects.

The objective is to improve the content at the existing URL.

---

# 19. EXISTING SEO VALUE

Preserve valuable elements such as:

* focus keyword
* search intent
* existing indexed URL
* valuable internal links
* useful external references
* accurate facts
* important entities
* relevant headings
* useful images

Do not destroy existing SEO structure just for the sake of making the HTML different.

---

# 20. HTML INTEGRITY

This is extremely important.

Do not break the website.

Preserve:

* `<html>`
* `<head>`
* `<body>`
* CSS references
* JavaScript references
* existing classes
* responsive design
* navigation
* footer
* header
* analytics
* ads
* scripts
* existing components

Do not remove existing functionality unless explicitly requested.

Validate:

* HTML tags are correctly closed.
* Attributes are correctly quoted.
* IDs are unique.
* Internal anchors work.
* Links are valid.
* No accidental duplicate `<title>`.
* No accidental duplicate meta description.
* No malformed HTML.

---

# 21. DESIGN

Do not redesign the entire website.

Keep the existing visual identity.

Only improve article-specific components when necessary:

* Table of Contents
* comparison tables
* callout boxes
* FAQ
* lists
* readability

The article must still look like part of the same website.

---

# 22. CONTENT DIFFERENTIATION

The article should be substantially improved rather than mechanically rewritten.

Use:

* different organization
* different explanations
* different examples where appropriate
* improved information hierarchy
* clearer terminology
* better transitions
* stronger introduction
* useful additional sections
* better conclusion

Do NOT deliberately insert meaningless changes simply to make the page appear different to Google.

The goal is genuine editorial improvement.

---

# 23. FINAL SEO CHECK

Before finishing, verify:

[ ] Focus keyword preserved
[ ] Search intent preserved
[ ] SEO title updated
[ ] Meta description updated
[ ] One H1
[ ] Logical H2/H3 hierarchy
[ ] Table of Contents added
[ ] TOC anchors work
[ ] Internal links improved
[ ] No invented internal URLs
[ ] Relevant external links added/improved
[ ] No invented external URLs
[ ] Images inspected
[ ] ALT attributes improved
[ ] Canonical checked
[ ] Open Graph checked
[ ] Twitter metadata checked
[ ] Schema checked
[ ] FAQ added only when useful
[ ] No keyword stuffing
[ ] No fake claims
[ ] No fake statistics
[ ] No fake reviews
[ ] No broken HTML
[ ] Existing website design preserved
[ ] Existing URL preserved

---

# 24. IMPORTANT WORKFLOW

When I give you:

`post.html`

DO NOT immediately start replacing random text.

First analyze the complete document.

Then:

### STEP 1

Identify SEO information.

### STEP 2

Analyze the current content.

### STEP 3

Analyze the website's existing articles/links when available.

### STEP 4

Create a better content structure.

### STEP 5

Rewrite and improve the article.

### STEP 6

Optimize metadata.

### STEP 7

Add Table of Contents.

### STEP 8

Improve internal and external links.

### STEP 9

Optimize images and ALT text.

### STEP 10

Check schema/canonical/social metadata.

### STEP 11

Validate HTML.

### STEP 12

Save the final result back to the original `.html` file unless instructed otherwise.

---

# 25. OUTPUT

After completing the transformation:

1. Save the improved HTML.
2. Do not create unnecessary duplicate files.
3. Do not change the filename unless requested.
4. Provide a concise summary of what was changed.

Example:

```text
SEO transformation completed.

Focus keyword:
...

Updated:
✔ SEO title
✔ Meta description
✔ Content structure
✔ Table of Contents
✔ Internal links
✔ External references
✔ Image ALT text
✔ Open Graph metadata
✔ Schema
✔ FAQ
✔ HTML validation
```

Do not claim that Google will index the page, rank it, or consider it unique.

The purpose is to produce a genuinely improved, useful, technically sound, SEO-optimized article.

# 26. FEATURE IMAGE MANAGEMENT

The website uses a dedicated directory for blog featured images:

`/assets/images/FeatureImagePost/`

This directory contains the featured images used by blog posts.

## FEATURE IMAGE RULES

When processing a blog post:

1. Identify the current article's:

   * filename
   * URL slug
   * title
   * primary focus keyword

2. Inspect:

`/assets/images/FeatureImagePost/`

3. Search for an image that clearly belongs to the current article.

4. Prefer exact filename/slug matches.

Example:

```text
Article:
best-iptv-2026.html

Preferred image:

/assets/images/FeatureImagePost/best-iptv-2026.webp
```

5. If an exact slug match does not exist, look for a strongly related filename based on:

   * article slug
   * article title
   * primary focus keyword

6. NEVER use an unrelated image simply because it exists in the directory.

7. NEVER invent an image filename.

8. NEVER reference an image that does not exist.

9. If no suitable featured image exists, report:

```text
No suitable featured image found in:
/assets/images/FeatureImagePost/
```

Do not create a fake image path.

---

## FEATURE IMAGE HTML

If a valid featured image exists, make sure the article uses it as the primary/featured image according to the website's existing HTML structure.

Example:

```html
<img
  src="/assets/images/FeatureImagePost/best-iptv-2026.webp"
  alt="Best IPTV services in 2026"
  width="1200"
  height="630">
```

IMPORTANT:

Preserve the website's existing image classes, wrappers, CSS, and layout.

Do not redesign the image component.

---

## FEATURE IMAGE ALT TEXT

Generate descriptive ALT text based on what the image actually represents.

Rules:

* Describe the actual image.
* Keep it natural.
* Include the focus keyword only when appropriate.
* Never keyword stuff.
* Never use the filename as ALT text unless it is genuinely descriptive.
* Do not use generic ALT text such as:

  * "image"
  * "featured image"
  * "blog image"
  * "best image"

Example:

GOOD:

```html
alt="Best IPTV services and streaming devices in 2026"
```

BAD:

```html
alt="best IPTV best IPTV 2026 IPTV IPTV service"
```

---

## IMAGE FORMAT PRIORITY

Prefer existing image formats in this order when equivalent files exist:

1. `.webp`
2. `.avif`
3. `.jpg`
4. `.jpeg`
5. `.png`

Do not convert images unless explicitly requested.

---

## IMAGE DIMENSIONS

Inspect the actual image dimensions when possible.

Use the correct:

```html
width="..."
height="..."
```

Do not invent dimensions.

If the website already uses a standardized featured-image size, preserve that convention.

---

## HERO IMAGE

If the existing article has a hero/featured image:

* Keep it as the main image.
* Make sure it points to the correct image from `/assets/images/FeatureImagePost/`.
* Keep existing CSS classes.
* Keep responsive behavior.
* Do not lazy-load the main above-the-fold image unless the existing website intentionally does so.

---

## SOCIAL IMAGE

If Open Graph metadata exists, use the same valid featured image where appropriate:

```html
<meta property="og:image"
      content="/assets/images/FeatureImagePost/best-iptv-2026.webp">
```

If the website uses absolute URLs for Open Graph images, preserve that convention.

Also update Twitter/X image metadata if present:

```html
<meta name="twitter:image"
      content="/assets/images/FeatureImagePost/best-iptv-2026.webp">
```

Do not create a new social image if a valid featured image already exists.

---

## IMAGE MATCHING PRIORITY

When choosing the featured image, use this priority:

### Priority 1 — Exact slug match

```text
best-iptv-2026.html
```

→

```text
best-iptv-2026.webp
```

### Priority 2 — Exact slug with different extension

```text
best-iptv-2026.jpg
best-iptv-2026.png
```

### Priority 3 — Strong title match

If the article is:

```text
Best IPTV Services for Smart TV in 2026
```

look for:

```text
best-iptv-smart-tv-2026.webp
```

### Priority 4 — Focus keyword match

Use an image containing the primary topic/keyword in its filename.

### Otherwise

Do not guess.

Report that no suitable featured image was found.

---

## DO NOT DUPLICATE FEATURE IMAGES

Before adding a new featured image:

* Check whether the article already contains a valid featured image.
* Check whether it already points to `/assets/images/FeatureImagePost/`.
* Do not add a second featured image.
* Do not duplicate the same image unnecessarily.

---

## IMAGE AUDIT

For every image in the article, check:

[ ] Image exists
[ ] Correct path
[ ] Correct featured image
[ ] ALT exists
[ ] ALT describes the image
[ ] No keyword stuffing
[ ] Width exists when appropriate
[ ] Height exists when appropriate
[ ] Main image is not unnecessarily lazy-loaded
[ ] Open Graph image is correct
[ ] Twitter image is correct

---

## FINAL FEATURE IMAGE REPORT

After processing the article, report:

```text
Featured image:
✔ Found

File:
/assets/images/FeatureImagePost/best-iptv-2026.webp

Used as:
✔ Hero / Featured Image
✔ Open Graph Image
✔ Twitter Image

ALT:
"Best IPTV services in 2026"
```

If no suitable image exists:

```text
Featured image:
⚠ No suitable image found

Checked:
/assets/images/FeatureImagePost/

No image path was invented.
```

# 28. PROJECT-SPECIFIC ADAPTATION NOTES

This project (GetTV.online) does not use a raw-HTML blog architecture. Its blog system
(see `build-blog.js`, `posts/_TEMPLATE.html`, and `blog-post.html`) works like this:

* Each post source file lives at `posts/{slug}.html` and contains ONLY:
  - a `<script type="application/json" id="post-frontmatter">` block (title, description,
    author, publishDate, category, featuredImage)
  - a `<template id="post-body">...</template>` block with the article's raw body HTML
    (no `<html>`/`<head>`/`<body>`, no header/footer, no full-page SEO tags)
* `build-blog.js` reads that source file at build time and generates the full page
  (title, meta description, canonical, Open Graph/Twitter tags, Article JSON-LD, and the
  shared site header/footer) automatically at `public/{slug}.html`, served at
  `gettv.online/{slug}` (site root, not `/blog/`).
* The filename (minus `.html`) becomes the URL slug — it must be lowercase and
  hyphen-separated, and must not collide with an existing top-level page (see the
  reserved-slug list in `build-blog.js`).

When this skill is applied in this project, adapt accordingly:

* Treat the **frontmatter fields** (title, description) as the equivalent of this skill's
  SEO title / meta description instructions — edit those JSON fields rather than raw
  `<title>`/`<meta>` tags.
* Treat the **`<template id="post-body">` contents** as the article body to rewrite per
  sections 4–14 of this skill (structure, intro, TOC, content rewriting, internal/external
  links, images, FAQ). Headings inside start at `<h2>` (the page's own `<h1>` is generated
  from the frontmatter `title` by `build-blog.js`, so do not add a second `<h1>` inside the body).
  A Table of Contents (section 6) is optional here since posts are typically short guides —
  add one only for genuinely long, multi-section articles.
* **Featured image directory override**: this project does not have
  `/assets/images/FeatureImagePost/`. Use `/assets/images/` directly (the site's existing
  image library) for slug/title/keyword matches, following the same matching priority and
  "never invent a path, never use an unrelated image" rules from section 26. If nothing
  suitable exists, report that clearly rather than guessing — do not default to an unrelated
  image (this project's `/assets/images/gettvonline.webp` looks like a generic promotional
  photo by its name but is actually an unrelated fabricated movie poster; verify by opening
  the image, don't trust the filename alone).
* Schema/canonical/Open Graph (sections 15–17) are handled automatically by
  `build-blog.js` from the frontmatter and do not need manual `<script type="application/ld+json">`
  or `<meta>` edits inside the post source file itself.
* After editing a post, run `npm run vercel-build` to confirm it builds without errors
  (the build fails loudly on missing frontmatter fields or slug collisions — treat a build
  failure as a signal to fix the post file, not to bypass the check).
