import { db, collection, getDocs, addDoc, query, select, serverTimestamp, Timestamp } from '../../assets/js/firebase.js';
import { generateSlug, calculateReadingTime } from './utils.js';

/**
 * Fetches all existing slugs from the 'posts' collection for quick lookups.
 * @returns {Promise<Set<string>>} A Set containing all existing slugs.
 */
async function getAllSlugs() {
    const slugs = new Set();
    const q = query(collection(db, 'posts'), select("slug"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
        if (doc.data().slug) {
            slugs.add(doc.data().slug);
        }
    });
    return slugs;
}

/**
 * Validates a single row of data from the CSV.
 * @param {object} row - The row data.
 * @param {number} rowNumber - The original row number in the file for error reporting.
 */
function validateRow(row, rowNumber) {
    if (!row.title || row.title.trim() === '') {
        throw new Error(`Row ${rowNumber}: 'title' is a required field.`);
    }
    if (!row.content || row.content.trim() === '') {
        throw new Error(`Row ${rowNumber}: 'content' is a required field.`);
    }
    if (row.publishedAt && isNaN(new Date(row.publishedAt).getTime())) {
        throw new Error(`Row ${rowNumber}: 'publishedAt' has an invalid date format. Use YYYY-MM-DD.`);
    }
}

/**
 * Generates a unique slug, checking against existing and newly imported slugs.
 * @param {string} title - The title to generate a slug from.
 * @param {Set<string>} existingSlugs - Slugs from Firestore.
 * @param {Set<string>} importedSlugs - Slugs from the current import batch.
 * @returns {string} A unique slug.
 */
function generateUniqueSlug(title, existingSlugs, importedSlugs) {
    let slug = generateSlug(title);
    let counter = 2;
    let uniqueSlug = slug;

    while (existingSlugs.has(uniqueSlug) || importedSlugs.has(uniqueSlug)) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }
    return uniqueSlug;
}

/**
 * Generates SEO-related data and schemas for a post.
 * @param {object} row - The original row data.
 * @param {string} slug - The final unique slug for the post.
 * @returns {object} An object containing meta and schema data.
 */
function generateSeoData(row, slug) {
    const postUrl = `https://gettv.online/${slug}`;
    const siteName = "GetTV.online";

    const meta = {
        title: row.metaTitle || `${row.title} | ${siteName}`,
        description: row.metaDescription || row.excerpt || row.content.substring(0, 160).trim() + '...',
    };

    const schema = {
        article: {
            "@context": "https://schema.org",
            "@type": "Article",
            "mainEntityOfPage": { "@type": "WebPage", "@id": postUrl },
            "headline": row.title,
            "description": meta.description,
            "image": row.featuredImage || `https://gettv.online/assets/images/gettvonline.webp`,
            "author": { "@type": "Organization", "name": row.author || "GetTV.online Team" },
            "publisher": { "@type": "Organization", "name": siteName, "logo": { "@type": "ImageObject", "url": "https://gettv.online/assets/images/logogettv.svg" } },
            "datePublished": row.publishedAt ? new Date(row.publishedAt).toISOString() : new Date().toISOString(),
        },
        breadcrumb: {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gettv.online/" },
                { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://gettv.online/blog" },
                { "@type": "ListItem", "position": 3, "name": row.title, "item": postUrl }
            ]
        }
    };

    return { meta, schema, canonical: postUrl };
}

/**
 * Transforms a CSV row into a Firestore document object.
 * @param {object} row - The validated CSV row.
 * @param {string} slug - The generated unique slug.
 * @returns {object} The final document to be saved to Firestore.
 */
function transformRowToDoc(row, slug) {
    const { meta, schema, canonical } = generateSeoData(row, slug);

    const searchContent = [row.title, row.excerpt, row.content, row.tags, row.focusKeyword]
        .join(' ')
        .toLowerCase()
        .replace(/<[^>]+>/g, ' ') // strip html
        .replace(/\s+/g, ' '); // normalize whitespace

    const postDoc = {
        title: row.title,
        slug: slug,
        author: row.author || 'GetTV.online Team',
        content: row.content,
        status: (row.status || 'draft').toLowerCase(),
        imageUrl: row.featuredImage || null,
        category: row.category || 'Uncategorized',
        excerpt: row.excerpt || row.content.substring(0, 200).trim() + '...',
        tags: row.tags ? row.tags.split(',').map(t => t.trim()) : [],
        keywords: row.focusKeyword ? row.focusKeyword.split(',').map(k => k.trim()) : [],
        
        readingTime: calculateReadingTime(row.content),
        views: 0,
        searchIndex: searchContent,

        meta: meta,
        schema: schema,
        canonical: canonical,

        publishedAt: row.publishedAt ? Timestamp.fromDate(new Date(row.publishedAt)) : serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    return postDoc;
}

/**
 * Main import orchestrator.
 * @param {object[]} data - Array of parsed row objects from CSV.
 * @param {function} progressCallback - Function to call with progress updates.
 * @returns {Promise<object>} An object with final import statistics and errors.
 */
export async function importPosts(data, progressCallback) {
    // 1. Get all existing slugs for fast checking
    const existingSlugs = await getAllSlugs();
    const importedSlugs = new Set();

    const results = {
        total: data.length,
        imported: 0,
        skipped: 0,
        errors: []
    };

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const rowNumber = i + 2; // For user-friendly error reporting (1-based index + header)

        try {
            // 2. Validate row
            validateRow(row, rowNumber);

            // 3. Generate and ensure unique slug
            const slugBase = row.slug || row.title;
            if (!slugBase) throw new Error(`Row ${rowNumber}: Cannot generate slug without a 'slug' or 'title'.`);
            
            let slug = generateUniqueSlug(slugBase, existingSlugs, importedSlugs);
            importedSlugs.add(slug);

            // 4. Transform data into Firestore document
            const postDoc = transformRowToDoc(row, slug);

            // 5. Save to Firestore
            await addDoc(collection(db, 'posts'), postDoc);
            results.imported++;

        } catch (error) {
            results.skipped++;
            results.errors.push({ row: rowNumber, message: error.message, data: { title: row.title || 'N/A' } });
        }

        // 6. Report progress
        if (progressCallback) {
            progressCallback({
                processed: i + 1,
                total: results.total,
                imported: results.imported,
                skipped: results.skipped
            });
        }
    }

    return results;
}