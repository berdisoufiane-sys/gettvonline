---
name: GetTV Scheduler
description: Schedule existing draft blog posts (created by the SEO Blog Transformation skill) onto specific future publish times, respecting a 3-posts-per-day cap and a 2-hour minimum gap between posts. Use when the user runs /schedule, or asks to schedule, queue, or set publish times for draft posts. Does not create, rewrite, or analyze post content, and never publishes anything directly.
---

# GetTV Scheduler Skill

## Scope

This skill has exactly one job: take existing `status: "draft"` posts in `/posts` and assign
them a `status: "scheduled"` and a `publishAt` timestamp, respecting the rules below.

Content creation and transformation is the job of the separate **SEO Blog Transformation**
skill. This skill never duplicates that work.

**This skill must NEVER:**
- Read, summarize, or analyze the `<template id="post-body">` content of any post.
- Rewrite, edit, or improve any article text.
- Run SEO analysis, keyword research, or topic research.
- Generate, match, or modify images.
- Modify `title`, `description`, `category`, `featuredImage`, `author`, `publishDate`,
  `createdAt`, or `updatedAt`.
- Change or invent the slug (filename) of a post.
- Set `status` directly to `"published"`, or otherwise publish anything immediately.
- Call or invoke the SEO Blog Transformation skill.

**This skill only ever changes two fields** on a chosen draft's frontmatter: `status`
(`"draft"` → `"scheduled"`) and `publishAt` (set to the computed timestamp). Nothing else in
the file is touched.

## Data model (already exists — do not invent a new one)

Every post lives at `posts/{slug}.html` with a `<script type="application/json"
id="post-frontmatter">` block. The relevant fields, defined and enforced by `build-blog.js`:

- `status`: `"draft"` | `"scheduled"` | `"published"`. Absent = `"published"`.
- `publishAt`: required when `status` is `"scheduled"`. ISO 8601 timestamp. This is what
  gates whether `build-blog.js` includes the post in a build (a `"scheduled"` post is only
  built once `publishAt` has passed).
- `publishDate`: `YYYY-MM-DD` display date, required on every post, no time component.
- `createdAt` / `updatedAt`: optional ISO timestamps, not used by the build.

Skip `posts/_TEMPLATE.html` (leading underscore, same convention `build-blog.js` uses).

There is no separate "scheduled" or "published" folder; everything lives flat in `/posts`,
distinguished only by the `status` field. Do not create folders or a new tracking file.

## Reading posts without reading content (token efficiency)

Only the frontmatter JSON block is needed, never the body. Extract it cheaply, for example
with a small Node one-liner using `cheerio` (already a project dependency) that loops over
`posts/*.html`, pulls just `$('#post-frontmatter').html()`, and prints one compact line per
post (slug, status, publishDate, publishAt, title). Do not `Read` full post files, and never
touch `#post-body`. A run of this skill should stay small: a handful of short shell commands
and one or two small edits, not a transcript of article content.

## Timezone

This project does not define a timezone anywhere (checked `vercel.json`, `package.json`,
`build-blog.js`, and every HTML page — none exists). Per the standing instruction not to
silently assume UTC, this skill uses the **local system clock of the machine/environment
running the skill** for all "today" / "now" calculations, and always writes `publishAt` as
an ISO 8601 timestamp **with an explicit UTC offset** (e.g. via `date -Iseconds`, or
`new Date().toISOString()` only if you also record the offset used), so the stored time is
unambiguous no matter where a later build runs. If this project ever gains a configured
timezone, switch to it instead.

## Scheduling rules

- **Hard cap: 3 posts per calendar day** (counting `scheduled` + `published` posts whose
  date falls on that day — see "Counting published posts" below).
- **Hard minimum: 2 hours between any two posts on the same day.**
- **Default slots for an empty day:** 09:00, 11:00, 13:00 (local time). If the current time
  has already passed a default slot, skip that slot and use the next one that hasn't passed.
  If all three default slots are already in the past, use the next full hour from now as the
  first slot, then add 2 hours per subsequent slot (still capped at 3/day).
- **Non-empty day:** the next slot is always `(latest known occupied time that day) + 2h`,
  not the default grid. The default grid only applies when the target day has zero posts.

### Counting published posts (schema gap, handle explicitly)

Published posts (`status` absent or `"published"`) only have a date (`publishDate`), not a
time, unless they happen to still carry a `publishAt` from when they were scheduled. When
counting a day's occupied slots:
- A published post whose `publishDate` matches the target day counts toward the 3/day cap.
- If it has a `publishAt`, use that as its time for the 2-hour-gap calculation.
- If it has no `publishAt`, it still counts toward the cap, but is ignored when computing
  "the latest known time" (treat it as timeless, not as blocking a specific hour).

### Target day selection

Starting from today, find the first calendar day whose occupied-slot count (scheduled +
published) is below 3. This is normally today. If today is already at the 3-post cap
**before this run schedules anything**, advance to the next day (and so on) and treat that
day as "today" for the rest of this run.

Once a target day is selected, this run fills **only that single day** (up to 3 total slots,
or until drafts run out) and then stops — it does not roll over into a second day in the same
run. Any drafts left over after the target day fills up are left as-is and reported as
remaining; running `/schedule` again later (e.g. the next day) will naturally find room.

## Process

When the user runs `/schedule` (optionally `/schedule N` to cap how many drafts to attempt
this run):

1. List draft posts (`status: "draft"`), in their existing order (filename/directory listing
   order — do not reorder by analyzing content).
2. Select the target day per "Target day selection" above.
3. Compute that day's already-occupied slots (scheduled + published, per "Counting published
   posts" above) and the count so far.
4. If count is already 3, stop: nothing to schedule, report the next available day.
5. Otherwise, repeatedly: compute the next valid slot (per "Scheduling rules"), assign it to
   the next draft in order (set `status: "scheduled"`, `publishAt: <slot>`), increment the
   count, until either the day hits 3, the draft list (or the `/schedule N` cap) is
   exhausted, or there are no more drafts.
6. Stop.

## Output

Report only the short result below. No long explanation, no restating the rules, no summary
of post content.

```
Scheduled:
- [post title] → [date/time]
- [post title] → [date/time]

Today: [X/3]
Remaining drafts: [X]
Next available slot: [date/time]
```

If nothing was scheduled:

```
No posts scheduled.

Reason: [reason]
```
