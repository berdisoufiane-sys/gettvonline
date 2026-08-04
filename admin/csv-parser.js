/**
 * A simple CSV parser that handles quoted fields.
 * For a more robust, production-grade solution, consider a library like PapaParse.
 * This implementation is designed to work with well-formed CSVs as specified.
 * It does not handle newlines within quoted fields.
 * @param {string} csvText The raw CSV string content.
 * @returns {{headers: string[], data: object[]}} An object containing headers and parsed data.
 */
export function parse(csvText) {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length < 2) return { headers: [], data: [] };

    // Use a regex to split the header row to handle potential trailing commas
    const headers = lines.shift().split(',').map(h => h.trim());

    const data = lines.map(line => {
        // This regex handles comma-separated values, including those enclosed in double quotes.
        // It correctly handles escaped quotes ("") inside a quoted field.
        const values = [];
        const regex = /("([^"]|"")*"|[^,]*)(,|$)/g;
        let match;
        while ((match = regex.exec(line))) {
            let value = match[1];
            if (value.startsWith('"') && value.endsWith('"')) {
                // Remove surrounding quotes and un-escape double quotes
                value = value.slice(1, -1).replace(/""/g, '"');
            }
            values.push(value.trim());
            if (match[0].slice(-1) !== ',') break; // End of line
        }

        // If the last column is empty, the regex might miss it. Add it manually.
        if (line.endsWith(',')) {
            values.push('');
        }

        const rowObject = {};
        headers.forEach((header, index) => {
            rowObject[header] = values[index] || '';
        });
        return rowObject;
    });

    return { headers, data };
}