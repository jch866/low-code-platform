<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div>
      <button @click="dispatch">
        Dispatch Event to Base App ({{ counter }}) times
      </button>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import { dispatchEvent } from '@/lib/appCommunicate'
export default {
  setup() {
    const counter = ref(0)
    const dispatch = () => {
      counter.value++
      dispatchEvent({ myname: 'app vite ' + counter.value })
    }
    return {
      dispatch,
      counter,
    }
  },
}
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
