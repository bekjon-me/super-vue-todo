<script lang="ts" setup>
import { useAuth } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import userImg from '@/assets/user.jpg'
import Modal from '@/components/Modal.vue'
import { useModal } from '@/stores/modal'
import type { User } from '@/models/user'
import { ref, toRaw } from 'vue'
import { updateUser } from '@/service/updateUser'
import { ChevronLeftIcon } from '@heroicons/vue/20/solid'

const { user } = storeToRefs(useAuth())
const modal = useModal()
const { showModal } = storeToRefs(modal)
const utils = {
  first_name: 'First name',
  last_name: 'Last name',
  username: 'Username',
  email: 'Email'
}

const modalUser = ref({ ...user.value })

const handleSubmit = () => {
  updateUser(toRaw(modalUser.value) as User)
}
</script>

<template>
  <RouterLink to="/">
    <ChevronLeftIcon class="w-12 h-12 text-gray-500 absolute" />
  </RouterLink>
  <div class="flex flex-col justify-center items-center h-[90vh] w-[100%]">
    <img class="rounded-full w-36" :src="userImg" alt="User image" />
    <div class="w-[70%] mt-4 flex flex-col gap-2">
      <div v-for="(value, key) in user" :key="key">
        <div
          v-if="key != 'pk'"
          class="flex flex-wrap items-center justify-between p-2 rounded-md border border-white"
        >
          <span class="font-poppins mr-1">{{ utils[key] + ' :' }}</span>
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-bold font-poppins break-all">
              {{ value ? value : 'Not entered' }}
            </h1>
          </div>
        </div>
      </div>

      <button
        @click="showModal = true"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Edit
      </button>
    </div>
  </div>

  <Modal v-if="showModal">
    <template #form>
      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <div v-for="(value, key) in utils">
          <div v-if="key != 'email'" class="flex flex-col gap-2">
            <label for="first_name">{{ value }}</label>
            <input
              type="text"
              id="first_name"
              class="border border-gray-300 rounded-md p-2"
              v-model="(modalUser as User)[key]"
            />
          </div>
        </div>

        <div class="flex justify-end">
          <button type="submit" class="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md">
            Save
          </button>
        </div>
      </form>
    </template>
  </Modal>
</template>
