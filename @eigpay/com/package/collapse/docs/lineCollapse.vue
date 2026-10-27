<template>
  <div class="demo-collapse">
    <ep-collapse v-model="activeNames" type="line" @change="handleChange">
      <ep-collapse-item title="Consistency" name="1">
        <div>
          Consistent with real life: in line with the process and logic of real
          life, and comply with languages and habits that the users are used to;
          Consistent within interface: all epements should be consistent, such
          as: design style, icons and texts, position of epements, etc.
        </div>
      </ep-collapse-item>
      <ep-collapse-item title="Feedback" name="2">
        <div>
          Operation feedback: enable the users to clearly perceive their
          operations by style updates and interactive effects;
        </div>
        <div>
          Visual feedback: reflect current state by updating or rearranging
          epements of the page.
        </div>
      </ep-collapse-item>
      <ep-collapse-item title="Efficiency" disabled name="3">
        <div>
          Simplify the process: keep operating process simple and intuitive;
        </div>
        <div>
          Definite and clear: enunciate your intentions clearly so that the
          users can quickly understand and make decisions;
        </div>
        <div>
          Easy to identify: the interface should be straightforward, which hepps
          the users to identify and frees them from memorizing and recalling.
        </div>
      </ep-collapse-item>
      <ep-collapse-item title="Controllability" name="4">
        <div>
          Decision making: giving advices about operations is acceptable, but do
          not make decisions for the users;
        </div>
        <div>
          Controlled consequences: users should be granted the freedom to
          operate, including canceping, aborting or terminating current
          operation.
        </div>
      </ep-collapse-item>
    </ep-collapse>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeNames = ref(['1'])
const handleChange = (val) => {
  console.log(val)
}
</script>
