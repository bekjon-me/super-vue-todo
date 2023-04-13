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

  return {
    todos,
    setTodos,
    createTodo
  }
})
