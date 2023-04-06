<script setup lang="ts">
import { useAuth } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { ArrowRightOnRectangleIcon } from '@heroicons/vue/20/solid'
import { useProjects } from '@/stores/projects'

const auth = useAuth()
const projects = useProjects()
const { user } = storeToRefs(auth)
const showDropdown = ref(false)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const handleLogout = () => {
  auth.logout()
  projects.deleteProjects()
}
</script>

<template>
  <header class="flex justify-between items-center mb-2 min-h-[3.8rem]">
    <RouterLink
      :to="{
        name: 'Home'
      }"
    >
      <h2 class="text-[#000] body-font font-poppins text-xl font-semibold">AdvancedTodo</h2>
    </RouterLink>
    <div class="flex items-center gap-2">
      <h2 class="text-lg text-[#444] font-poppins font-medium">
        {{
          user
            ? user.username.length > 15
              ? user.username.substring(0, 14) + '...'
              : user.username
            : 'Login'
        }}
      </h2>
      <div class="relative">
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
                href="#"
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
