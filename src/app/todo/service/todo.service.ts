import { Injectable, inject,computed,signal } from '@angular/core';
import { Todo,TodoStatus} from '../model/todo';
import { LoggerService } from '../../services/logger.service';


@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private loggerService = inject(LoggerService);

  readonly #todos = signal<Todo[]>([])

  readonly todos=  this.#todos.asReadonly();

  readonly waiting= computed( () => this.#todos().filter(todo => todo.status === "waiting") );
  readonly inProgress= computed( () => this.#todos().filter(todo => todo.status === "in progress") )
  readonly done= computed( () => this.#todos().filter(todo => todo.status === "done") )

  addTodo(todo: Todo): void {
    const id = Math.max(0, ...this.#todos().map(t => t.id)) + 1;
    this.#todos.update(list => [...list, { ...todo, id, status: 'waiting' }]);
  }

  deleteTodo(todo: Todo): void {
    this.#todos.update(list => list.filter(t => t.id !== todo.id));
  }

  changeStatus(todo: Todo, status: TodoStatus): void {
    this.#todos.update(list => list.map(t => (t.id === todo.id ? { ...t, status } : t)));
  }

    logTodos() {
    this.loggerService.logger(this.#todos());
  }

}

