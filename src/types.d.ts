interface Player {
    readonly id: number;
    readonly name: string;
    connected: boolean;
}
type PlayerId = Player["id"];

interface Fact {
    readonly id: number;
    readonly text: string;
}
type FactId = Fact["id"];

type PlayerFinalAnswer = [FactId, PlayerId][];

interface PlayerFinalResult {
    ownAnswer: PlayerFinalAnswer;
    rightAnswer: PlayerFinalAnswer;
    guesses: {playerId: PlayerId, factId: FactId, guessedBy: PlayerId[]}[];
    resultTable: [PlayerId, number][];
}

type GameStage = "waiting" | "facts" | "about" | "turns" | "answers" | "final";
type RoomState<S extends GameStage = GameStage> = {
    stage: S;
    roomCode: string;
    leaderId: PlayerId;
    ownId: PlayerId;
    players: Player[];
} & ({
    waiting: {
        readyPlayers: PlayerId[];
    };
    facts: {
        ownFactId: FactId | null;
        facts: Fact[];
    };
    about: {
        ownFactId: FactId;
        facts: Fact[];
        currentTurn: PlayerId;
    };
    turns: {
        ownFactId: FactId;
        facts: Fact[];
        currentTurn: PlayerId;
        candidates: [FactId, PlayerId[]][];
    };
    answers: {
        ownFactId: FactId;
        facts: Fact[];
        candidates: [FactId, PlayerId[]][];
        answer: PlayerFinalAnswer | null;
        answersSent: PlayerId[];
    }
    final: {
        ownFactId: FactId;
        facts: Fact[];
        result: PlayerFinalResult;
    };
}[S]);

interface ActionProcessor<K extends GameActionKey = GameActionKey> {
    state: "preparing" | "sent" | "succeed" | "error" | "failed";
    onSuccessfulSend(callback: () => void): this;
    onTimeout(callback: () => void): this;
    onSuccess(callback: (data: ActionsMap[K]["answer"]) => void): this;
    onError(callback: (error: string) => void): this;
    onFail(callback: () => void): this;
    finally(callback: () => void): this;
    handleSuccess(data: ActionsMap[K]["answer"]): void;
    handleError(error: string): void;
    handleFail(): void;
    send(data: ActionsMap[K]["data"]): void;
}
interface ITransport {
    connect(): void;
    disconnect(): void;
    onConnect(callback: () => void): () => void;
    onDisconnect(callback: () => void): () => void;
    onEvent(callback: (event: GameEvent) => void): () => void;
    createAction<K extends GameActionKey>(key: K): ActionProcessor<K>;
}
