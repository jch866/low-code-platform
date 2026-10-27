<template>
  <div style="text-align: left">
    <div v-for="item in categories" :key="item.name" class="demo-icon-item">
      <ul class="demo-icon-list">
        <li
          v-for="iconname in item.icons"
          :key="iconname"
          :ref="iconname"
          class="icon-item"
          @click="copySvgIcon(iconname)"
        >
          <span class="demo-svg-icon">
            <ep-icon :icon="iconname" :size="25"></ep-icon>
            <span class="icon-name">{{ filterIconName(iconname) }}</span>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import clipboardCopy from 'copy-to-clipboard'
import IconCategories from './icons-categories.json'

const copyContent = async (content) => {
  await clipboardCopy(content)
}

const copySvgIcon = async (name) => {
  await copyContent(`<ep-icon icon="${name}"></ep-icon>`)
}
const categories = ref([])

IconCategories.categories.forEach((o) => {
  categories.value.push(o)
})

function filterIconName(iconName) {
  return iconName.replace(/^ep-i-/, '')
}
</script>

<style scoped lang="scss">
.demo-icon {
  &-item {
    margin-top: 24px;
    &:first-child {
      margin-top: 0;
    }
  }
  &-title {
    font-weight: 400;
    font-size: 18px;
    line-height: 26px;
  }
  &-list {
    overflow: hidden;
    list-style: none;
    padding: 0 !important;
    border-top: 1px solid #dcdfe6;
    border-left: 1px solid #dcdfe6;
    border-radius: 4px;
    display: grid;
    grid-template-columns: repeat(7, 1fr);

    .icon-item {
      text-align: center;
      color: #606266;
      height: 90px;
      font-size: 13px;
      border-right: 1px solid #dcdfe6;
      border-bottom: 1px solid #dcdfe6;
      transition: background-color 0.3s;
      &:hover {
        background-color: #f2f6fc;
      }

      .demo-svg-icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        cursor: pointer;

        .icon-name {
          margin-top: 8px;
        }
      }
    }
  }
}
</style>
