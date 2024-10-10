import {Button, Center, Stack, Text} from "@mantine/core";
import {useGameContext} from "../../gameService/GameContext.tsx";
import StageContainer from "../../components/StageContainer.tsx";

export default function AboutStagePage() {
    const {state, isLeader, service} = useGameContext("about");

    return (
        <StageContainer roomCode={state.roomCode}>
            <Center h="100%">
                <Stack p={20} align="center">
                    {state.currentTurn === state.ownId ? (
                        <Text size="xl">Ваша очередь рассказывать о себе</Text>
                    ) : (
                        <Text size="xl">
                            Сейчас рассказывает о себе {state.players.find(p => p.id === state.currentTurn)?.name}
                        </Text>
                    )}
                    {state.currentTurn === state.ownId ? (
                        <Button
                            size="lg" w="80%"
                            onClick={() => service.action_next_turn()}
                        >Я всё</Button>
                    ) : (isLeader && (
                        <Button
                            size="lg" w="80%"
                            onClick={() => service.action_leader_skip_turn()}
                        >Идём дальше</Button>
                    ))}
                </Stack>
            </Center>
        </StageContainer>
    );
}