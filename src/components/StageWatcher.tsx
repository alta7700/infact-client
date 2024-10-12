import React, {useCallback, useEffect, useState} from "react";
import {Button, Group, Modal, Stack, Text} from "@mantine/core";

export default function StageWatcher({stage}: {stage: GameStage}) {
    const [opened, setOpened] = useState<boolean>(false);
    const [body, setBody] = useState<React.ReactNode>(null);

    const close = useCallback(() => setOpened(false), []);

    useEffect(() => {
        if (stage === "facts") {
            setBody(
                <Stack gap="sm">
                    <Text>Этап 1. Напишите короткий факт о себе.</Text>
                    <Text>Не стоит писать о том, что Вы рассказываете о себе людям в первую очередь.</Text>
                    <Text>Лучше писать то, что может раскрыть для других Ваши интересы или показать неочевидные стороны личности. Возможно, Вы найдете сообщников.</Text>
                    <Text>Например, "Увлекаюсь дайвингом", "Играю на трёх музыкальных инструментах", "КМС по шахматам".</Text>
                </Stack>
            );
            setOpened(true);
        } else if (stage === "about") {
            setBody(
                <Stack gap="sm">
                    <Text>Этап 2. Знакомство.</Text>
                    <Text>В этот круг каждый по очереди рассказывает о себе: где учился, чем занимается.</Text>
                    <Text>Вы пока не видите, что написали о себе другие игроки, поэтому слушайте внимательно, и, может, в их рассказе найдете подсказки.</Text>
                    <Text>Не спешите рассказывать всё о себе, оставьте что-нибудь на следующий этап.</Text>
                    <Text>Но только не раскрывайте свой факт!</Text>
                </Stack>
            );
            setOpened(true);
        } else if (stage === "turns") {
            setBody(
                <Stack gap="sm">
                    <Text>Этап 3. Вопросы???</Text>
                    <Text>Вы, как и остальные игроки, должны задать один вопрос одному человеку на Ваш выбор. Таких круга будет 4.</Text>
                    <Text>Не стоит задавать вопросы, которые напрямую относятся к какому-то из фактов. Задавайте более отвлеченные вопросы и отмечайте кандидатов на факты, нажав на факт из списка.</Text>
                    <Text>Если Вы услышали вопрос, который может раскрыть чей-то факт, лучше все дружно укажите на это и попросите сменить вопрос.</Text>
                    <Text>Внимательно слушайте, что спрашивают другие, потому что у Вас будет всего 4 вопроса.</Text>
                </Stack>
            );
            setOpened(true);
        } else if (stage === "answers") {
            setBody(
                <Stack gap="sm">
                    <Text>Этап 4. Ответы.</Text>
                    <Text>Соотнесите факты с игроками. Для этого просто оставьте по одному кандидату у каждого факта.</Text>
                </Stack>
            );
            setOpened(true);
        } else if (stage === "final") {
            setBody(
                <Stack gap="sm">
                    <Text>Этап 5. Всё.</Text>
                    <Text>Ознакомьтесь с результатами.</Text>
                </Stack>
            );
            setOpened(true);
        }
    }, [stage]);

    return (
        <Modal opened={opened} withCloseButton={false} onClose={close} centered>
            {body}
            <Group mt={20} justify="center">
                <Button onClick={close}>Всё понятно</Button>
            </Group>
        </Modal>
    );
}