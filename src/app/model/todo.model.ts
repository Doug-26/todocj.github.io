export interface Todo {
    id: string;
    title: string;
    completed: boolean;
    duedate?: Date;
    priority?: 'low' | 'medium' | 'high';
}