export class BoardTask {
    id: number;
    taskId: string;
    name: string;
    description: string;
    color: string;
    boardColumnId: number;
    boardId: number;
    assignee: string;
    dueDate: Date
    constructor() { }
}