import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Text, TextInput, PinInput, Center, Stack, Box, Button} from "@mantine/core";
import {notifications} from "@mantine/notifications";
import AppContainer from "../components/AppContainer";
import {getUserTgName} from "../utils";

export default function HomePage() {

    const [search] = useSearchParams();

    const [code, setCode] = useState<string>("");
    const [codeDirty, setCodeDirty] = useState<boolean>(false);
    const [name, setName] = useState<string>(search.get("name") ?? getUserTgName() ?? "");
    const [nameDirty, setNameDirty] = useState<boolean>(false);

    const codeIsValid = code.length === 4;
    const nameIsValid = name.length >= 3;

    const navigate = useNavigate();

    useEffect(() => {
        const searchCopy = new URLSearchParams(search.toString());
        if (searchCopy.has("room")) {
            const initRoom = searchCopy.get("room");
            searchCopy.delete("room");
            navigate(`/${initRoom}?${searchCopy.toString()}`);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AppContainer>
            <Center h="100%">
                <Stack>
                    <Box>
                        <Text size="md" fw={500}>Ваше имя</Text>
                        <TextInput
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Как Вас зовут?"
                            error={nameDirty && !nameIsValid}
                            onBlur={() => setNameDirty(true)}
                        />
                    </Box>
                    <Box>
                        <Text size="md" fw={500}>Код комнаты</Text>
                        <PinInput
                            size="lg"
                            value={code.toUpperCase()}
                            onChange={setCode}
                            placeholder="○"
                            type={/^[a-zA-Z]*$/}
                            error={codeDirty && !codeIsValid}
                            onBlur={() => setCodeDirty(true)}
                        />
                    </Box>
                    <Button
                        disabled={!codeIsValid || !nameIsValid}
                        onClick={() => {
                            navigate(`/${code}?&name=${name}`);
                        }}
                    >Подключиться к комнате</Button>
                    <Button
                        disabled={!nameIsValid}
                        onClick={() => {
                            fetch(
                                import.meta.env.VITE_SERVER_BASE_URL + "/new",
                                {method: "POST"}
                            ).then(res => {
                                if (res.status === 200) return res.text();
                                else notifications.show({
                                    message: "Не удалось создать комнату",
                                    color: "var(--mantine-color-error)",
                                });
                            }).then(code => {
                                if (code) {
                                    navigate(`/${code}?&name=${name}`);
                                }
                            }).catch(() => {
                                notifications.show({
                                    message: "Произошла непредвиденная ошибка",
                                    color: "var(--mantine-color-error)",
                                });
                            });
                        }}
                    >Создать комнату</Button>
                </Stack>
            </Center>
        </AppContainer>
    );
};
