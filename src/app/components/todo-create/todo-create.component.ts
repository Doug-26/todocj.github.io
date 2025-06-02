import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatButtonModule  } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-create',
  imports: [
    FormsModule, 
    ReactiveFormsModule, 
    CommonModule, 
    MatSelectModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './todo-create.component.html',
  styleUrl: './todo-create.component.css'
})
export class TodoCreateComponent {

  private _bottomSheetRef = inject<MatBottomSheetRef<TodoCreateComponent>>(MatBottomSheetRef);
  private todoService = inject(TodoService);

  todoForm!: FormGroup;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
    this.initializeForm();
    // If data contains a todo, populate the form for editing
    if (data.todo) {
      this.todoForm.patchValue(data.todo);
      console.log('Editing Todo:', data.todo);
    }
  }

  initializeForm() {
    this.todoForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(3)]),
      completed: new FormControl(false),
      duedate: new FormControl(new Date(), Validators.required),
      priority: new FormControl('', Validators.required)
    });
  }


  createTodo() {
    if (this.todoForm.valid) {
      const todoData = this.todoForm.value;
      console.log('New Todo:', todoData);
      // Call the service to create a new todo
      this.todoService.createTodo(todoData).then(() => {
        console.log('Todo created successfully');
        this._bottomSheetRef.dismiss(todoData);
      }).catch(error => {
        console.error('Error creating todo:', error);
      });
      // Here you would typically send the data to your backend or service
    } else {
      console.error('Form is invalid');
    }
  }
  
  updateTodo() {
    if (this.todoForm.valid) {
      const todoData = this.todoForm.value;
      // Ensure the todo ID is included for the update
      const todoId = this.data.todo?.id;
      if (!todoId) {
        console.error('No todo ID found for update.');
        return;
      }
      console.log('Updated Todo:', todoData);
      this.todoService.updateTodo(todoId, todoData).then(() => {
        console.log('Todo updated successfully');
        this._bottomSheetRef.dismiss(todoData);
      }).catch(error => {
        console.error('Error updating todo:', error);
      });
    } else {
      console.error('Form is invalid');
    }
  }
}
