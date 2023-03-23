<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { LockClosedIcon } from '@heroicons/vue/20/solid'
import { ref } from 'vue'
import { handleRegister } from '@/service/register'
import { toast } from 'vue3-toastify'

const payload = ref({
  email: '',
  username: '',
  password1: '',
  password2: ''
})

const handleSubmit = (e: Event) => {
  e.preventDefault()
  if (payload.value.password1 !== payload.value.password2) {
    alert('Passwords do not match')
    return
  }

  handleRegister(payload.value)
}
</script>

<template>
  <div class="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <img class="mx-auto h-28 w-auto" src="../assets/logo.jpg" alt="Todo app" />
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign up for an account
        </h2>
      </div>
      <form class="mt-8 space-y-6" :onsubmit="handleSubmit">
        <input type="hidden" name="remember" value="true" />
        <div class="-space-y-px rounded-md shadow-sm">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              class="relative block w-full rounded-t-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-none"
              placeholder="Email address"
              v-model="payload.email"
            />
          </div>
          <div>
            <label for="username" class="sr-only">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autocomplete="username"
              required
              class="relative block w-full rounded-t-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-none"
              placeholder="Username"
              v-model="payload.username"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="relative block w-full rounded-b-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-none"
              placeholder="Password"
              v-model="payload.password1"
            />
          </div>
          <div>
            <label for="password1" class="sr-only">Password</label>
            <input
              id="password1"
              name="password1"
              type="password"
              autocomplete="current-password"
              required
              class="relative block w-full rounded-b-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-none"
              placeholder="Confirm password"
              v-model="payload.password2"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <LockClosedIcon
                class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                aria-hidden="true"
              />
            </span>
            Sign up
          </button>
        </div>
        <div class="flex items-center justify-center">
          <p class="text-sm text-gray-600">Already have an account?</p>
          <RouterLink :to="{ name: 'Login' }">
            <p class="ml-2 font-medium text-indigo-600 hover:text-indigo-500">Sign in</p>
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>
