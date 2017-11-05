export class Task {
    constructor(
        public taskId: string,
        public name: string,
        public description: string,
        public boardColumnId: number,
        public color: string,
        public dueDate: Date) {}
}