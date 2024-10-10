import {useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Text, TextInput, PinInput, Center, Stack, Box, Button} from "@mantine/core";
import {notifications} from "@mantine/notifications";
import AppContainer from "../components/AppContainer";

export default function HomePage() {

    const [search] = useSearchParams();

    const [code, setCode] = useState<string>("");
    const [codeDirty, setCodeDirty] = useState<boolean>(false);
    const [name, setName] = useState<string>(search.get("name") ?? "");
    const [nameDirty, setNameDirty] = useState<boolean>(false);

    const userId = Number(search.get("id") ?? undefined);
    const codeIsValid = code.length === 4;
    const nameIsValid = name.length >= 3;

    const navigate = useNavigate();

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
                        disabled={Number.isNaN(userId) || !codeIsValid || !nameIsValid}
                        onClick={() => {
                            navigate(`/${code}?id=${userId}&name=${name}`);
                        }}
                    >Подключиться к комнате</Button>
                    <Button
                        disabled={Number.isNaN(userId) || !nameIsValid}
                        onClick={() => {
                            fetch(
                                import.meta.env.VITE_SERVER_BASE_URL + "/infact/new",
                                {method: "POST"}
                            ).then(res => {
                                if (res.status === 200) return res.text();
                                else notifications.show({
                                    message: "Не удалось создать комнату",
                                    color: "var(--mantine-color-error)",
                                });
                            }).then(code => {
                                if (code) {
                                    navigate(`/${code}?id=${userId}&name=${name}`);
                                }
                            });
                        }}
                    >Создать комнату</Button>
                </Stack>
            </Center>
        </AppContainer>
    );
};
