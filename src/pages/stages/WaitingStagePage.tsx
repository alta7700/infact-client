import {Avatar, Button, Center, Grid, Indicator, rem, ScrollArea, Text} from "@mantine/core";
import {IconCheck, IconCrown, IconX} from "@tabler/icons-react";
import {useGameContext} from "../../gameService/GameContext";
import StageContainer from "../../components/StageContainer.tsx";
import {getAvatarUrl} from "../../utils.ts";

export default function WaitingStagePage() {
    const {state, isLeader, service} = useGameContext("waiting");

    const allAreReady = state.players.every(p => p.id === state.leaderId || state.readyPlayers.includes(p.id))
    const isReady = state.readyPlayers.includes(state.ownId);

    return (
        <StageContainer roomCode={state.roomCode}>
            <ScrollArea flex={1}>
                <Grid columns={2} pt={15} px={15}>
                    {state.players.map((player) => {
                        const playerIsLeader = player.id === state.leaderId;
                        const playerIsReady = state.readyPlayers.includes(player.id);
                        return (
                            <Grid.Col span={1} key={player.id}>
                                <Center>
                                    <Indicator
                                        styles={{indicator: {paddingInline: rem(0)}}}
                                        inline
                                        size={24}
                                        offset={10}
                                        color={playerIsLeader ? "yellow" : playerIsReady ? "green" : "red"}
                                        label={playerIsLeader ? (
                                            <IconCrown size={20} color="white"/>
                                        ) : playerIsReady ? (
                                            <IconCheck color="white"/>
                                        ) : (
                                            <IconX color="white"/>
                                        )}
                                    >
                                        <Avatar
                                            name={player.name}
                                            color="initials"
                                            size="xl"
                                            src={player.photo && getAvatarUrl(player.photo)}
                                        />
                                    </Indicator>
                                </Center>
                                <Text ta="center">{player.name}</Text>
                            </Grid.Col>
                        )
                    })}
                </Grid>
            </ScrollArea>
            <Center my={15}>
                {isLeader ? (
                    <Button
                        size="lg"
                        miw="35%"
                        disabled={!allAreReady}
                        onClick={() => service.action_start_facts()}
                    >Начать игру</Button>
                ) : (
                    <Button
                        size="lg"
                        miw="35%"
                        bg={isReady ? "red" : "green"}
                        onClick={() => service.action_send_ready_state(!isReady)}
                    >
                        {isReady ? "Не готов" : "Готов"}
                    </Button>
                )}
            </Center>
        </StageContainer>
    );
};
