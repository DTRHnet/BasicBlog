import fs from 'fs';
import { logInfo, logWarn, logError } from './logger.js';

/**
 * Parse panes.cfg file with advanced features
 * 
 * Format: Each line represents a row of panes
 * |pane_name [width%] [height%] [dock]|
 * 
 * Examples:
 * |header 100 10|                    # Full width, 10% height
 * |sidebar 25|main 50|footer|        # Three columns, auto height
 * |footer 100 dock:bottom|           # Docked to bottom
 * 
 * @param {string} panesPath - Path to panes.cfg file
 * @returns {Array} Array of row objects, each containing panes
 */
export function parsePanes(panesPath) {
    try {
        logInfo(`Parsing panes configuration file: ${panesPath}`);

        // Default fallback: single full-width pane
        const defaultPanes = [{
            row: 0,
            panes: [{ name: 'main', width: 100, height: null, dock: null }]
        }];

        if (!fs.existsSync(panesPath)) {
            logWarn(`Panes file not found at ${panesPath}. Using default single pane.`);
            return defaultPanes;
        }

        const fileContents = fs.readFileSync(panesPath, 'utf8').trim();

        if (!fileContents) {
            logWarn('panes.cfg is empty. Using default single pane.');
            return defaultPanes;
        }

        // Split by newlines to get rows
        const lines = fileContents
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0 && !line.startsWith('#'));

        if (lines.length === 0) {
            logWarn('No valid pane definitions found in panes.cfg. Using default single pane.');
            return defaultPanes;
        }

        const rows = [];
        const allPaneNames = new Set();
        let hasErrors = false;

        // Parse each line as a row
        for (let rowIndex = 0; rowIndex < lines.length; rowIndex++) {
            const line = lines[rowIndex];
            const rowResult = parseRow(line, rowIndex, allPaneNames);

            if (rowResult.error) {
                hasErrors = true;
                continue;
            }

            if (rowResult.panes.length > 0) {
                rows.push({
                    row: rowIndex,
                    panes: rowResult.panes,
                    height: rowResult.height
                });
            }
        }

        // If no valid rows were parsed, use default
        if (rows.length === 0) {
            logWarn('No valid rows could be parsed. Using default single pane.');
            return defaultPanes;
        }

        logInfo(`Panes parsed successfully: ${rows.length} rows with ${allPaneNames.size} total panes`);
        return rows;

    } catch (err) {
        logError(`Error reading panes.cfg: ${err.message}. Using default single pane.`, err);
        return [{
            row: 0,
            panes: [{ name: 'main', width: 100, height: null, dock: null }]
        }];
    }
}

/**
 * Parse a single row of panes
 * @param {string} line - Line to parse
 * @param {number} rowIndex - Row index
 * @param {Set} allPaneNames - Set of all pane names (for duplicate checking)
 * @returns {Object} Parsed row with panes array
 */
function parseRow(line, rowIndex, allPaneNames) {
    // Split by pipe and filter empty segments
    const segments = line
        .split('|')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    if (segments.length === 0) {
        return { error: true, panes: [] };
    }

    const panes = [];
    let totalFixedWidth = 0;
    let autoWidthCount = 0;
    let rowHeight = null;

    // First pass: parse all panes in this row
    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        const paneResult = parsePane(segment, rowIndex, i, allPaneNames);

        if (paneResult.error) {
            continue;
        }

        panes.push(paneResult.pane);

        if (paneResult.pane.width === null) {
            autoWidthCount++;
        } else {
            totalFixedWidth += paneResult.pane.width;
        }

        // If this pane has a height, use it for the row
        if (paneResult.pane.height !== null && rowHeight === null) {
            rowHeight = paneResult.pane.height;
        }
    }

    if (panes.length === 0) {
        return { error: true, panes: [] };
    }

    // Second pass: calculate auto widths
    if (autoWidthCount > 0) {
        const remainingWidth = Math.max(0, 100 - totalFixedWidth);
        const autoWidth = remainingWidth / autoWidthCount;

        if (autoWidth <= 0) {
            logWarn(`Row ${rowIndex}: Fixed widths sum to ${totalFixedWidth}%, leaving no space for auto-width panes. Normalizing all widths.`);
            // Normalize all widths proportionally
            panes.forEach(pane => {
                pane.width = 100 / panes.length;
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
        logWarn(`Row ${rowIndex}: Pane widths sum to ${actualTotal.toFixed(2)}%. Normalizing to 100%.`);
        const normalizationFactor = 100 / actualTotal;
        panes.forEach(pane => {
            pane.width = pane.width * normalizationFactor;
        });
    }

    return { error: false, panes, height: rowHeight };
}

/**
 * Parse a single pane definition
 * @param {string} segment - Pane segment to parse
 * @param {number} rowIndex - Row index
 * @param {number} paneIndex - Pane index in row
 * @param {Set} allPaneNames - Set of all pane names
 * @returns {Object} Parsed pane or error
 */
function parsePane(segment, rowIndex, paneIndex, allPaneNames) {
    const parts = segment.split(/\s+/);

    if (parts.length === 0) {
        return { error: true };
    }

    const name = parts[0];

    // Validate pane name (alphanumeric, dash, underscore)
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
        logWarn(`Row ${rowIndex}, Pane ${paneIndex}: Invalid pane name '${name}'. Must be alphanumeric. Skipping.`);
        return { error: true };
    }

    // Check for duplicate names
    if (allPaneNames.has(name)) {
        logError(`Row ${rowIndex}, Pane ${paneIndex}: Duplicate pane name '${name}' found. Each pane must have a unique name. Skipping duplicate.`);
        return { error: true };
    }

    allPaneNames.add(name);

    let width = null;
    let height = null;
    let dock = null;

    // Parse additional parameters (width, height, dock)
    for (let i = 1; i < parts.length; i++) {
        const part = parts[i];

        // Check for dock directive
        if (part.startsWith('dock:')) {
            const dockValue = part.substring(5).toLowerCase();
            if (['top', 'bottom', 'left', 'right'].includes(dockValue)) {
                dock = dockValue;
            } else {
                logWarn(`Row ${rowIndex}, Pane ${name}: Invalid dock value '${dockValue}'. Must be top, bottom, left, or right. Ignoring.`);
            }
            continue;
        }

        // Parse as number (width or height)
        const num = parseInt(part, 10);
        if (isNaN(num) || num <= 0 || num > 100) {
            logWarn(`Row ${rowIndex}, Pane ${name}: Invalid dimension '${part}'. Must be 1-100. Ignoring.`);
            continue;
        }

        // First number is width, second is height
        if (width === null) {
            width = num;
        } else if (height === null) {
            height = num;
        } else {
            logWarn(`Row ${rowIndex}, Pane ${name}: Too many dimensions specified. Ignoring '${part}'.`);
        }
    }

    return {
        error: false,
        pane: {
            name,
            width,
            height,
            dock,
            row: rowIndex
        }
    };
}

/**
 * Validate that entries reference valid panes and vice versa
 * @param {Object} entries - Entries object from parseEntries
 * @param {Array} rows - Rows array from parsePanes
 * @returns {Object} Validated entries with errors for mismatches
 */
export function validateEntriesAgainstPanes(entries, rows) {
    // Flatten rows to get all panes
    const allPanes = [];
    rows.forEach(row => {
        row.panes.forEach(pane => {
            allPanes.push(pane);
        });
    });

    const validPaneNames = new Set(allPanes.map(p => p.name));
    const validatedEntries = {};
    let hasErrors = false;

    // Check entries that reference non-existent panes
    for (const [paneId, content] of Object.entries(entries)) {
        if (!validPaneNames.has(paneId)) {
            logError(`❌ ERROR: entries.json references pane '${paneId}' which is not defined in panes.cfg.`);
            hasErrors = true;
            continue;
        }
        validatedEntries[paneId] = content;
    }

    // Check panes that have no entries
    allPanes.forEach(pane => {
        if (!entries[pane.name] || entries[pane.name].length === 0) {
            logWarn(`⚠️  WARNING: Pane '${pane.name}' defined in panes.cfg has no entries in entries.json. It will be rendered empty.`);
        }
    });

    // Check for entries without corresponding panes (already handled above but log summary)
    const entryPaneNames = new Set(Object.keys(entries));
    const orphanedEntries = [...entryPaneNames].filter(name => !validPaneNames.has(name));

    if (orphanedEntries.length > 0) {
        logError(`❌ ERROR: Found ${orphanedEntries.length} pane(s) in entries.json not defined in panes.cfg: ${orphanedEntries.join(', ')}`);
        hasErrors = true;
    }

    if (hasErrors) {
        logError('❌ VALIDATION FAILED: Pane/Entry mismatch detected. Please fix panes.cfg and entries.json to match.');
    } else {
        logInfo('✅ Validation passed: All panes and entries are properly matched.');
    }

    return validatedEntries;
}

/**
 * Flatten rows structure to simple panes array (for backward compatibility)
 * @param {Array} rows - Rows array from parsePanes
 * @returns {Array} Flattened panes array
 */
export function flattenPanes(rows) {
    const panes = [];
    rows.forEach(row => {
        row.panes.forEach(pane => {
            panes.push(pane);
        });
    });
    return panes;
}

export default {
    parsePanes,
    validateEntriesAgainstPanes,
    flattenPanes,
};
