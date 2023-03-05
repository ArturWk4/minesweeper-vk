import { BattlefieldDetails } from "../App";

const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
}

export const getNearBombCount = ({
    battleField,
    x,
    y,
}: {
    battleField: BattlefieldDetails;
    x: number;
    y: number;
}) => {
    return [
        battleField[x - 1]?.[y - 1], battleField[x - 1]?.[y], battleField[x - 1]?.[y + 1],
        battleField[x][y - 1], battleField[x][y + 1],
        battleField[x + 1]?.[y - 1], battleField[x + 1]?.[y], battleField[x + 1]?.[y + 1],
    ].filter((cell) => cell?.isBomb).length;
}

export const generateBattlefield = ({
    size,
    bombsCount,
    x,
    y,
}: {
    size: number;
    bombsCount: number;
    x: number;
    y: number;
}): Array<Array<boolean>> => {
    const fields = [...Array(size)]
            .map(() => [...Array(size)]
                .map(() => false)
            )
    while (bombsCount) {
        const i = getRandomInt(size);
        const j = getRandomInt(size);
        if (!fields[i][j] && !(i === x && j === y)) {
            fields[i][j] = true;
            --bombsCount;
        }
    }
    return fields;
};