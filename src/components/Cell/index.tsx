import { defaults, GameState } from "../../App";
import { getNearBombCount } from "../../utils";
import { CellDetails, ClickType } from "../Battlefield";

type CellProps = {
    imgSize?: number;
    x: number;
    y: number;
    battleField: Array<Array<CellDetails>>;
    onClick: (clickType: ClickType) => void;
    gameState: GameState;
};

export const Cell = ({ x, y, battleField, onClick, imgSize = defaults.IMG_SIZE, gameState}: CellProps) => {
    const getImage = () => {
        const details = battleField[x][y];

        if (details.isFlag) {
            return '/area-flag.jpg';
        }
        if (details.isQuestionmark) {
            return '/area-question.jpg';
        }
        if (!details.isClicked && gameState !== GameState.GameLost) {
            return '/area.jpg';
        }
        if (details.isBomb) {
            if (details.isBombExploded) {
                return '/area-bomb-red.jpg';
            }
            return '/area-bomb.jpg';
        }
        
        const nearBombCount = getNearBombCount({ battleField, x, y });
        if (!nearBombCount) {
            return '/area-pressed.jpg';
        }
        return `/area-num${nearBombCount}.jpg`;
    };

    return <img
        onClick={() => onClick(ClickType.Left)}
        onContextMenu={(e) => {
            e.preventDefault();
            onClick(ClickType.Right);
        }}
        src={getImage()}
        style={{ height: `${imgSize}px` }}/>;
};