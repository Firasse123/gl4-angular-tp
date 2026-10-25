import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { TodoService } from '../service/todo.service';
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

  /** The list, read from the service */
  readonly todos = this.todoService.todos;

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

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id);
  }
}
