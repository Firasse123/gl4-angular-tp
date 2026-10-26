import { Injectable, computed, inject, signal } from '@angular/core';
import { Todo, TodoStatus } from '../model/todo';
import { LoggerService } from '../../services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private loggerService = inject(LoggerService);

  /** Next id to give to a new todo */
  private nextId = 1;

  /** Writable signal: only the service can change the list. */
  private readonly _todos = signal<Todo[]>([]);

  /** Read-only view of the list for the components. */
  readonly todos = this._todos.asReadonly();

  /** One list per status: filtered again automatically when the todos change */
  readonly waitingTodos = computed(() =>
    this.todos().filter((todo) => todo.status === 'waiting'),
  );
  readonly inProgressTodos = computed(() =>
    this.todos().filter((todo) => todo.status === 'in progress'),
  );
  readonly doneTodos = computed(() =>
    this.todos().filter((todo) => todo.status === 'done'),
  );

  /**
   * Create a todo with a unique id and the 'waiting' status,
   * then add it (we create a new array so the signal notifies its readers)
   */
  addTodo(name: string, content: string): void {
    const todo: Todo = { id: this.nextId++, name, content, status: 'waiting' };
    this._todos.update((todos) => [...todos, todo]);
  }

  /**
   * Change the status of the todo with this id.
   * map returns a new array, and the changed todo is a new object (copy + new status),
   * so the signal notifies and the computed lists are filtered again.
   */
  updateStatus(id: number, status: TodoStatus): void {
    this._todos.update((todos) =>
      todos.map((todo) => (todo.id === id ? { ...todo, status } : todo)),
    );
  }

  /**
   * Delete the todo with this id (filter returns a new array without it)
   */
  deleteTodo(id: number): void {
    this._todos.update((todos) => todos.filter((todo) => todo.id !== id));
  }

  /**
   * Log the list of todos
   */
  logTodos() {
    this.loggerService.logger(this.todos());
  }
}
