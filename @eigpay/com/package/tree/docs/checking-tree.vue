<template>
  <ep-tree
    ref="treeRef"
    :data="data"
    show-checkbox
    node-key="id"
    highlight-current
    :props="defaultProps"
  />

  <div class="buttons">
    <ep-button @click="getCheckedNodes">get by node</ep-button>
    <ep-button @click="getCheckedKeys">get by key</ep-button>
    <ep-button @click="setCheckedNodes">set by node</ep-button>
    <ep-button @click="setCheckedKeys">set by key</ep-button>
    <ep-button @click="resetChecked">reset</ep-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const treeRef = ref()

const getCheckedNodes = () => {
  console.log(treeRef.value?.getCheckedNodes(false, false))
}
const getCheckedKeys = () => {
  console.log(treeRef.value?.getCheckedKeys(false))
}
const setCheckedNodes = () => {
  treeRef.value?.setCheckedNodes(
    [
      {
        id: 5,
        label: '层级二 2-1'
      },
      {
        id: 9,
        label: '层级三 1-1-1'
      }
    ],
    false
  )
}
const setCheckedKeys = () => {
  treeRef.value?.setCheckedKeys([3], false)
}
const resetChecked = () => {
  treeRef.value?.setCheckedKeys([], false)
}

const defaultProps = {
  children: 'children',
  label: 'label'
}

const data = [
  {
    id: 1,
    label: '层级一 1',
    children: [
      {
        id: 4,
        label: '层级二 1-1',
        children: [
          {
            id: 9,
            label: '层级三 1-1-1'
          },
          {
            id: 10,
            label: '层级三 1-1-2'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    label: '层级一 2',
    children: [
      {
        id: 5,
        label: '层级二 2-1'
      },
      {
        id: 6,
        label: '层级二 2-2'
      }
    ]
  },
  {
    id: 3,
    label: '层级一 3',
    children: [
      {
        id: 7,
        label: '层级二 3-1'
      },
      {
        id: 8,
        label: '层级二 3-2'
      }
    ]
  }
]
</script>
