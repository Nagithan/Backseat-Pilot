import { WebviewMessage, IpcMessageId } from '../../types/index.js';
import { IIpcMessageHandler } from './IpcHandler.js';
import { IWebviewAccess } from './IWebviewAccess.js';

/**
 * Handler for the webview 'ready' signal.
 * Triggers the initial state synchronization (presets, selection, etc.).
 */
export class ReadyHandler implements IIpcMessageHandler {
    constructor(private webview: IWebviewAccess) {}

    async execute(message: WebviewMessage) {
        if (message.type === IpcMessageId.READY) {
            await this.webview.sendInitialState();
        }
    }
}
