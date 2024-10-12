import {
    Avatar,
    AvatarGroup,
    Blockquote,
    Button,
    Collapse,
    Grid,
    Group,
    ScrollArea,
    Stack,
    Text
} from "@mantine/core";
import {useGameContext} from "../../gameService/GameContext.tsx";
import StageContainer from "../../components/StageContainer.tsx";
import {useDisclosure} from "@mantine/hooks";
import {getAvatarUrl} from "../../utils.ts";

export default function FinalStagePage() {
    const {state} = useGameContext("final");

    const [opened, {toggle}] = useDisclosure(false);

    return (
        <StageContainer roomCode={state.roomCode}>
            <Stack maw={400} p={20}>
                <Button onClick={toggle}>{
                    opened ? "Закрыть таблицу результатов" : "Открыть таблицу результатов"
                }</Button>

                <Collapse in={opened}>
                    <Grid columns={4}>
                        {state.result.resultTable.sort(([, score1], [, score2]) => score2 - score1).map(([playerId, score]) =>
                            <>
                                <Grid.Col span={3} style={{borderBottom: "solid 1px var(--mantine-color-dark-1)"}}>
                                    <Text>{state.players.find(p => p.id === playerId)!.name}</Text>
                                </Grid.Col>
                                <Grid.Col span={1} style={{borderBottom: "solid 1px var(--mantine-color-dark-1)"}}>
                                    <Text ta="end">{score}</Text>
                                </Grid.Col>
                            </>
                        )}
                    </Grid>
                </Collapse>
            </Stack>
            <ScrollArea flex={1}>
                <Stack p={20}>
                    {state.facts.map(fact => {
                        const guesses = state.result.guesses.find(f => f.factId === fact.id)!;
                        const myFactAnswer = state.result.ownAnswer.find(([factId]) => factId === fact.id)?.[1];
                        return (
                            <Blockquote
                                key={fact.id}
                                py="xs"
                                px="md"
                                color={myFactAnswer === undefined
                                    ? "blue.3"
                                    : myFactAnswer === guesses.playerId ? "green.6" : "red.6"
                                }
                                cite={`- ${state.players.find(p => p.id === guesses.playerId)!.name}`}
                            >
                                <Group gap={10} >
                                    <Text flex={1}>{fact.text}</Text>
                                    <AvatarGroup>
                                        {guesses.guessedBy.length <= 4 ? (
                                            guesses.guessedBy.map(playerId => {
                                                const player = state.players.find(p => p.id === playerId)!;
                                                return (
                                                    <Avatar
                                                        key={player.id}
                                                        name={player.name}
                                                        color="initials"
                                                        src={player.photo && getAvatarUrl(player.photo)}
                                                    />
                                                )
                                            })
                                        ) : (
                                            <>
                                                {[0, 1, 2].map(i => {
                                                    const player = state.players.find(p => p.id === guesses.guessedBy[i])!;
                                                    return (
                                                        <Avatar
                                                            key={player.id}
                                                            name={player.name}
                                                            color="initials"
                                                            src={player.photo && getAvatarUrl(player.photo)}
                                                        />
                                                    )
                                                })}
                                                <Avatar name={`+${guesses.guessedBy.length - 3}`}/>
                                            </>
                                        )}
                                    </AvatarGroup>
                                </Group>
                            </Blockquote>
                        )
                    })}
                </Stack>
            </ScrollArea>
        </StageContainer>
    );
}