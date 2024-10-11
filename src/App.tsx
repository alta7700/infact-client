import {RouterProvider} from "react-router-dom";
import {MantineProvider, Text, Anchor} from "@mantine/core";
import {Notifications} from "@mantine/notifications";
import router from "./pages/router";

function App() {
    return (
        <MantineProvider>
            {window.Telegram?.WebApp?.initDataUnsafe?.user
                ? <RouterProvider router={router}/>
                : (
                    <Text size="lg">Играть можно только в <Anchor
                        href={"https://t.me/po_factu_game_bot/po_factu"}
                    >telegram</Anchor></Text>
                )
            }
            <Notifications/>
        </MantineProvider>
    );
}

export default App;
