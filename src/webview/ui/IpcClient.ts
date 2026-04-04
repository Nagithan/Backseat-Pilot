import { WebviewMessage, IpcMessageId, AppState, ExtensionMessage } from "../../types/index.js";

declare function acquireVsCodeApi<T = unknown>(): {
    postMessage(message: WebviewMessage): void;
    getState(): T;
    setState(data: T): void;
};

export class IpcClient {
    private vscode = acquireVsCodeApi<AppState>();

    public postMessage(message: WebviewMessage): void {
        this.vscode.postMessage(message);
    }

    public getState(): AppState | undefined {
        return this.vscode.getState();
    }

    public setState(state: AppState): void {
        this.vscode.setState(state);
    }

    public onMessage(callback: (message: ExtensionMessage) => void): void {
        window.addEventListener('message', (event) => callback(event.data));
    }

    public ready(): void {
        this.postMessage({ type: IpcMessageId.READY });
    }
}
