import {useGameContext} from "../../gameService/GameContext.tsx";
import StageContainer from "../../components/StageContainer.tsx";
import FactCard from "../../components/FactCard.tsx";
import {Button, ScrollArea, Stack, Text} from "@mantine/core";

export default function AnswersStagePage() {
    const {state, isLeader, service} = useGameContext("answers");

    const usedCandidates: PlayerId[] = [];
    const duplicatedCandidates: PlayerId[] = [];
    for (const [, candidates] of state.candidates) {
        if (candidates.length !== 1) continue;
        const candidate = candidates[0];
        if (usedCandidates.includes(candidate)) {
            duplicatedCandidates.push(candidate)
        } else {
            usedCandidates.push(candidate)
        }
    }

    const isReady =
        state.candidates.every(([,candidates]) => candidates.length === 1)
        && duplicatedCandidates.length === 0;

    const waitCount = state.players.length - state.answersSent.length

    return (
        <StageContainer roomCode={state.roomCode}>
            {state.answer === null ? (
                <>
                    <ScrollArea flex={1}>
                        <Stack pt={20} pb={30} px={20}>
                            {state.facts.map(fact => {
                                if (fact.id === state.ownFactId) return;
                                const candidates = state.candidates
                                    .find(([factId]) => fact.id === factId)![1]
                                    .map(id => state.players.find(p => p.id === id)!)
                                return (
                                    <FactCard.WithCandidates
                                        key={fact.id}
                                        drawerTitle={"Оставьте одного игрока"}
                                        fact={fact}
                                        candidates={candidates}
                                        error={candidates.length !== 1 || duplicatedCandidates.includes(candidates[0].id)}
                                    />
                                )
                            })}
                        </Stack>
                    </ScrollArea>
                    <Button
                        my={20}
                        mx="auto"
                        w="100%"
                        maw={230}
                        disabled={!isReady}
                        onClick={() => {
                            service.action_answer_send(state.candidates.map(([factId, candidates]) =>
                                [factId, candidates[0]]
                            ))
                        }}
                    >Отправить ответы</Button>
                </>
            ) : (
                <Stack w="100%" maw={700} px={20} align="center">
                    <Text size="lg">Готовы: {state.answersSent.length}</Text>
                    {waitCount === 0 ? (
                        <Text size="lg">{isLeader
                            ? "Все ждут Вас"
                            : "Ожидаем, когда лидер нажмет кнопку"
                        }</Text>
                    ) : (
                        <Text size="lg">Ожидаем: {waitCount}</Text>
                    )}
                    <Button
                        w="80%"
                        maw={250}
                        size="lg"
                        onClick={() => service.action_answer_drop()}
                    >Изменить ответы</Button>
                    {isLeader && (
                        <Button
                            w="80%"
                            maw={250}
                            size="lg"
                            disabled={waitCount !== 0}
                            onClick={() => service.action_finish_game()}
                        >Показать результаты</Button>
                    )}
                </Stack>
            )}
        </StageContainer>
    );

}