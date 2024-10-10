import {useState} from "react";
import {Button, Center, Stack, Text, Textarea, Title} from "@mantine/core";
import {useGameContext} from "../../gameService/GameContext.tsx";
import StageContainer from "../../components/StageContainer.tsx";

export default function FactsStagePage() {
    const {state, isLeader, service} = useGameContext("facts");

    const [text, setText] = useState<string>("");

    const waitCount = state.players.length - state.facts.length

    return (
        <StageContainer roomCode={state.roomCode}>
            <Center h="100%">
                {state.ownFactId === null ? (
                    <Stack w="100%" maw={700} px={20} align="center">
                        <Title ta="center">Короткий факт</Title>
                        <Textarea
                            w="100%"
                            size="lg"
                            placeholder="В меня стреляли, но я не сдался!"
                            value={text} onChange={e => setText(e.target.value)}
                        />
                        <Button
                            w="80%"
                            maw={250}
                            size="lg"
                            disabled={!text}
                            onClick={() => service.action_fact_add(text)}
                        >Именно он</Button>
                    </Stack>
                ) : (
                    <Stack w="100%" maw={700} px={20} align="center">
                        <Text size="lg">Готовы: {state.facts.length}</Text>
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
                            onClick={() => service.action_fact_drop()}
                        >Изменить факт</Button>
                        {isLeader && (
                            <Button
                                w="80%"
                                maw={250}
                                size="lg"
                                disabled={waitCount !== 0}
                                onClick={() => service.action_start_about()}
                            >Поехали дальше</Button>
                        )}
                    </Stack>
                )}
            </Center>
        </StageContainer>
    )
}