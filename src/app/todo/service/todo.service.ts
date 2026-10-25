import { Injectable, inject, signal } from '@angular/core';
import { Todo } from '../model/todo';
import { LoggerService } from '../../services/logger.service';

let n = 1;

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private loggerService = inject(LoggerService);

  /** Writable signal: only the service can change the list. */
  private readonly _todos = signal<Todo[]>([]);

  /** Read-only view of the list for the components. */
  readonly todos = this._todos.asReadonly();

  /**
   * Add a todo (we create a new array so the signal notifies its readers)
   */
  addTodo(todo: Todo): void {
    this._todos.update((todos) => [...todos, todo]);
  }

  /**
   * Delete the todo (filter returns a new array without it)
   */
  deleteTodo(todo: Todo): void {
    this._todos.update((todos) => todos.filter((t) => t !== todo));
  }

  /**
   * Log the list of todos
   */
  logTodos() {
    this.loggerService.logger(this.todos());
  }
}
