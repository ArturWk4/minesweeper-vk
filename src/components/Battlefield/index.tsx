import { useEffect, useState } from "react";
import { BattlefieldDetails, defaults, GameState, GameStats } from "../../App";
import { generateBattlefield, getNearBombCount } from "../../utils";
import { Cell } from "../Cell";

export type CellDetails = {
    isClicked: boolean;
    isBomb: boolean;
    isFlag: boolean;
    isQuestionmark: boolean;
    isBombExploded: boolean;
};

export enum ClickType {
    Left = 'Left',
    Right = 'Right',
}

type BattlefieldProps = {
    size: number;
    gameState: GameState;
    bombsCount: number;
    imgSize?: number;
    gameStats: GameStats;
    changeGameState: (gameState: GameState) => void;
    changeGameStats: (gameStats: GameStats) => void;
};

export const Battlefield = ({ size, bombsCount, imgSize = defaults.IMG_SIZE, gameState, gameStats, changeGameState, changeGameStats }: BattlefieldProps) => {
    const [firstClickedCell, setFirstClickedCell] = useState<{ x: number; y: number }>();
    const [battleField, setBattleField] = useState<BattlefieldDetails>(
        [...Array(size)].map(() => [...Array(size)].map(() => ({
            isClicked: false,
            isBomb: false,
            isFlag: false,
            isQuestionmark: false,
            isBombExploded: false,
        }))),
    );
    const updateBattlefield = ({
        x,
        y,
        clickType,
        generatedBombs,
    }: {
        x: number;
        y: number;
        clickType: ClickType;
        generatedBombs?: boolean[][];
    }) => {
        setBattleField((field) => {
            const row = field[x];
            const updatedCell = { ...row[y] };
            if (generatedBombs) {
                field = field.map((row, x) => row.map((cell, y) => ({
                    ...cell,
                    isBomb: generatedBombs[x][y],
                })));
            }
            if (updatedCell.isClicked) {
                return field;
            }
            if (clickType === ClickType.Left) {
                updatedCell.isClicked = true;
                updatedCell.isFlag = false;
                updatedCell.isQuestionmark = false;
                if (!updatedCell.isBomb && !getNearBombCount({ battleField: field, x, y })) {
                    [
                        { x: x - 1, y: y - 1 }, { x: x - 1, y }, { x: x - 1, y: y + 1 },
                        { x, y: y - 1 }, { x, y: y + 1 },
                        { x: x + 1, y: y - 1 }, { x: x + 1, y }, { x: x + 1, y: y + 1 },
                    ]
                        .filter(({ x, y }) => field[x]?.[y] && !field[x][y].isClicked)
                        .forEach(({ x, y }) => {
                            setTimeout(() => onCellClick(x, y)(ClickType.Left), 10);
                        });
                } else if (updatedCell.isBomb) {
                    updatedCell.isBombExploded = true;
                    changeGameState(GameState.GameLost);
                }
            } else if (updatedCell.isFlag) {
                updatedCell.isFlag = false;
                updatedCell.isQuestionmark = true;
            } else if (updatedCell.isQuestionmark) {
                updatedCell.isFlag = false;
                updatedCell.isQuestionmark = false;
            } else {
                updatedCell.isFlag = true;
                updatedCell.isQuestionmark = false;
                changeGameStats({bombCount: gameStats.bombCount > 0 ? gameStats.bombCount - 1 : 0})
            }
            const updatedRow = [...row.slice(0, y), updatedCell, ...row.slice(y + 1) ];
            return [...field.slice(0, x), updatedRow, ...field.slice(x + 1)];
        });
    };

    useEffect(() => {
        if (!firstClickedCell) {
            return;
        }
        changeGameState(GameState.Started); // TODO: bug with reload new game
        const { x, y } = firstClickedCell;
        const generatedBombs = generateBattlefield({
            size,
            bombsCount,
            x,
            y,
        });

        updateBattlefield({ x, y, clickType: ClickType.Left, generatedBombs });
    }, [firstClickedCell?.x, firstClickedCell?.y]);

    const onCellClick = (x: number, y: number) => (clickType: ClickType) => {
        if (clickType === ClickType.Left && !firstClickedCell) {
            setFirstClickedCell({ x, y });
        } else {
            updateBattlefield({ x, y, clickType });
        }
    };

    return (
        <div style={{
            borderLeft: '4px solid #808080',
            borderTop: '4px solid #808080',
            borderRight: '4px solid white',
            borderBottom: '4px solid white',
            width: `${size * imgSize}px`
        }}>
            {
                battleField.map((row, x) => 
                    <div key={x} style={{ height: `${defaults.IMG_SIZE}px` }}>
                        {
                            row.map((_e, y) => <Cell key={y} battleField={battleField} onClick={onCellClick(x, y)} x={x} y={y} gameState={gameState}/>)
                        }
                    </div>
                )
            }
        </div>
    );
};