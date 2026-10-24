export type TodoStatus = "waiting" | "in progress" | "done";

export class Todo {
  constructor(
    public id = 0,
    public name = "",
    public content = "",
    public status: TodoStatus = "waiting") {

  }
}
