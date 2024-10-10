import React, {useContext, useEffect, useState} from "react";
import GameService from "./GameService";
import {setPlayerConnected} from "./callbacks";
import StageWatcher from "../components/StageWatcher.tsx";

interface IGameContext<S extends GameStage = GameStage> {
    state: RoomState<S>;
    isLeader: boolean;
    service: GameService;
}

// @ts-ignore
const GameContext = React.createContext<IGameContext>();

export function useGameContext<S extends GameStage = GameStage>(...stages: S[]): IGameContext<NonNullable<S>> {
    const result = useContext(GameContext);
    if (stages.length > 0 && !stages.includes(result.state.stage as S))
        throw Error("component is unavailable here.");
    return result as IGameContext<S>;
}

interface GameContextProviderProps {
    getTransport: () => ITransport;
    children: React.ReactNode;
}

export default function GameContextProvider({getTransport, children}: GameContextProviderProps) {

    const [roomState, setRoomState] = useState<RoomState>();

    // as any, чтобы не заморачиваться с RoomState | undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [service] = useState<GameService>(() => new GameService(getTransport, setRoomState as any));

    useEffect(() => {
        const unsubscribeDisconnect = service.onDisconnect(() => {
            setRoomState(prev => prev && setPlayerConnected(prev.ownId, false, prev));
            setTimeout(() => service.connect(), 2000);
        });
        service.connect();

        return () => {
            unsubscribeDisconnect();
            service.closed = true;
            service.disconnect();
        }
    }, [service]);

    if (!roomState) return <></>;

    return (
        <GameContext.Provider value={{
            state: roomState,
            isLeader: roomState.leaderId === roomState.ownId,
            service,
        }}>
            <StageWatcher stage={roomState.stage}/>
            {children}
        </GameContext.Provider>
    );
}
