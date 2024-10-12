import {getRandomString, SimpleHandler} from "../utils";
import {notifications} from "@mantine/notifications";

export default class ClientWebSocketTransport implements ITransport {
    private _connection: WebSocket | undefined;
    eventHandlers: SimpleHandler<[GameEvent]>;
    connectHandler: SimpleHandler<[]>;
    disconnectHandler: SimpleHandler<[]>;
    waitedActions: {[k: string]: WebSocketActionProcessor<any>};

    userId: PlayerId;
    userName: string;
    room: string;

    constructor(
        id: PlayerId, name: string, room: string,
    ) {
        this.userId = id;
        this.userName = name;
        this.room = room;
        this.eventHandlers = new SimpleHandler();
        this.connectHandler = new SimpleHandler();
        this.disconnectHandler = new SimpleHandler();
        this.waitedActions = {};
    }

    get connection(): WebSocket | null {
        if (this._connection && this._connection.readyState === WebSocket.OPEN)
            return this._connection;
        else
            return null;
    }

    connect() {
        this.waitedActions = {};

        const url = new URL(import.meta.env.VITE_SERVER_BASE_URL);
        url.searchParams.append("id", this.userId.toString());
        url.searchParams.append("name", this.userName);
        url.searchParams.append("room", this.room.toUpperCase());

        const connection = new WebSocket(url);
        this._connection = connection;

        connection.addEventListener("open", () => {
            this.connectHandler.handle();
        });

        connection.addEventListener("close", () => {
            Object.values(this.waitedActions).forEach(a => a.cancel());
            this.waitedActions = {};
            this.disconnectHandler.handle();
        });

        connection.addEventListener("message", (ev) => {
            const message = JSON.parse(ev.data as string);
            if (message.type === "event") {
                this.eventHandlers.handle({key: message.key, data: message.data});
            } else if (message.type === "answer") {
                const action = this.waitedActions[message.nonce];
                const data = message.data as ActionAnswer;
                if ("success" in data) {
                    action.handleSuccess(data.success);
                } else if ("error" in data) {
                    action.handleError(data.error);
                }
            } else if (message.type === "error_connection") {
                notifications.show({
                    title: `Не удалось подключиться к комнате ${this.room.toUpperCase()}`,
                    message: `Причина: ${message.reason}`,
                    color: "var(--mantine-color-error)",
                })
            }
        });
    }

    disconnect() {
        this.connection?.close();
    }

    onConnect(callback: () => void): () => void {
        return this.connectHandler.subscribe(callback);
    }
    onDisconnect(callback: () => void): () => void {
        return this.disconnectHandler.subscribe(callback);
    }

    createAction<K extends GameActionKey>(key: K): ActionProcessor<K> {
        const nonce = getRandomString(25);
        const action = new WebSocketActionProcessor({
            key, nonce,
            getConnection: () => this.connection,
            timeout: 3000,
        }).onSuccessfulSend(() => {
            this.waitedActions[nonce] = action;
        }).onTimeout(() => this.disconnect());
        return action;
    }

    onEvent(callback: (event: GameEvent) => void): () => void {
        return this.eventHandlers.subscribe(callback);
    }
}

type ActionAnswer<K extends GameActionKey = GameActionKey> = {
    error: string;
} | {
    success: ActionsMap[K]["answer"];
}

class WebSocketActionProcessor<K extends GameActionKey = GameActionKey> implements ActionProcessor<K> {
    key: K;
    nonce: string;
    state: "preparing" | "sent" | "succeed" | "error" | "failed";
    getConnection: () => WebSocket | null;

    successHandler: SimpleHandler<[ActionsMap[K]["answer"]]>;
    errorHandler: SimpleHandler<[string]>;
    failHandler: SimpleHandler<[]>;
    finallyHandler: SimpleHandler<[]>;
    successfulSendHandler: SimpleHandler<[]>;
    timeoutHandler: SimpleHandler<[]>;

    timeoutTimer?: ReturnType<typeof setTimeout>;
    timeout: number;

    constructor({key, nonce, getConnection, timeout}: {
        key: K,
        nonce: string,
        getConnection: () => WebSocket | null,
        timeout: number
    }) {
        this.key = key;
        this.nonce = nonce;
        this.state = "preparing";
        this.getConnection = getConnection;

        this.successfulSendHandler = new SimpleHandler();
        this.timeoutHandler = new SimpleHandler();
        this.successHandler = new SimpleHandler();
        this.errorHandler = new SimpleHandler();
        this.failHandler = new SimpleHandler();
        this.finallyHandler = new SimpleHandler();

        this.timeout = timeout;
    }
    onSuccessfulSend(callback: () => void): this {
        this.successfulSendHandler.subscribe(callback);
        return this;
    }
    onTimeout(callback: () => void): this {
        this.timeoutHandler.subscribe(callback);
        return this;
    }

    onSuccess(callback: (data: ActionsMap[K]["answer"]) => void): this {
        this.successHandler.subscribe(callback);
        return this;
    }
    onError(callback: (error: string) => void): this {
        this.errorHandler.subscribe(callback);
        return this;
    }
    onFail(callback: () => void): this {
        this.failHandler.subscribe(callback);
        return this;
    }
    finally(callback: () => void): this {
        this.finallyHandler.subscribe(callback);
        return this;
    }

    handleSuccess(data: ActionsMap[K]["answer"]) {
        if (this.state !== "sent") return;
        clearTimeout(this.timeoutTimer);
        this.state = "succeed";
        this.withFinally(() => this.successHandler.handle(data));
    }
    handleError(error: string) {
        if (this.state !== "sent") return;
        clearTimeout(this.timeoutTimer);
        this.state = "error";
        this.withFinally(() => this.errorHandler.handle(error));
    }
    handleFail() {
        if (this.state !== "sent") return;
        clearTimeout(this.timeoutTimer);
        this.state = "failed";
        this.withFinally(() => this.failHandler.handle());
    }

    private withFinally(callback: () => void) {
        try {
            callback();
        } finally {
            this.finallyHandler.handle()
        }
    }

    send(data: ActionsMap[K]["data"]) {
        if (this.state !== "preparing") return;
        const conn = this.getConnection();
        if (!conn) {
            this.handleFail();
            return;
        }
        conn.send(JSON.stringify({key: this.key, nonce: this.nonce, data}));
        this.state = "sent";
        this.successfulSendHandler.handle();
        this.timeoutTimer = setTimeout(this.cancel, this.timeout);
    }
    cancel() {
        if (this.state !== "sent") return;
        this.withFinally(() => {
            this.state = "failed";
            this.timeoutHandler.handle();
            this.failHandler.handle();
        })
    }
}
