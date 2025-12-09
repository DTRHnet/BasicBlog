import fs from 'fs';
import { logInfo, logWarn, logError } from './logger.js';

/**
 * Parse panes.cfg file with robust handling
 * Format: |pane_name [width%]|pane_name2 [width%]|
 * Example: |sidebar 20|main|footer 100|
 * 
 * @param {string} panesPath - Path to panes.cfg file
 * @returns {Array} Array of pane objects with name and width properties
 */
export function parsePanes(panesPath) {
    try {
        logInfo(`Parsing panes configuration file: ${panesPath}`);

        // Default fallback: single full-width pane
        const defaultPanes = [{ name: 'main', width: 100 }];

        if (!fs.existsSync(panesPath)) {
            logWarn(`Panes file not found at ${panesPath}. Using default single pane.`);
            return defaultPanes;
        }

        const fileContents = fs.readFileSync(panesPath, 'utf8').trim();

        if (!fileContents) {
            logWarn('panes.cfg is empty. Using default single pane.');
            return defaultPanes;
        }

        // Split by pipe and filter empty segments
        const segments = fileContents
            .split('|')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        if (segments.length === 0) {
            logWarn('No valid pane definitions found in panes.cfg. Using default single pane.');
            return defaultPanes;
        }

        const panes = [];
        const paneNames = new Set();
        let totalFixedWidth = 0;
        let autoWidthCount = 0;

        // First pass: parse all panes and collect fixed widths
        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            const parts = segment.split(/\s+/);

            if (parts.length === 0) continue;

            const name = parts[0];

            // Validate pane name (alphanumeric only)
            if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
                logWarn(`Invalid pane name '${name}' at position ${i}. Must be alphanumeric. Skipping.`);
                continue;
            }

            // Check for duplicate names
            if (paneNames.has(name)) {
                logError(`Duplicate pane name '${name}' found. Each pane must have a unique name. Skipping duplicate.`);
                continue;
            }

            paneNames.add(name);

            // Parse width if provided
            let width = null;
            if (parts.length > 1) {
                const widthStr = parts[1];
                const parsedWidth = parseInt(widthStr, 10);

                if (isNaN(parsedWidth) || parsedWidth <= 0 || parsedWidth > 100) {
                    logWarn(`Invalid width '${widthStr}' for pane '${name}'. Must be 1-100. Using auto width.`);
                    width = null;
                } else {
                    width = parsedWidth;
                    totalFixedWidth += width;
                }
            }

            panes.push({ name, width });

            if (width === null) {
                autoWidthCount++;
            }
        }

        // If no valid panes were parsed, use default
        if (panes.length === 0) {
            logWarn('No valid panes could be parsed. Using default single pane.');
            return defaultPanes;
        }

        // Second pass: calculate auto widths
        if (autoWidthCount > 0) {
            const remainingWidth = Math.max(0, 100 - totalFixedWidth);
            const autoWidth = remainingWidth / autoWidthCount;

            if (autoWidth <= 0) {
                logWarn(`Fixed widths sum to ${totalFixedWidth}%, leaving no space for auto-width panes. Normalizing all widths.`);
                // Normalize all widths proportionally
                const totalPanes = panes.length;
                panes.forEach(pane => {
                    pane.width = 100 / totalPanes;
                });
            } else {
                // Assign calculated auto width
                panes.forEach(pane => {
                    if (pane.width === null) {
                        pane.width = autoWidth;
                    }
                });
            }
        }

        // Normalize if total width doesn't equal 100%
        const actualTotal = panes.reduce((sum, pane) => sum + pane.width, 0);
        if (Math.abs(actualTotal - 100) > 0.1) {
            logWarn(`Total pane widths sum to ${actualTotal.toFixed(2)}%. Normalizing to 100%.`);
            const normalizationFactor = 100 / actualTotal;
            panes.forEach(pane => {
                pane.width = pane.width * normalizationFactor;
            });
        }

        logInfo(`Panes parsed successfully: ${panes.length} panes`, { panes });
        return panes;

    } catch (err) {
        logError(`Error reading panes.cfg: ${err.message}. Using default single pane.`, err);
        return [{ name: 'main', width: 100 }];
    }
}

/**
 * Validate that entries reference valid panes
 * @param {Object} entries - Entries object from parseEntries
 * @param {Array} panes - Panes array from parsePanes
 * @returns {Object} Validated entries with warnings for mismatched panes
 */
export function validateEntriesAgainstPanes(entries, panes) {
    const validPaneNames = new Set(panes.map(p => p.name));
    const validatedEntries = {};

    for (const [paneId, content] of Object.entries(entries)) {
        if (!validPaneNames.has(paneId)) {
            logWarn(`Entries reference pane '${paneId}' which is not defined in panes.cfg. Skipping these entries.`);
            continue;
        }
        validatedEntries[paneId] = content;
    }

    // Log panes with no content
    panes.forEach(pane => {
        if (!validatedEntries[pane.name] || validatedEntries[pane.name].length === 0) {
            logInfo(`Pane '${pane.name}' has no entries and will be rendered empty.`);
        }
    });

    return validatedEntries;
}

export default {
    parsePanes,
    validateEntriesAgainstPanes,
};
