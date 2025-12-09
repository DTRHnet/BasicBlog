import { parsePanes, validateEntriesAgainstPanes } from '../src/utils/panesParser.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Panes Parser', () => {
    describe('parsePanes', () => {
        test('should parse valid panes configuration', () => {
            const testConfig = '|sidebar 25|main 50|footer 25|';
            const testPath = path.join(__dirname, 'test-panes.cfg');

            fs.writeFileSync(testPath, testConfig);

            const result = parsePanes(testPath);

            expect(result).toHaveLength(3);
            expect(result[0]).toEqual({ name: 'sidebar', width: 25 });
            expect(result[1]).toEqual({ name: 'main', width: 50 });
            expect(result[2]).toEqual({ name: 'footer', width: 25 });

            fs.unlinkSync(testPath);
        });

        test('should handle panes without widths', () => {
            const testConfig = '|left|center|right|';
            const testPath = path.join(__dirname, 'test-panes-auto.cfg');

            fs.writeFileSync(testPath, testConfig);

            const result = parsePanes(testPath);

            expect(result).toHaveLength(3);
            expect(result[0].width).toBeCloseTo(33.33, 1);
            expect(result[1].width).toBeCloseTo(33.33, 1);
            expect(result[2].width).toBeCloseTo(33.33, 1);

            fs.unlinkSync(testPath);
        });

        test('should normalize widths that exceed 100%', () => {
            const testConfig = '|pane1 60|pane2 60|';
            const testPath = path.join(__dirname, 'test-panes-overflow.cfg');

            fs.writeFileSync(testPath, testConfig);

            const result = parsePanes(testPath);

            const totalWidth = result.reduce((sum, pane) => sum + pane.width, 0);
            expect(totalWidth).toBeCloseTo(100, 1);

            fs.unlinkSync(testPath);
        });

        test('should return default pane for missing file', () => {
            const result = parsePanes('./nonexistent.cfg');

            expect(result).toEqual([{ name: 'main', width: 100 }]);
        });

        test('should return default pane for empty file', () => {
            const testPath = path.join(__dirname, 'test-panes-empty.cfg');

            fs.writeFileSync(testPath, '');

            const result = parsePanes(testPath);

            expect(result).toEqual([{ name: 'main', width: 100 }]);

            fs.unlinkSync(testPath);
        });

        test('should skip panes with invalid names', () => {
            const testConfig = '|valid|invalid name|another-valid|';
            const testPath = path.join(__dirname, 'test-panes-invalid.cfg');

            fs.writeFileSync(testPath, testConfig);

            const result = parsePanes(testPath);

            expect(result).toHaveLength(2);
            expect(result.find(p => p.name === 'valid')).toBeDefined();
            expect(result.find(p => p.name === 'another-valid')).toBeDefined();
            expect(result.find(p => p.name === 'invalid name')).toBeUndefined();

            fs.unlinkSync(testPath);
        });

        test('should handle mixed fixed and auto widths', () => {
            const testConfig = '|sidebar 20|main|footer 10|';
            const testPath = path.join(__dirname, 'test-panes-mixed.cfg');

            fs.writeFileSync(testPath, testConfig);

            const result = parsePanes(testPath);

            expect(result).toHaveLength(3);
            expect(result[0]).toEqual({ name: 'sidebar', width: 20 });
            expect(result[1].width).toBeCloseTo(70, 1); // 100 - 20 - 10
            expect(result[2]).toEqual({ name: 'footer', width: 10 });

            fs.unlinkSync(testPath);
        });
    });

    describe('validateEntriesAgainstPanes', () => {
        test('should validate entries against panes', () => {
            const panes = [
                { name: 'sidebar', width: 25 },
                { name: 'main', width: 75 }
            ];

            const entries = {
                sidebar: [{ type: 'text', content: 'Sidebar content' }],
                main: [{ type: 'markdown', content: '# Main content' }]
            };

            const result = validateEntriesAgainstPanes(entries, panes);

            expect(result).toEqual(entries);
        });

        test('should skip entries for non-existent panes', () => {
            const panes = [
                { name: 'main', width: 100 }
            ];

            const entries = {
                main: [{ type: 'text', content: 'Main content' }],
                sidebar: [{ type: 'text', content: 'Sidebar content' }]
            };

            const result = validateEntriesAgainstPanes(entries, panes);

            expect(result.main).toBeDefined();
            expect(result.sidebar).toBeUndefined();
        });

        test('should handle empty entries', () => {
            const panes = [
                { name: 'main', width: 100 }
            ];

            const entries = {};

            const result = validateEntriesAgainstPanes(entries, panes);

            expect(result).toEqual({});
        });
    });
});
