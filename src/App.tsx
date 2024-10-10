import {RouterProvider} from "react-router-dom";
import {MantineProvider} from "@mantine/core";
import {Notifications} from "@mantine/notifications";
import router from "./pages/router";

function App() {

    return (
        <MantineProvider>
            <RouterProvider router={router}/>
            <Notifications/>
        </MantineProvider>
    );
}

export default App;
