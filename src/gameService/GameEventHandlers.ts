import {SimpleHandler} from "../utils";

export default class GameEventHandlers {
    handlers: {[K in GameEventKey]: SimpleHandler<[GameEvent<K>["data"]]>};
    constructor() {
        this.handlers = {
            room_state_load: new SimpleHandler(),
            player_new: new SimpleHandler(),
            player_ready_state: new SimpleHandler(),
            player_disconnect: new SimpleHandler(),
            player_reconnect: new SimpleHandler(),
            player_exclude: new SimpleHandler(),
            leader_switch: new SimpleHandler(),
            fact_new: new SimpleHandler(),
            fact_drop: new SimpleHandler(),
            turn_new: new SimpleHandler(),
            answer_sent: new SimpleHandler(),
            answer_drop: new SimpleHandler(),
        };
    }

    subscribe<K extends GameEventKey>(key: K, handler: (data: GameEvent<K>["data"]) => void): () => void {
        return this.handlers[key].subscribe(handler);
    }

    unsubscribe<K extends GameEventKey>(key: K, handler: (data: GameEvent<K>["data"]) => void) {
        return this.handlers[key].unsubscribe(handler);
    }

    handle<K extends GameEventKey>(key: K, data: GameEvent<K>["data"]) {
        this.handlers[key].handle(data);
    }
}