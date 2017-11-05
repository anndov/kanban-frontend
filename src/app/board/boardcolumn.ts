import { Board } from "./board";

export class BoardColumn {

    id: number;
    name: string;
    board: Board;
    columnOrder: number;
    constructor(
        id: number,
        name: string,
        board: Board,
        columnOrder: number,
    ) {
        this.id = id;
        this.name = name;
        this.board = board;
        this.columnOrder = columnOrder;
     }
}