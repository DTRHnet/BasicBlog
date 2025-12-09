import React from 'react';
import { marked } from 'marked';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { cn } from '../lib/utils';

/**
 * ContentRenderer component
 * Renders different content types (text, markdown, html)
 * @param {Object} props - Component props
 * @param {Object} props.entry - Entry object with type and content
 */
function ContentRenderer({ entry }) {
    const { type, content, title } = entry;

    const renderContent = () => {
        switch (type) {
            case 'markdown':
                return (
                    <div
                        className="prose prose-slate dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: marked(content) }}
                    />
                );
            case 'html':
                return (
                    <div
                        className="prose prose-slate dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                );
            case 'text':
            default:
                return <p className="text-foreground whitespace-pre-wrap">{content}</p>;
        }
    };

    if (title) {
        return (
            <Card className="mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CardHeader>
                    <CardTitle className="text-xl">{title}</CardTitle>
                </CardHeader>
                <CardContent>{renderContent()}</CardContent>
            </Card>
        );
    }

    return (
        <div className="mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderContent()}
        </div>
    );
}

/**
 * Pane component
 * Renders a single pane with its content
 * @param {Object} props - Component props
 * @param {Object} props.pane - Pane object with name, width, height, dock
 * @param {Array} props.entries - Array of entry objects for this pane
 */
function Pane({ pane, entries = [] }) {
    const { name, width, height, dock } = pane;

    // Build style object
    const style = {
        width: `${width}%`,
    };

    // Add height if specified
    if (height !== null && height !== undefined) {
        style.height = `${height}vh`;
        style.minHeight = `${height}vh`;
        style.maxHeight = `${height}vh`;
        style.overflowY = 'auto';
    }

    // Determine classes based on dock
    const dockClasses = {
        top: 'order-first',
        bottom: 'order-last',
        left: 'order-first',
        right: 'order-last',
    };

    return (
        <div
            className={cn(
                "pane flex flex-col p-4",
                entries.length === 0 && "opacity-50",
                dock && dockClasses[dock],
                height ? "overflow-y-auto" : "min-h-0"
            )}
            style={style}
            data-pane={name}
            data-dock={dock || 'none'}
        >
            {entries.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                    <p className="text-sm italic">No content for {name}</p>
                </div>
            ) : (
                entries.map((entry, index) => (
                    <ContentRenderer key={index} entry={entry} />
                ))
            )}
        </div>
    );
}

/**
 * Row component
 * Renders a row of panes
 * @param {Object} props - Component props
 * @param {Object} props.row - Row object with panes array
 * @param {Object} props.entries - Object mapping pane names to entry arrays
 */
function Row({ row, entries = {} }) {
    const { panes, height } = row;

    // Separate docked panes
    const dockedTop = panes.filter(p => p.dock === 'top');
    const dockedBottom = panes.filter(p => p.dock === 'bottom');
    const dockedLeft = panes.filter(p => p.dock === 'left');
    const dockedRight = panes.filter(p => p.dock === 'right');
    const normalPanes = panes.filter(p => !p.dock);

    // Build row style
    const rowStyle = {};
    if (height !== null && height !== undefined) {
        rowStyle.height = `${height}vh`;
        rowStyle.minHeight = `${height}vh`;
    }

    return (
        <div
            className="pane-row flex flex-col lg:flex-row w-full"
            style={rowStyle}
        >
            {/* Docked left panes */}
            {dockedLeft.map((pane, index) => (
                <Pane
                    key={`${pane.name}-${index}`}
                    pane={pane}
                    entries={entries[pane.name] || []}
                />
            ))}

            {/* Normal panes */}
            <div className="flex flex-col lg:flex-row flex-1">
                {/* Docked top panes */}
                {dockedTop.map((pane, index) => (
                    <Pane
                        key={`${pane.name}-${index}`}
                        pane={pane}
                        entries={entries[pane.name] || []}
                    />
                ))}

                {/* Normal panes */}
                {normalPanes.map((pane, index) => (
                    <Pane
                        key={`${pane.name}-${index}`}
                        pane={pane}
                        entries={entries[pane.name] || []}
                    />
                ))}

                {/* Docked bottom panes */}
                {dockedBottom.map((pane, index) => (
                    <Pane
                        key={`${pane.name}-${index}`}
                        pane={pane}
                        entries={entries[pane.name] || []}
                    />
                ))}
            </div>

            {/* Docked right panes */}
            {dockedRight.map((pane, index) => (
                <Pane
                    key={`${pane.name}-${index}`}
                    pane={pane}
                    entries={entries[pane.name] || []}
                />
            ))}
        </div>
    );
}

/**
 * PaneGrid component
 * Renders all rows of panes in a responsive grid layout
 * @param {Object} props - Component props
 * @param {Array} props.rows - Array of row objects (new format)
 * @param {Array} props.panes - Array of pane objects (legacy format, for backward compatibility)
 * @param {Object} props.entries - Object mapping pane names to entry arrays
 */
export function PaneGrid({ rows, panes, entries = {} }) {
    // Handle backward compatibility: if panes array is provided, convert to rows format
    const rowsToRender = rows || (panes ? [{ row: 0, panes, height: null }] : []);

    if (rowsToRender.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">No panes configured</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-4">
                {rowsToRender.map((row, index) => (
                    <Row
                        key={index}
                        row={row}
                        entries={entries}
                    />
                ))}
            </div>
        </div>
    );
}

export default PaneGrid;
