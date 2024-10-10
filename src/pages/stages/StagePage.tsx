import WaitingStagePage from "./WaitingStagePage.tsx";
import {useGameContext} from "../../gameService/GameContext";
import FactsStagePage from "./FactsStagePage.tsx";
import AboutStagePage from "./AboutStagePage.tsx";
import TurnsStagePage from "./TurnsStagePage.tsx";
import AnswersStagePage from "./AnswersStagePage.tsx";
import FinalStagePage from "./FinalStagePage.tsx";

export default function StagePage() {
    const {state} = useGameContext();

    switch(state.stage) {
    case "waiting":
        return <WaitingStagePage/>;
    case "facts":
        return <FactsStagePage/>;
    case "about":
        return <AboutStagePage/>;
    case "turns":
        return <TurnsStagePage/>
    case "answers":
        return <AnswersStagePage/>
    case "final":
        return <FinalStagePage/>
    }
};
