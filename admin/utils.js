/**
 * Generates a URL-friendly slug from a string.
 * @param {string} text The string to convert.
 * @returns {string} The generated slug.
 */
export function generateSlug(text) {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

/**
 * Calculates the estimated reading time in minutes.
 * @param {string} content The HTML or text content of the post.
 * @returns {number} The estimated reading time.
 */
export function calculateReadingTime(content) {
    const text = content.replace(/<[^>]+>/g, ''); // Strip HTML tags
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
}