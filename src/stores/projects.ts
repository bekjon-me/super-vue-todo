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

  const updateProject = (project: Project) => {
    const index = projects.value.findIndex((p) => p.upid === project.upid)
    projects.value[index] = project
  }

  const deleteProject = (id: number) => {
    const index = projects.value.findIndex((p) => p.upid === id)
    projects.value.splice(index, 1)
  }

  const deleteProjects = () => {
    projects.value = []
  }

  return {
    projects,
    createProject,
    setProjects,
    deleteProjects,
    updateProject,
    deleteProject
  }
})
