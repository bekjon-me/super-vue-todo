<script setup lang="ts">
import { useAuth } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { onUnmounted, ref } from 'vue'
import { ArrowRightOnRectangleIcon } from '@heroicons/vue/20/solid'
import { useProjects } from '@/stores/projects'
import ThemeSwitcher from './ThemeSwitcher.vue'

const auth = useAuth()
const projects = useProjects()
const { user } = storeToRefs(auth)
const showDropdown = ref(false)
const dropdown = ref()

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
  if (showDropdown.value) {
    document.addEventListener('click', handleClickOutside)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
}

const handleLogout = () => {
  auth.logout()
  projects.deleteProjects()
}

const handleClickOutside = (event: Event) => {
  if (dropdown.value && !dropdown.value.contains(event.target as HTMLElement)) {
    toggleDropdown()
  }
}

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="flex justify-between items-center mb-2 min-h-[3.8rem]">
    <RouterLink
      :to="{
        name: 'Home'
      }"
    >
      <h2 class="body-font font-poppins text-xl font-semibold">AdvancedTodo</h2>
    </RouterLink>
    <div class="flex items-center gap-2">
      <ThemeSwitcher />
      <div class="relative" ref="dropdown">
        <img
          @click="toggleDropdown"
          src="../assets/user.jpg"
          alt="User"
          class="w-[60px] rounded-full cursor-pointer"
        />

        <div
          v-if="showDropdown"
          id="dropdown"
          class="z-10 absolute right-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
        >
          <ul
            class="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            <li>
              <RouterLink
                :to="{ name: 'Profile' }"
                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Profile
              </RouterLink>
            </li>
            <li>
              <a
                href="#"
                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >Settings</a
              >
            </li>
            <li>
              <a
                href="#"
                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >Earnings</a
              >
            </li>
            <li
              @click="handleLogout"
              class="bg-red-600 hover:bg-red-500 flex items-center text-white cursor-pointer"
            >
              <a href="#" class="block px-4 py-2 dark:hover:bg-gray-600 dark:hover:text-white"
                >Sign out</a
              >
              <ArrowRightOnRectangleIcon class="w-5 h-5" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>
