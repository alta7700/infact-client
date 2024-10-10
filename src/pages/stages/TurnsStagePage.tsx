import {Button, Divider, rem, ScrollArea, Stack, Text} from "@mantine/core";
import {useGameContext} from "../../gameService/GameContext.tsx";
import StageContainer from "../../components/StageContainer.tsx";
import FactCard from "../../components/FactCard.tsx";

export default function TurnsStagePage() {
    const {state, isLeader, service} = useGameContext("turns");

    return (
        <StageContainer roomCode={state.roomCode}>
            <Stack p={20} align="center">
                {state.currentTurn === state.ownId ? (
                    <Text size="xl">Ваша очередь задават вопрос</Text>
                ) : (
                    <Text size="xl">
                        Очередь {state.players.find(p => p.id === state.currentTurn)?.name} задавать вопрос
                    </Text>
                )}
                {state.currentTurn === state.ownId ? (
                    <Button
                        w="70%"
                        onClick={() => service.action_next_turn()}
                    >Я всё</Button>
                ) : (isLeader && (
                    <Button
                        w="70%"
                        onClick={() => service.action_leader_skip_turn()}
                    >Идём дальше</Button>
                ))}
            </Stack>
            <Divider h={rem(2)} title="Факты"/>
            <ScrollArea flex={1}>
                <Stack pt={20} pb={30} px={20}>
                    {state.facts.map(fact =>
                        fact.id !== state.ownFactId && (
                            <FactCard.WithCandidates
                                key={fact.id}
                                drawerTitle={"Выберите кондидато на этот факт."}
                                fact={fact}
                                candidates={state.candidates
                                    .find(([factId]) => fact.id === factId)![1]
                                    .map(id => state.players.find(p => p.id === id)!)
                                }
                                error={false}
                            />
                        )
                    )}
                </Stack>
            </ScrollArea>
        </StageContainer>
    );
}
