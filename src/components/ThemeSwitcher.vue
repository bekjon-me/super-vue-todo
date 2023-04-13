<script lang="ts" setup>
import { useToggle, useDark } from '@vueuse/core'
import { onMounted, ref } from 'vue'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const themeSwitcher = ref<HTMLInputElement>()

onMounted(() => {
  if (isDark.value) {
    if (themeSwitcher.value) themeSwitcher.value.checked = true
  }
})
</script>

<template>
  <label id="switch" class="switch">
    <input ref="themeSwitcher" type="checkbox" @change="toggleDark()" id="slider" />
    <span class="slider round"></span>
  </label>
</template>

<style>
.theme-light {
  --color-primary: #0060df;
  --color-secondary: #fbfbfe;
  --color-accent: #fd6f53;
  --font-color: #000000;
}
.theme-dark {
  --color-primary: #17ed90;
  --color-secondary: #2a2c2d;
  --color-accent: #12cdea;
  --font-color: #ffffff;
}
h1 {
  color: var(--font-color);
  font-family: sans-serif;
}
button {
  color: var(--font-color);
  background: var(--color-primary);
  padding: 10px 20px;
  border: 0;
  border-radius: 5px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 25px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 30px;
  width: 30px;
  left: 0px;
  bottom: 4px;
  top: 0;
  bottom: 0;
  margin: auto 0;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  box-shadow: 0 0px 15px #2020203d;
  background: white url('https://i.ibb.co/7JfqXxB/sunny.png');
  background-repeat: no-repeat;
  background-position: center;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(24px);
  -ms-transform: translateX(24px);
  transform: translateX(24px);
  background: white url('https://i.ibb.co/FxzBYR9/night.png');
  background-repeat: no-repeat;
  background-position: center;
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
