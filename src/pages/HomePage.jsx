import React from 'react';
import { PaneGrid } from '../components/PaneGrid';

/**
 * Home page component
 * Renders the main blog content using PaneGrid
 * @param {Object} props - Component props
 * @param {Array} props.rows - Array of row configurations (new format)
 * @param {Array} props.panes - Array of pane configurations (legacy format)
 * @param {Object} props.entries - Object mapping pane names to entries
 */
export function HomePage({ rows, panes, entries }) {
    return (
        <div className="min-h-screen">
            <PaneGrid rows={rows} panes={panes} entries={entries} />
        </div>
    );
}

export default HomePage;
