import { BoardColumn } from "./boardcolumn";
import { User } from "../users/user";

export class Board {
    id: number;
    name: string;
    owner: User;
    participants: User[];
    boardColumns: BoardColumn[];
    constructor(
        id: number,
        name: string,
        owner: User,
        participants: User[],
        boardColumns: BoardColumn[]
    ) {
        this.id = id;
        this.name = name;
        this.owner = owner;
        this.participants = participants;
        this.boardColumns = boardColumns;
     }
}