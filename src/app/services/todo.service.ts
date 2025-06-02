import { inject, Injectable } from '@angular/core';
import { Firestore, collection, addDoc, CollectionReference, DocumentData, collectionData, doc, updateDoc, deleteDoc, docData, Timestamp } from '@angular/fire/firestore';
import { Todo } from '../model/todo.model';
import { map, Observable, timestamp } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private firestore: Firestore = inject(Firestore);
  private collectionName = "todos";

  constructor() { }

  // Add methods to interact with Firestore here, e.g., getTodos, addTodo, updateTodo, deleteTodo
  createTodo(todo: Todo): Promise<DocumentData> {
    // Create a reference to the 'todos' collection
    const todosCollection = collection(this.firestore, this.collectionName) as CollectionReference<Todo>;
    return addDoc(todosCollection, todo);
  }

  // You can add more methods like getTodos, updateTodo, deleteTodo, etc.
  getTodos(): Observable<Todo[]> {
    // Fetch the collection data from Firestore
    // Check due date is intance of timestamp using a map
    // return collectionData(this.collectionName, { idField: 'id' }).pipe(
    //   map((todos: DocumentData[]) => {
    //     return todos.map(todo => {
    //       // Convert Firestore timestamp to Date object if needed 
    //       // and return the Todo object
    //       return {
    //         ...todo,
    //         duedate: todo['duedate'] instanceof Date ? todo['duedate'] : new Date(todo['duedate'].seconds * 1000),
    //         title: todo['title'],
    //         completed: todo['completed']
    //       } as Todo;
    //     });
    //   })
    // );
    const todosCollection = collection(this.firestore, this.collectionName) as CollectionReference<Todo>;
    return collectionData(todosCollection, { idField: 'id' }).pipe(
      map((todos) => todos.map(todo => {
        // Check if duedate is a Firestore Timestamp and convert it to Date
        if (todo.duedate instanceof Timestamp) {
          return {
            ...todo,
            duedate: todo.duedate.toDate() // Convert Firestore Timestamp to Date
          } as Todo;
        }
        // If duedate is not a Timestamp, return the todo as is
        return todo as Todo;
      }))
    );
  }

  updateTodo(id: string, todo: Todo): Promise<void> {
    const todoDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    // Update the todo document in Firestore
    return updateDoc(todoDoc, {
      title: todo.title,
      completed: todo.completed,
      duedate: todo.duedate instanceof Date ? Timestamp.fromDate(todo.duedate) : todo.duedate,
      priority: todo.priority
    });
  }

  deleteTodo(id: string): Promise<void> {
    // Implement delete logic here
    const todoDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    return deleteDoc(todoDoc);
  }

  getTodoById(id: string): Observable<Todo> {
    const todoDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    // Use docData to get a single document
    return docData(todoDoc) as Observable<Todo>;
  }

}
