export type TodoStatus = 'waiting' | 'in progress' | 'done';

/** The statuses as values, to build the options of the select */
export const TODO_STATUSES: TodoStatus[] = ['waiting', 'in progress', 'done'];

export interface Todo {
  id: number;
  name: string;
  content: string;
  status: TodoStatus;
}
