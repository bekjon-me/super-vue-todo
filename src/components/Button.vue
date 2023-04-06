<template>
  <button class="bg-[green] py-[12px] px-[24px] rounded w-[100%] text-white" @click="onClick">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits(['click'])
function onClick() {
  emit('click')
}
</script>
