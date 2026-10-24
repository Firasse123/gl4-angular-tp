import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Todo, TodoStatus } from '../model/todo';
import { TodoService } from '../service/todo.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-todo',
    templateUrl: './todo.component.html',
    styleUrls: ['./todo.component.css'],
    providers: [TodoService],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FormsModule]
})
export class TodoComponent {
  private todoService = inject(TodoService);

  statuses: TodoStatus[] = ['waiting', 'in progress', 'done'];

  columns = [
    { label: 'Waiting', css: 'alert-secondary', todos: this.todoService.waiting },
    { label: 'In Progress', css: 'alert-warning', todos: this.todoService.inProgress },
    { label: 'Done', css: 'alert-success', todos: this.todoService.done },
  ];

  todo = new Todo();
  
  addTodo() {
    this.todoService.addTodo(this.todo);
    this.todo = new Todo();
  }

  deleteTodo(todo: Todo) {
    this.todoService.deleteTodo(todo);
  }
  changeStatus(todo: Todo, status: TodoStatus) {
    this.todoService.changeStatus(todo, status);
  }
}
