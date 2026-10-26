import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { TodoService } from '../service/todo.service';
import { TODO_STATUSES, TodoStatus } from '../model/todo';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-todo',
    templateUrl: './todo.component.html',
    styleUrls: ['./todo.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule]
})
export class TodoComponent {
  private todoService = inject(TodoService);

  /** The three columns: a title and the signal of the todos to show in it */
  readonly columns = [
    { title: 'Waiting', todos: this.todoService.waitingTodos },
    { title: 'In Progress Todos', todos: this.todoService.inProgressTodos },
    { title: 'Done Todos', todos: this.todoService.doneTodos },
  ];

  /** Options of the status select */
  readonly statuses = TODO_STATUSES;

  /** Form fields */
  readonly name = signal('');
  readonly content = signal('');

  /** Re-evaluated automatically every time name or content changes */
  readonly canAdd = computed(
    () => this.name().trim() !== '' && this.content().trim() !== '',
  );

  addTodo() {
    this.todoService.addTodo(this.name().trim(), this.content().trim());
    this.name.set('');
    this.content.set('');
  }

  changeStatus(id: number, status: TodoStatus) {
    this.todoService.updateStatus(id, status);
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id);
  }
}
