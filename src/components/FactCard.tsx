import {useState} from "react";
import {Avatar, AvatarGroup, Checkbox, Drawer, Flex, Group, Paper, Text} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {useGameContext} from "../gameService/GameContext.tsx";

export interface FactCardProps {
    fact: Fact;
    candidates: Player[];
    onClick: () => void;
    error: boolean;
}

export default function FactCard({fact, candidates, onClick, error}: FactCardProps) {

    return (
        <Paper
            key={fact.id}
            p="xs" shadow="md" bg="white" radius="sm"
            w="100%"
            onClick={onClick}
            style={error ? {outline: "var(--mantine-color-red-3) 2px solid"} : undefined}
        >
            <Group align="center">
                <Text
                    flex={1}
                    inline
                    lh="xs"
                    style={{textWrap: "wrap"}}
                    component="pre"
                    ff="text"
                >{fact.text}</Text>
                <AvatarGroup>
                    {candidates.length === 1 ? (
                        <Avatar name={candidates[0].name} color="initials"/>
                    ) : (
                        <Avatar name={candidates.length === 0 ? "?" : `+${candidates.length}`}/>
                    )}
                </AvatarGroup>
            </Group>
        </Paper>
    );

}

function FactCardWithCandidates({drawerTitle, fact, candidates, error}: Omit<FactCardProps, "onClick"> & {drawerTitle: string}) {
    const {state, service} = useGameContext("turns", "answers");
    const [opened, {open, close}] = useDisclosure(false);

    const [chosenCandidates, setChosenCandidates] = useState<PlayerId[]>(candidates.map(p => p.id));

    return (
        <>
            <FactCard fact={fact} candidates={candidates} onClick={open} error={error}/>
            <Drawer
                opened={opened}
                onClose={() => {
                    service.action_change_candidates(fact.id, chosenCandidates, (action => {
                        action.onError(setChosenCandidates.bind(null, candidates.map(p => p.id)));
                        action.onFail(setChosenCandidates.bind(null, candidates.map(p => p.id)));
                    }));
                    close();
                }}
                title={drawerTitle}
                position="bottom"
                size="70%"
            >
                <Flex direction="column">
                    {state.players.map((p) => p.id !== state.ownId && (
                        <Checkbox.Card
                            key={p.id}
                            w="100%"
                            radius={0}
                            checked={chosenCandidates.includes(p.id)}
                            onClick={() => setChosenCandidates(
                                prev => prev.includes(p.id)
                                    ? prev.filter(id => id !== p.id)
                                    : [...prev, p.id]
                            )}
                        >
                            <Flex direction="row" gap="md" align="center" p={10}>
                                <Checkbox.Indicator/>
                                <Avatar name={p.name} color="initials" size="md"/>
                                <Text size="md">{p.name}</Text>
                            </Flex>
                        </Checkbox.Card>
                    ))}
                </Flex>
            </Drawer>
        </>
    );
}

FactCard.WithCandidates = FactCardWithCandidates;
