<template>
  <header>
    <img :src="logo" alt="Vue logo" class="logo" width="25" height="25" />
    <div class="wrapper">
      <h2>欢迎来到组件使用说明</h2>
    </div>
  </header>
  <main class="main">
    <aside class="flex-none w-60 aside">
      <nav>
        <li v-for="(link, index) in data.links" :key="index">
          <RouterLink :to="link.path">{{ link.name }}</RouterLink>
        </li>
      </nav>
    </aside>
    <main class="containor">
      <RouterView />
    </main>
  </main>
</template>
<script setup>
import componentList from '@package/components_list.json'
import { reactive } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
const data = reactive({
  links: componentList.map(({ compName, compZhName }) => ({
    path: `/components/${compName}`,
    name: compZhName
  }))
})
</script>
<script>
// const url = import.meta.url
export default {
  data() {
    return {
      logo: new URL('./assets/logo.svg', import.meta.url).href,
      url: import.meta.url,
      msg: ''
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
$padding-layout: 300px;
$header-h: 2.5rem;
header {
  @apply leading-10 h-10;

  .logo {
    @apply inline-block;
  }

  @media (min-width: 1024px) {
    & {
      display: flex;
      align-items: flex-start;
      place-items: center;
      padding-left: #{$padding-layout};

      @apply border-b border-b-slate-900/10;
      .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
      }
    }
  }
}

.main {
  @apply min-h-max;
  @apply flex px-[100px];
  .aside {
    @apply border-r  border-b-slate-900/10 mr-5 backdrop-blur;
    min-height: calc(100vh - #{$header-h});
    background: linear-gradient(0.85turn, #ffffff, #d0cce050, #ffffff);
    // background: linear-gradient(0.25turn, #3f87a6, #ebf8e1, #f69d3c);
    nav {
      @apply list-none text-base text-left;
      width: 100%;
      a {
        display: inline-block;
        padding: 0 1rem;
        border-left: 1px solid var(--color-border);
        &.router-link-exact-active {
          @apply text-sky-500;
          &:hover {
            background-color: transparent;
          }
        }
        &:first-of-type {
          border: 0;
        }
      }
      li {
        @apply leading-8;
      }
    }
  }
  .containor {
    @apply flex-auto bg-white;
  }
}
</style>
