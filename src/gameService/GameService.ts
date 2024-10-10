import GameEventHandlers from "./GameEventHandlers";
import {
    addFact,
    addPlayer, addPlayerAnswerSent, changeCandidates, dropFact, dropMyAnswer, dropPlayerAnswerSent,
    excludePlayer,
    setLeader, setMyAnswer,
    setPlayerConnected,
    setPlayerReadyState, setTurn
} from "./callbacks";
import {notifications} from "@mantine/notifications";

export default class GameService {
    transport: ITransport;
    eventHandler: GameEventHandlers;
    setRoomState: <S extends GameStage = GameStage>(value: RoomState | ((prev: RoomState<S>) => RoomState<S>)) => void;

    closed: boolean;

    constructor(
        createTransport: () => ITransport,
        setRoomState: <S extends GameStage>(value: RoomState | ((prev: RoomState<S>) => RoomState<S>)) => void,
    ) {
        this.closed = false;
        this.transport = createTransport();
        this.eventHandler = new GameEventHandlers();
        this.transport.onEvent(({key, data}) => this.eventHandler.handle(key, data));
        this.setRoomState = setRoomState;
        this.subscribeEventsDefaults();
    }

    on<K extends GameEventKey>(key: K, callback: (data: GameEvent<K>["data"]) => void): () => void {
        return this.eventHandler.subscribe(key, callback);
    }
    onConnect(callback: () => void): () => void {
        return this.transport.onConnect(callback);
    }
    onDisconnect(callback: () => void): () => void {
        return this.transport.onDisconnect(callback);
    }

    connect() {
        if (!this.closed) {
            this.transport.connect();
        }
    }
    disconnect() {
        this.transport.disconnect();
    }

    createAction<K extends GameActionKey>(key: K): ActionProcessor<K> {
        return this.transport
            .createAction(key)
            .onError(this.showActionErrorNotification)
            .onFail(() => this.showActionErrorNotification("Не удалось выполнить запрос."))
    }

    action_send_ready_state(value: boolean, beforeSend?: (act: ActionProcessor<"send_ready_state">) => void) {
        const action = this.createAction("send_ready_state")
            .onSuccess((data) =>
                this.setRoomState<"waiting">(prev =>
                    setPlayerReadyState(prev.ownId, data.state, prev)
                )
            )
        beforeSend?.(action);
        action.send({state: value});
    }

    action_start_facts(beforeSend?: (act: ActionProcessor<"start_facts">) => void) {
        const action = this.createAction("start_facts");
        beforeSend?.(action);
        action.send({});
    }

    action_fact_add(text: string, beforeSend?: (act: ActionProcessor<"fact_add">) => void) {
        const action = this.createAction("fact_add")
            .onSuccess(({fact}) => this.setRoomState(addFact.bind(null, fact, true)))
        beforeSend?.(action);
        action.send({text});
    }
    action_fact_drop(beforeSend?: (act: ActionProcessor<"fact_drop">) => void) {
        const action = this.createAction("fact_drop")
            .onSuccess(() => this.setRoomState<"facts">(prev => dropFact(prev.ownFactId!, prev)));
        beforeSend?.(action);
        action.send({});
    }

    action_start_about(beforeSend?: (act: ActionProcessor<"start_about">) => void) {
        const action = this.createAction("start_about");
        beforeSend?.(action);
        action.send({});
    }

    action_next_turn(beforeSend?: (act: ActionProcessor<"next_turn">) => void) {
        const action = this.createAction("next_turn")
            .onSuccess(({nextPlayerId}) =>
                nextPlayerId !== null && this.setRoomState(setTurn.bind(null, nextPlayerId))
            );
        beforeSend?.(action);
        action.send({});

    }
    action_leader_skip_turn(beforeSend?: (act: ActionProcessor<"leader_skip_turn">) => void) {
        const action = this.createAction("leader_skip_turn")
            .onSuccess(({nextPlayerId}) =>
                nextPlayerId !== null && this.setRoomState(setTurn.bind(null, nextPlayerId))
            );
        beforeSend?.(action);
        action.send({});
    }

    action_change_candidates(factId: FactId, players: PlayerId[], beforeSend?: (act: ActionProcessor<"change_candidates">) => void) {
        const action = this.createAction("change_candidates")
            .onSuccess(() => this.setRoomState(changeCandidates.bind(null, factId, players)));
        beforeSend?.(action);
        action.send({factId, players});
    }

    action_answer_send(answer: PlayerFinalAnswer, beforeSend?: (act: ActionProcessor<"answer_send">) => void) {
        const action = this.createAction("answer_send")
            .onSuccess(() => this.setRoomState(setMyAnswer.bind(null, answer)));
        beforeSend?.(action);
        action.send({answer});
    }

    action_answer_drop(beforeSend?: (act: ActionProcessor<"answer_drop">) => void) {
        const action = this.createAction("answer_drop")
            .onSuccess(() => this.setRoomState(dropMyAnswer));
        beforeSend?.(action);
        action.send({});
    }

    action_finish_game(beforeSend?: (act: ActionProcessor<"finish_game">) => void) {
        const action = this.createAction("finish_game");
        beforeSend?.(action);
        action.send({});
    }

    showActionErrorNotification(text: string): void {
        notifications.show({
            title: "Во время выполнения запроса произошла ошибка.",
            message: text,
            color: "var(--mantine-color-error)"
        })
    }

    subscribeEventsDefaults() {
        this.on(
            "room_state_load",
            (data) => this.setRoomState(data.state),
        );
        this.on(
            "player_new",
            (data) => this.setRoomState(addPlayer.bind(null, data.player)),
        );
        this.on(
            "player_ready_state",
            (data) => this.setRoomState(setPlayerReadyState.bind(null, data.playerId, data.state)),
        );
        this.on("player_disconnect", (data) => this.setRoomState(setPlayerConnected.bind(null, data.playerId, false)));
        this.on("player_reconnect", (data) => this.setRoomState(setPlayerConnected.bind(null, data.playerId, true)));
        this.on("player_exclude", (data) => this.setRoomState(excludePlayer.bind(null, data.playerId)));
        this.on("leader_switch", (data) => this.setRoomState(setLeader.bind(null, data.playerId)));

        this.on("fact_new", (data) => this.setRoomState(addFact.bind(null, data.fact, false)));
        this.on("fact_drop", (data) => this.setRoomState(dropFact.bind(null, data.factId)));

        this.on("turn_new", (data) => this.setRoomState(setTurn.bind(null, data.playerId)));

        this.on("answer_sent", (data) => this.setRoomState(addPlayerAnswerSent.bind(null, data.playerId)));
        this.on("answer_drop", (data) => this.setRoomState(dropPlayerAnswerSent.bind(null, data.playerId)));
    }
}
