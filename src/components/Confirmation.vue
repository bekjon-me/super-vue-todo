<script lang="ts" setup>
const emits = defineEmits<{
  closeFn: () => void
  doFn: () => void
}>()

console.log(emits.closeFn)

const handleClose = () => {
  emits.closeFn()
}

const handleDo = () => {
  emits.doFn()
}
</script>

<template>
  <div class="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center gap-4">
    <!-- confirmation text here with h2 -->

    <h2 class="text-2xl font-bold font-poppins text-gray-700 text-center">
      Are you sure you want to delete this?
    </h2>

    <div class="flex gap-4">
      <button
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        @click="handleClose"
      >
        No
      </button>
      <button
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        @click="handleDo"
      >
        Yes
      </button>
    </div>
  </div>
</template>
