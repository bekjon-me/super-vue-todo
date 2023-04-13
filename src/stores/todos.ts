import type { Todo } from './../models/todo'
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useTodos = defineStore('todos', () => {
  const todos = ref<Todo[]>([])

  const setTodos = (todosList: Todo[]) => {
    todos.value = todosList
  }

  const createTodo = (todo: Todo) => {
    todos.value.push(todo)
  }

  const deleteTodo = (id: number) => {
    todos.value = todos.value.filter((todo) => (todo.ptid as number) !== id)
  }

  return {
    todos,
    setTodos,
    createTodo,
    deleteTodo
  }
})
