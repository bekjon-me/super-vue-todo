import type { Project } from './../models/project'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProjects = defineStore('projects', () => {
  const projects = ref<Project[]>([])

  const createProject = (project: Project) => {
    projects.value.push(project)
  }

  const setProjects = (projectsList: Project[]) => {
    projects.value = projectsList
  }

  return {
    projects,
    createProject,
    setProjects
  }
})
