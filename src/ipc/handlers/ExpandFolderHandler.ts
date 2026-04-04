import { WebviewMessage, IpcMessageId } from '../../types/index.js';
import { IIpcMessageHandler } from './IpcHandler.js';
import { IWebviewAccess } from './IWebviewAccess.js';
import { FileManager } from '../../core/FileManager.js';

/**
 * Lazy-loading handler for file tree exploration.
 * Fetches children for a specific folder path on-demand.
 */
export class ExpandFolderHandler implements IIpcMessageHandler {
    constructor(private webview: IWebviewAccess) {}

    async execute(message: WebviewMessage) {
        if (message.type === IpcMessageId.EXPAND_FOLDER) {
            const folderPath = message.payload;
            try {
                const children = await FileManager.getFolderChildren(folderPath);
                
                this.webview.postMessage({ 
                    type: 'folderChildren', 
                    payload: { parentPath: folderPath, children } 
                });
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : String(error);
                this.webview.sendStatus('error', `Failed to expand folder: ${message}`);
                // Also send empty children to clear the loading state in UI
                this.webview.postMessage({ 
                    type: 'folderChildren', 
                    payload: { parentPath: folderPath, children: [] } 
                });
            }
        }
    }
}
