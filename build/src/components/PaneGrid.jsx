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
 * @param {Object} props.pane - Pane object with name and width
 * @param {Array} props.entries - Array of entry objects for this pane
 */
function Pane({ pane, entries = [] }) {
    return (
        <div
            className={cn(
                "pane flex flex-col p-4 min-h-0",
                entries.length === 0 && "opacity-50"
            )}
            style={{ width: `${pane.width}%` }}
        >
            {entries.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                    <p className="text-sm italic">No content for {pane.name}</p>
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
 * PaneGrid component
 * Renders all panes in a responsive grid layout
 * @param {Object} props - Component props
 * @param {Array} props.panes - Array of pane objects
 * @param {Object} props.entries - Object mapping pane names to entry arrays
 */
export function PaneGrid({ panes = [], entries = {} }) {
    if (panes.length === 0) {
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
            <div className="flex flex-wrap lg:flex-nowrap gap-4">
                {panes.map((pane, index) => (
                    <Pane
                        key={index}
                        pane={pane}
                        entries={entries[pane.name] || []}
                    />
                ))}
            </div>
        </div>
    );
}

export default PaneGrid;
