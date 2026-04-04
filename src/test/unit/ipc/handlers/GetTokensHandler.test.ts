import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetTokensHandler } from '../../../../ipc/handlers/GetTokensHandler.js';
import { IpcMessageId } from '../../../../types/index.js';
import { PromptGenerator } from '../../../../core/PromptGenerator.js';
import { FileManager } from '../../../../core/FileManager.js';
import { TestUtils } from '../../../testUtils.js';

describe('GetTokensHandler Unit Tests', () => {
    let mockWebview: any;
    let handler: GetTokensHandler;

    beforeEach(async () => {
        await TestUtils.fullReset();
        mockWebview = {
            postMessage: vi.fn(),
            saveSelection: vi.fn()
        };
        handler = new GetTokensHandler(mockWebview);
    });

    it('should calculate file tokens on UPDATE_SELECTION and use them in GET_TOKENS', async () => {
        const selectedFiles = ['file1.js', 'file2.js'];
        const text = 'Instructions';

        vi.spyOn(PromptGenerator, 'estimateTokens').mockImplementation((input) => {
            if (input === 'Instructions') { return 10; }
            if (input === 'content1') { return 20; }
            if (input === 'content2') { return 30; }
            return 0;
        });

        vi.spyOn(FileManager, 'getFileContent').mockImplementation(async (path) => {
            if (path === 'file1.js') { return 'content1'; }
            if (path === 'file2.js') { return 'content2'; }
            return '';
        });

        // 1. Update Selection
        await handler.execute({
            type: IpcMessageId.UPDATE_SELECTION,
            payload: selectedFiles
        });

        expect(mockWebview.saveSelection).toHaveBeenCalledWith(selectedFiles);

        // 2. Get Tokens (should use cached file tokens)
        await handler.execute({
            type: IpcMessageId.GET_TOKENS,
            payload: { text }
        });

        expect(mockWebview.postMessage).toHaveBeenCalledWith({
            type: 'tokenUpdate',
            payload: {
                total: 60, // 10 (text) + 50 (cached files)
                prompts: 10,
                files: 50
            }
        });
    });

    it('should skip file tokens for strings starting with "[" (error/skip markers)', async () => {
        const selectedFiles = ['error.js', 'large.js', 'valid.js'];
        const text = '';

        vi.spyOn(PromptGenerator, 'estimateTokens').mockImplementation((input) => {
            if (input === 'valid content') { return 100; }
            if (input === '') { return 0; }
            return 5; // Should be ignored for error strings
        });

        vi.spyOn(FileManager, 'getFileContent').mockImplementation(async (path) => {
            if (path === 'error.js') { return '[Error reading file]'; }
            if (path === 'large.js') { return '[File too large]'; }
            if (path === 'valid.js') { return 'valid content'; }
            return '';
        });

        await handler.execute({
            type: IpcMessageId.UPDATE_SELECTION,
            payload: selectedFiles
        });

        await handler.execute({
            type: IpcMessageId.GET_TOKENS,
            payload: { text }
        });

        expect(mockWebview.postMessage).toHaveBeenCalledWith({
            type: 'tokenUpdate',
            payload: {
                total: 100, // Only valid.js content
                prompts: 0,
                files: 100
            }
        });
    });

    it('should handle unreadable files by skipping them during recalculation', async () => {
        const selectedFiles = ['readable.js', 'missing.js'];
        const text = '';

        vi.spyOn(PromptGenerator, 'estimateTokens').mockImplementation((input) => {
            if (input === 'content') { return 20; }
            return 0;
        });

        vi.spyOn(FileManager, 'getFileContent').mockImplementation(async (path) => {
            if (path === 'readable.js') { return 'content'; }
            throw new Error('File not found');
        });

        await handler.execute({
            type: IpcMessageId.UPDATE_SELECTION,
            payload: selectedFiles
        });

        await handler.execute({
            type: IpcMessageId.GET_TOKENS,
            payload: { text }
        });

        expect(mockWebview.postMessage).toHaveBeenCalledWith({
            type: 'tokenUpdate',
            payload: {
                total: 20,
                prompts: 0,
                files: 20
            }
        });
    });

    it('should ignore non-supported messages', async () => {
        await (handler as any).execute({
            type: IpcMessageId.MANAGE_PRESET,
            payload: {}
        });

        expect(mockWebview.postMessage).not.toHaveBeenCalled();
    });
});
