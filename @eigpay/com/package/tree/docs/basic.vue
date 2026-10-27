<template>
  <ep-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
</template>

<script setup>
const handleNodeClick = (data) => {
  console.log(data)
}

const data = [
  {
    label: '层级一 1',
    children: [
      {
        label: '层级二 1-1',
        children: [
          {
            label: '层级三 1-1-1'
          }
        ]
      }
    ]
  },
  {
    label: '层级一 2',
    children: [
      {
        label: '层级二 2-1',
        children: [
          {
            label: '层级三 2-1-1'
          }
        ]
      },
      {
        label: '层级二 2-2',
        children: [
          {
            label: '层级三 2-2-1'
          }
        ]
      }
    ]
  },
  {
    label: '层级一 3',
    children: [
      {
        label: '层级二 3-1',
        children: [
          {
            label: '层级三 3-1-1'
          }
        ]
      },
      {
        label: '层级二 3-2',
        children: [
          {
            label: '层级三 3-2-1'
          }
        ]
      }
    ]
  }
]

const defaultProps = {
  children: 'children',
  label: 'label'
}
</script>
<script>
export default {
  name: 'TreeBasic'
}
</script>
