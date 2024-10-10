import {useCallback, useEffect, useState} from "react";
import {Button, Modal, Text} from "@mantine/core";

export default function StageWatcher({stage}: {stage: GameStage}) {
    const [opened, setOpened] = useState<boolean>(false);
    const [text, setText] = useState<string>("");

    const close = useCallback(() => setOpened(false), []);

    useEffect(() => {
        if (stage === "facts") {
            setText("Напишите факт о себе.");
            setOpened(true);
        } else if (stage === "about") {
            setText("В этот круг каждый рассказывает чем он занимается.");
            setOpened(true);
        } else if (stage === "turns") {
            setText("Следующие 4 круга вы будете задавать по одному вопросу одному человеку.");
            setOpened(true);
        } else if (stage === "answers") {
            setText("Выберите какой факт кому принадлежит.");
            setOpened(true);
        } else if (stage === "final") {
            setText("Ознакомтесь с результатами.");
            setOpened(true);
        }
    }, [stage]);

    return (
        <Modal opened={opened} withCloseButton={false} onClose={close}>
            <Text>{text}</Text>
            <Button onClick={close}>Всё понятно</Button>
        </Modal>
    )

}