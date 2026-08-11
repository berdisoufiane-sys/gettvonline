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

# 6. TABLE OF CONTENTS — MANDATORY

A Table of Contents (TOC) is REQUIRED for every blog article.

The TOC must NEVER be omitted.

## RULE 1 — IF A TOC ALREADY EXISTS

If the HTML already contains a Table of Contents:

* DO NOT create a second TOC.
* DO NOT remove the existing TOC.
* Preserve its existing CSS classes and visual design.
* Improve and update it when necessary.
* Make sure it reflects the final H2 structure.
* Fix broken anchor links.
* Fix missing or incorrect IDs.
* Remove duplicate TOC entries.
* Keep the TOC in a logical position near the beginning of the article.

The existing TOC must remain visually consistent with the website.

---

## RULE 2 — IF NO TOC EXISTS

If the article does NOT contain a Table of Contents:

**YOU MUST CREATE ONE.**

Do not skip this step.

Add the TOC near the beginning of the article, normally after the introduction or in the position used by the website's other articles.

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

---

## RULE 3 — BUILD THE TOC FROM THE FINAL CONTENT

The TOC must be generated from the article's FINAL heading structure.

Do not create the TOC before the content structure is finalized.

Include:

* important H2 headings
* H3 headings only when they represent meaningful subsections

Normally, do NOT include:

* H1
* tiny subsections
* navigation headings
* footer headings
* unrelated page headings
* FAQ questions

unless the website's existing TOC convention explicitly includes them.

---

## RULE 4 — UNIQUE ANCHOR IDS

Every TOC destination must have a unique ID.

Example:

```html
<h2 id="best-options">Best Options</h2>
```

TOC:

```html
<a href="#best-options">Best Options</a>
```

Requirements:

* IDs must be unique.
* IDs must be stable.
* IDs should be readable.
* IDs should normally use lowercase kebab-case.
* Do not create duplicate IDs.
* Do not use spaces in IDs.

Example:

GOOD:

```html
<h2 id="how-it-works">How It Works</h2>
```

BAD:

```html
<h2 id="how it works">How It Works</h2>
```

---

## RULE 5 — VERIFY EVERY TOC LINK

After creating or updating the TOC, verify every link.

For each:

```html
<a href="#example">
```

there MUST be a corresponding:

```html
id="example"
```

in the article.

Do not leave broken TOC links.

---

## RULE 6 — TOC MUST MATCH FINAL HEADINGS

The final TOC must accurately reflect the final article.

If headings are changed during rewriting:

* update the TOC
* update the corresponding IDs
* remove obsolete entries
* add new relevant sections

Never leave an outdated TOC after modifying the article.

---

## RULE 7 — DO NOT DUPLICATE

Before inserting a TOC, inspect the entire HTML document.

Check for common TOC implementations such as:

* `<nav class="table-of-contents">`
* `<nav id="toc">`
* `<div class="toc">`
* `<div id="toc">`
* WordPress/plugin-style TOCs
* custom JavaScript TOCs
* automatically generated heading navigation

If one already exists, update it instead of creating another.

There must normally be **ONE TOC per article**.

---

## RULE 8 — PRESERVE WEBSITE DESIGN

If the project already has:

* TOC CSS
* TOC JavaScript
* TOC classes
* responsive TOC behavior
* collapsible TOC
* sticky TOC

preserve the existing implementation.

Do not replace a working TOC with a completely different design.

If no styling exists, create clean semantic HTML that fits the existing article design.

---

## RULE 9 — TOC QUALITY

The TOC should help the reader navigate the article.

Use concise, readable anchor text.

Do not repeat the focus keyword unnecessarily.

Do not create headings purely for the purpose of expanding the TOC.

The TOC must reflect useful sections, not SEO keyword stuffing.

---

## RULE 10 — FINAL TOC CHECK

Before saving the HTML, verify:

[ ] TOC exists
[ ] Exactly one TOC normally exists
[ ] Existing TOC preserved if already present
[ ] New TOC created if missing
[ ] TOC reflects final H2 structure
[ ] Anchor IDs are unique
[ ] Every TOC link has a valid destination
[ ] No broken anchors
[ ] No duplicate entries
[ ] H1 is normally excluded
[ ] Website styling preserved
[ ] Responsive behavior preserved
[ ] TOC position is appropriate
[ ] TOC was checked AFTER the final content rewrite

If the article has no TOC at the beginning of the task, the final article MUST contain one.

Never finish the task with:

`TOC: skipped`

unless the HTML is technically incapable of supporting navigation, in which case report the exact reason.


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

# 10. EXTERNAL LINKS — AUTHORITATIVE SOURCE & REFERENCE SYSTEM

External links must be added for **user value, factual support, context, and trust** — never simply to create SEO signals.

The goal is to connect the article to authoritative, relevant, and trustworthy sources.

## PRIMARY RULE

Do NOT automatically add external links to every article.

First determine whether an external source genuinely helps the reader understand, verify, or explore a claim.

If an authoritative source is useful, add it naturally.

If no relevant authoritative source exists, do not add a random external link.

---

# 10.1 SOURCE PRIORITY

When researching external references, prefer sources in this order when relevant:

### Tier 1 — Primary / Official Sources

Prefer the original authoritative source whenever available.

Examples:

* Government websites
* Official organizations
* Official documentation
* Official product/service documentation
* Universities
* Research institutions
* Standards organizations
* Original publishers
* Official statistics
* Official company/product pages

Examples of source types:

```text
.gov
.edu
official organization websites
official documentation
official standards organizations
```

---

### Tier 2 — High-Authority Reference Sources

When appropriate, consider:

* Wikipedia
* Wikimedia Commons
* Wiktionary
* Britannica
* Encyclopedia/reference resources
* Library resources
* Major educational institutions
* Established research databases

These sources are useful primarily for:

* definitions
* historical background
* terminology
* entities
* general concepts
* images/media references

Do not use them automatically when a better primary source exists.

---

### Tier 3 — High-Quality Industry Sources

Depending on the topic, consider:

* recognized industry organizations
* established technology documentation
* reputable professional organizations
* recognized publications
* authoritative nonprofit organizations
* respected specialist websites

Only use sources that are genuinely relevant to the article.

---

# 10.2 WIKIPEDIA

Wikipedia may be used when it provides useful background information about:

* a person
* company
* technology
* historical event
* scientific concept
* geographic location
* cultural topic
* technical terminology
* organization
* other notable entities

Example:

```html id="v3o7hf"
<a href="https://en.wikipedia.org/wiki/Example">
  Example background information
</a>
```

Rules:

* Use the most relevant Wikipedia article.
* Verify that the page exists.
* Do not invent Wikipedia URLs.
* Do not link to Wikipedia merely because it has high authority.
* Prefer a primary source when the claim requires an authoritative original source.
* Use Wikipedia mainly as a reference/background resource.

---

# 10.3 WIKIMEDIA COMMONS

Use Wikimedia Commons when it provides useful media or contextual information.

Potential uses:

* historical images
* maps
* public-domain media
* diagrams
* geographic references
* cultural/historical material

Do not download or reuse copyrighted images merely because they appear on Wikimedia Commons.

If using a Wikimedia image, verify:

* license
* attribution requirements
* source
* suitability for commercial use when relevant

Do not automatically replace the website's existing images with Wikimedia images.

---

# 10.4 WIKTIONARY

Wiktionary may be useful for:

* terminology
* definitions
* word origins
* language-related explanations
* technical terms where a dictionary definition is useful

Use it only when it adds genuine value.

Example:

```html id="a9cq4e"
<a href="https://en.wiktionary.org/wiki/example">
  definition of the term
</a>
```

Do not add Wiktionary links simply for SEO.

---

# 10.5 SOURCE SELECTION BY ARTICLE TYPE

Choose external sources based on the topic.

### Technology

Prefer:

* official documentation
* official developer documentation
* standards organizations
* GitHub repositories when they are the official project source
* reputable technical organizations
* Wikipedia for general background when useful

### Health

Prefer:

* government health agencies
* hospitals
* universities
* recognized medical organizations
* peer-reviewed research

Do not rely primarily on Wikipedia for medical claims.

### Finance

Prefer:

* government financial authorities
* central banks
* official regulators
* recognized financial institutions
* established research organizations

### Travel

Prefer:

* official tourism boards
* government tourism websites
* transportation authorities
* official attractions

### History

Prefer:

* museums
* universities
* archives
* libraries
* recognized historical institutions
* Wikipedia for general background when useful

### Definitions / terminology

Prefer:

* official dictionaries
* Wiktionary
* recognized encyclopedias
* industry glossaries

### Products / services

Prefer:

* official product pages
* official documentation
* manufacturer documentation
* official support pages

---

# 10.6 EXTERNAL LINK RELEVANCE

Every external link must have a clear purpose.

Before adding a link, ask:

1. What claim or concept does this link support?
2. Is the destination authoritative?
3. Is it relevant to the reader?
4. Is there a better primary source?
5. Does the destination actually contain the information being referenced?

If the answer is unclear, do not add the link.

---

# 10.7 ANCHOR TEXT

Use natural, descriptive anchor text.

GOOD:

```html id="x0v3f6"
<a href="https://en.wikipedia.org/wiki/Internet_Protocol_television">
  background on Internet Protocol television
</a>
```

BAD:

```html id="0ik84h"
<a href="https://en.wikipedia.org/wiki/Internet_Protocol_television">
  click here
</a>
```

Also avoid:

```text
best IPTV
best IPTV service
best IPTV 2026
best IPTV
```

repeated as anchors across multiple external links.

Anchor text should describe the destination or the concept being referenced.

---

# 10.8 NUMBER OF EXTERNAL LINKS

Do NOT target an arbitrary number of external links.

The number should depend on:

* article length
* number of factual claims
* topic complexity
* research requirements
* reader needs

A short article may need only one useful external reference.

A research-heavy article may require several.

More external links does NOT automatically mean better SEO.

---

# 10.9 DO NOT FABRICATE SOURCES

NEVER:

* invent URLs
* invent studies
* invent organizations
* invent citations
* invent statistics
* invent publication titles
* invent authors
* invent source names

Before adding an external link, verify that the destination exists.

If the source cannot be verified, do not create the link.

---

# 10.10 EXTERNAL LINKS AND SEO

External links are NOT a guaranteed ranking signal simply because they point to authoritative websites.

Use them primarily to:

* support claims
* provide additional information
* improve trust
* help readers research the topic
* provide useful references

Do not create artificial external-link patterns designed solely to manipulate search rankings.

Do not force links to Wikipedia, Wikimedia, Wiktionary, or other large websites into unrelated content.

---

# 10.11 LINK ATTRIBUTES

For normal editorial references, use standard links.

Example:

```html id="k1dfc9"
<a href="https://example.com">
  relevant source
</a>
```

If the website intentionally opens external references in a new tab:

```html id="x8k4tp"
<a
  href="https://example.com"
  target="_blank"
  rel="noopener noreferrer">
  relevant source
</a>
```

Do not automatically add `nofollow` to every external link.

Use `nofollow`, `sponsored`, or `ugc` only when appropriate for the relationship and website policy.

---

# 10.12 EXTERNAL SOURCE AUDIT

Before saving the article, inspect every external link.

For each link verify:

[ ] Destination exists
[ ] Destination is relevant
[ ] Source is trustworthy
[ ] Anchor text is descriptive
[ ] Link supports nearby content
[ ] No fabricated URL
[ ] No unnecessary duplicate link
[ ] No suspicious low-quality website
[ ] No unnecessary keyword-stuffed anchor
[ ] Link attributes are appropriate

---

# 10.13 FINAL EXTERNAL LINK STRATEGY

The final article should contain a **natural reference profile**.

Depending on the article, this can include a combination of:

```text
Official source
      +
Educational/reference source
      +
Industry source
      +
Wikipedia/Wikimedia/Wiktionary when relevant
```

But never force all categories into every article.

The final decision must always be based on:

**relevance + authority + usefulness + factual support**

rather than link quantity.


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
✓ SEO title
✓ Meta description
✓ Content structure
✓ Table of Contents
✓ Internal links
✓ External references
✓ Image ALT text
✓ Open Graph metadata
✓ Schema
✓ FAQ
✓ HTML validation
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
✓ Found

File:
/assets/images/FeatureImagePost/best-iptv-2026.webp

Used as:
✓ Hero / Featured Image
✓ Open Graph Image
✓ Twitter Image

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
# 27. AUTOMATIC PNG TO WEBP CONVERSION

The user will normally place blog featured images in PNG format inside:

`/assets/images/FeatureImagePost/`

The user should NOT be required to manually convert images.

Claude Code must handle PNG → WebP conversion automatically when processing a blog post.

## SOURCE IMAGE

Example:

```text
/assets/images/FeatureImagePost/best-iptv-2026.png
```

The corresponding optimized image should be:

```text
/assets/images/FeatureImagePost/best-iptv-2026.webp
```

---

## CONVERSION RULES

When a suitable `.png` featured image is found:

1. Verify that the PNG file exists.
2. Check whether a corresponding `.webp` already exists.
3. If the WebP does not exist, convert the PNG to WebP.
4. If the WebP already exists, check whether the PNG is newer.
5. If the PNG is newer, regenerate the WebP.
6. Preserve the original PNG.
7. Do not delete the original PNG unless explicitly instructed.
8. Use the generated `.webp` in the HTML.

Example:

```text
Before:

/assets/images/FeatureImagePost/best-iptv-2026.png
```

After:

```text
/assets/images/FeatureImagePost/best-iptv-2026.png
/assets/images/FeatureImagePost/best-iptv-2026.webp
```

The HTML must reference:

```html
src="/assets/images/FeatureImagePost/best-iptv-2026.webp"
```

NOT:

```html
src="/assets/images/FeatureImagePost/best-iptv-2026.png"
```

---

## WEBP QUALITY

Use a sensible WebP quality setting suitable for website performance while preserving visual quality.

Target:

* Good visual quality
* Significantly smaller file size than PNG when appropriate
* No visible degradation that harms the featured image

Do not aggressively compress images.

For photographic/complex images, prefer lossy WebP.

For images where transparency or lossless quality is important, use an appropriate WebP mode.

---

## CONVERSION TOOL

Before converting images, inspect the available environment and use an installed image conversion utility/library when available.

Preferred options:

1. `cwebp`
2. ImageMagick
3. Sharp
4. Python Pillow

Do not assume a specific tool is installed.

First check what is available.

For example:

```bash
cwebp -version
```

or:

```bash
magick -version
```

or verify whether the project already contains a suitable Node/Python image-processing dependency.

Use the simplest reliable tool available in the project environment.

---

## DO NOT BREAK TRANSPARENCY

If the PNG contains transparency:

* Preserve transparency when converting to WebP.
* Do not replace transparent areas with an unwanted background color.
* Verify the generated WebP after conversion.

---

## VERIFY THE OUTPUT

After conversion:

1. Confirm the `.webp` file exists.
2. Confirm it can be read/opened.
3. Confirm the file is not empty or corrupted.
4. Confirm the HTML points to the `.webp`.
5. Confirm the WebP is actually smaller when appropriate.

If conversion fails:

* Do not create a fake `.webp` path.
* Keep the valid PNG reference.
* Report the conversion failure clearly.

---

## HTML UPDATE

After successful conversion:

```html
<img
  src="/assets/images/FeatureImagePost/best-iptv-2026.webp"
  alt="Best IPTV services in 2026"
  width="1200"
  height="630">
```

Also update:

```html
<meta property="og:image"
      content="/assets/images/FeatureImagePost/best-iptv-2026.webp">
```

and, when present:

```html
<meta name="twitter:image"
      content="/assets/images/FeatureImagePost/best-iptv-2026.webp">
```

---

## OTHER ARTICLE IMAGES

For images inside the article body:

* Do not automatically convert every image unless the task explicitly requires it.
* The automatic PNG → WebP workflow in this section primarily applies to the featured image.
* Preserve existing article image behavior unless optimization is clearly beneficial and safe.

---

## FINAL REPORT

After processing:

```text
Featured image optimization:

✓ Source PNG found
✓ PNG preserved
✓ Converted to WebP
✓ HTML updated to WebP
✓ Open Graph updated
✓ Twitter image updated

Source:
best-iptv-2026.png

WebP:
best-iptv-2026.webp
```

If the WebP already existed:

```text
✓ Existing WebP found
✓ WebP checked
✓ No unnecessary conversion performed
```

If conversion failed:

```text
⚠ WebP conversion failed
✓ Original PNG preserved
✓ HTML kept using the valid PNG
```

# 28. SEARCH-INTENT-BASED RECOMMENDATIONS

Analyze the article's topic and search intent before deciding whether a Recommendations section would genuinely improve the article.

Do NOT automatically add a Recommendations section to every article.

Only add it when the topic involves:

* choosing between products/services
* comparing multiple solutions
* choosing an option based on user needs
* alternatives
* "best" lists
* tools/platforms
* different use cases
* competing solutions
* decision-making

## DYNAMIC RECOMMENDATIONS

Never use fixed keywords from this skill.

Every article has its own:

* primary focus keyword
* secondary keywords
* related entities
* search intent
* audience
* topic

Extract these dynamically from the current article.

For example, if the article is about a software tool, recommendations could be based on:

* beginners
* advanced users
* budget-conscious users
* professionals

If the article is about travel:

* first-time visitors
* families
* couples
* budget travelers

If the article is about technology:

* beginners
* power users
* users prioritizing price
* users prioritizing performance

The user categories MUST be determined from the actual article topic.

Do not force predefined categories onto unrelated articles.

---

## RECOMMENDATION STRUCTURE

When appropriate, create:

```html
<section id="recommendations">
  <h2>Our Recommendations</h2>

  <ul>
    <li>
      <strong>Best for [user type]:</strong>
      Useful recommendation based on the article's evidence.
    </li>

    <li>
      <strong>Best for [user type]:</strong>
      Useful recommendation based on the article's evidence.
    </li>

    <li>
      <strong>Best for [user type]:</strong>
      Useful recommendation based on the article's evidence.
    </li>
  </ul>

  <p>
    Short overall takeaway comparing the main options.
  </p>
</section>
```

Keep recommendations evidence-based.

Do not invent advantages, disadvantages, prices, features, ratings, or performance claims.

---

# 29. COMPARISON SUMMARY

If the article compares two or more products, services, tools, methods, or solutions, consider adding a short comparison summary.

The summary should answer:

* What is the main difference?
* Who is each option best suited for?
* What is the most important trade-off?
* Which option should a user choose based on their needs?

Prefer approximately 3–5 concise sentences.

If a comparison table already communicates this clearly, do not duplicate the entire table in prose.

---

# 30. USER-NEED MATCHING

Recommendations should focus on the user's needs rather than simply declaring one option "the best."

Use decision-oriented language such as:

* Best for beginners
* Best for advanced users
* Best for budget-conscious users
* Best for performance
* Best for flexibility
* Best for specific use cases

Only use categories that genuinely apply to the article.

Do not create artificial categories simply to increase content length.

---

# 31. KEYWORD ADAPTATION

NEVER hard-code keywords into the Recommendations section.

Before writing recommendations:

1. Identify the primary focus keyword.
2. Identify secondary keywords.
3. Identify related terms and entities.
4. Identify search intent.
5. Determine which terms naturally belong in the recommendation section.

Use only relevant terms.

Do not force every keyword into the section.

Do not repeat keywords unnecessarily.

Do not use keyword stuffing.

The recommendations should sound natural even if all SEO keywords were removed.

---

# 32. TRUST, SAFETY AND LEGAL CONTEXT

If the article topic involves:

* privacy
* security
* health
* finance
* legal matters
* copyrighted content
* potentially regulated services
* online safety
* sensitive personal information

include an appropriate trust/safety note when genuinely useful.

The note must be specific to the topic.

Do not add generic warnings to every article.

Never provide instructions for illegal activity.

Never make unsupported legal claims.

When legal information is important, prefer authoritative sources and clearly distinguish general information from professional legal advice.

---

# 33. ORIGINALITY / PLAGIARISM CHECK

The goal of the transformation is to create genuinely original editorial content.

Do NOT attempt to manipulate plagiarism detection systems or artificially lower similarity scores.

Before saving the final article:

### STEP 1 — Compare with the original

Compare the transformed article against the original article supplied by the user.

Identify:

* paragraphs that remain substantially unchanged
* sentences with very similar structure
* repeated phrases
* duplicated wording
* unchanged introductions
* unchanged conclusions
* sections that were only minimally modified

### STEP 2 — Rewrite overly similar passages

If a passage is unnecessarily close to the original:

* rewrite it naturally
* change the structure
* improve the explanation
* combine or split paragraphs where appropriate
* add useful context when justified
* remove redundant wording

Do NOT change factual information simply to create artificial differences.

### STEP 3 — Preserve important information

Do not remove:

* factual information
* useful definitions
* necessary terminology
* proper names
* URLs
* citations
* technical specifications

simply because they appear in the original.

---

# 34. EXTERNAL PLAGIARISM CHECK

Claude Code must NOT claim that it performed a full internet plagiarism check unless an actual external plagiarism/search service is available.

Local comparison against the original article is NOT equivalent to an internet plagiarism check.

If an external plagiarism API/service is configured and available:

1. Submit the relevant content according to the service's API.
2. Retrieve the similarity/originality result.
3. Identify problematic passages.
4. Rewrite them naturally.
5. Run the check again if supported.
6. Report the result accurately.

If no external service is available, report:

```text
External plagiarism check:
Not available.

Local originality check:
Completed against the original article.
```

Never fabricate a plagiarism percentage.

Never claim:

* "100% plagiarism free"
* "Google approved"
* "Google cannot detect this"
* "Copyscape passed"

unless the relevant service actually returned that result.

---

# 35. ORIGINALITY REPORT

At the end of the transformation, provide:

```text
Originality Check

✓ Original article compared
✓ Similar passages reviewed
✓ Repetitive wording improved
✓ Content structure substantially improved

External plagiarism checker:
Not configured

Local originality check:
Completed
```

If an external service is available:

```text
Originality Check

✓ Original article compared
✓ External plagiarism check completed
✓ Similar passages reviewed
✓ Final content reviewed

External checker:
[Service name]

Result:
[Actual returned result]
```

---

# 36. SEMANTIC CONTENT EXPANSION

Do not increase article length just for SEO.

Instead, identify information gaps that are useful for the search intent.

Potential additions include:

* practical examples
* comparison tables
* recommendations
* pros and cons
* FAQs
* common mistakes
* use cases
* alternatives
* selection criteria
* limitations
* important considerations

Only add sections that improve the reader's ability to understand the topic or make a decision.

---

# 37. CONTENT GAP ANALYSIS

When the project contains related articles or when reliable sources are available, identify useful topics that the existing article does not adequately cover.

Look for:

* important subtopics
* unanswered user questions
* missing comparisons
* missing practical information
* missing definitions
* missing limitations
* missing alternatives

Do not copy competitors.

Do not reproduce competitor wording.

Use content-gap research only to identify information that would genuinely improve the article.

---

# 38. FACTUAL CONSISTENCY CHECK

Before saving the final article:

Check that:

* dates are consistent
* numbers are consistent
* product/service names are consistent
* links correspond to the claims they support
* headings match their content
* comparison tables match the surrounding text
* FAQs match the article
* schema matches visible content

Do not invent missing facts.

If a fact cannot be verified, preserve the original information only when it appears reasonable and clearly presented; otherwise flag it for manual review rather than fabricating a replacement.

---

# 39. FINAL CONTENT QUALITY GATE

Before completing the task, ask internally:

1. Is this genuinely more useful than the original?
2. Is the structure clearer?
3. Does it satisfy the search intent better?
4. Are recommendations actually useful?
5. Are comparisons easy to understand?
6. Are keywords used naturally?
7. Are important information gaps addressed?
8. Is the content genuinely rewritten rather than mechanically paraphrased?
9. Are factual claims supported or preserved accurately?
10. Did the transformation avoid unnecessary SEO manipulation?

Only save the final version after passing this quality gate.

# 40. PROJECT-SPECIFIC ADAPTATION NOTES

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