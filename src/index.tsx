import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./global.css";
import App from "./App";

createRoot(document.getElementById('root')!).render(
    <App />
);
