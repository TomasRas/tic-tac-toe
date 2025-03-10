import {Players, Room, Tiles} from "../shared";

export function checkWinner(tiles: Tiles): Players | null {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (tiles[a].player && tiles[a].player === tiles[b].player && tiles[a].player === tiles[c].player) {
            return tiles[a].player;
        }
    }

    return null;
}

export class RoomBoard implements Room {
    public winner: null
    public tiles: Tiles = Array.from({length: 9}, (_, id) =>
        ({id, player: "" as Players}))
    public id: string
    public playerTurn = "X" as Players

    constructor(id: string) {
        this.id = id
        this.winner = null
    }
}