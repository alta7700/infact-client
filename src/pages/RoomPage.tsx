import {useEffect} from "react";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {notifications} from "@mantine/notifications";
import GameContextProvider from "../gameService/GameContext";
import ClientWebSocketTransport from "../gameService/transport";
import StagePage from "./stages/StagePage";
import AppContainer from "../components/AppContainer.tsx";
import {getUserTgId, getUserTgName} from "../utils.ts";

export default function RoomPage() {
    const params = useParams<{room: string}>();
    const [search] = useSearchParams();

    const id = getUserTgId();
    const name = search.get("name") ?? getUserTgName();
    const room = params.room;

    const navigate = useNavigate();

    useEffect(() => {
        if (id === null || !name || !(room && room.length === 4)) {
            notifications.show({
                message: "Не удалось подключиться с комнате.",
                color: "var(--mantine-color-error)",
            });
            navigate("/");
        }
    }, [id, name, room, navigate]);

    if (id === null || !name || !(room && room.length === 4)) {
        return <></>
    }

    return (
        <AppContainer>
            <GameContextProvider getTransport={() => new ClientWebSocketTransport(id, name, room)}>
                <StagePage/>
            </GameContextProvider>
        </AppContainer>
    )
}