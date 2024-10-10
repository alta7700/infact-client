import {createBrowserRouter} from "react-router-dom";
import HomePage from "./HomePage";
import RoomPage from "./RoomPage";

const router = createBrowserRouter([
    {
        index: true,
        path: "/",
        element: <HomePage/>,
    },
    {
        path:"/:room",
        element: <RoomPage/>,
    },
]);

export default router;