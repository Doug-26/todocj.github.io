import { Component, inject } from '@angular/core';
import { MatButton  } from '@angular/material/button';
import { Todo } from '../../model/todo.model';
import {MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {MatBottomSheetModule, MatBottomSheet} from '@angular/material/bottom-sheet';
import { TodoCreateComponent } from '../todo-create/todo-create.component';
import { TodoService } from '../../services/todo.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-todo-list',
  imports: [
    MatButton, 
    MatIconModule, 
    CommonModule, 
    MatBottomSheetModule, 
    MatFormFieldModule, 
    MatSelectModule,
    MatMenuModule
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent {
  
  // Inject the TodoService to interact with Firestore
  private todoService = inject(TodoService);
  // This will hold the list of todos
  todoList: Todo[] = [];

  originalTodoList: Todo[] = [];

  private _bottomSheet = inject(MatBottomSheet);

  constructor() {
    // Fetch the todo list from the service
    this.todoService.getTodos().subscribe(todos => {
      this.todoList = [...todos];
      this.originalTodoList = [...todos];
      console.log('Fetched Todos:', todos);
    });
  }

  sortTodosByPriority(order: 'asc' | 'desc' | 'reset'): void {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (order === 'reset') {
      this.todoList = [...this.originalTodoList];
    } else {
      this.todoList.sort((a, b) => {
        const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
        const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
        return order === 'desc' ? bPriority - aPriority : aPriority - bPriority;
      });
    }
  }

  addNewTodo() {
    // Open a bottom sheet to add a new todo item
    this._bottomSheet.open(TodoCreateComponent, {
      data: { todoList: this.todoList }
    });

  }

  markTodoAsCompleted(todo: Todo): void {
    todo.completed = true;
    // Call the service to update the todo item
    this.todoService.updateTodo(todo.id, todo).then(
      data => {
        console.log('Todo marked as completed successfully');
      }
    )
  }

  markTodoAsNotCompleted(todo: Todo): void {
    todo.completed = false;
    // Call the service to update the todo item
    this.todoService.updateTodo(todo.id, todo).then(
      data => {
        console.log('Todo marked as not completed successfully');
      }
    )
  }

  updateTodo(item: Todo): void {
    // Open a bottom sheet to update the todo item
    this._bottomSheet.open(TodoCreateComponent, {
      data: { todo: item, todoList: this.todoList }
    });
  }

  deleteTodo(item: Todo): void {
    const index = this.todoList.indexOf(item);
    // Check if item exists in the list
    // If it exists, remove it
    // and save the updated list to firestore
    if (index > -1) {
      this.todoList.splice(index, 1);
      // Save item to firestore
      this.todoService.deleteTodo(item.id).then(() => {
        console.log('Todo deleted successfully');
      }).catch(error => {
        console.error('Error deleting todo:', error);
      });
    }
  }
}
