<template>
  <div style="margin-top: 10px">
    <ep-breadcrumb separator="/">
      <ep-breadcrumb-item :to="{ path: '/' }">homepage</ep-breadcrumb-item>
      <ep-breadcrumb-item :to="{ path: '/components/pagination' }" replace>
        promotion management
      </ep-breadcrumb-item>
      <ep-breadcrumb-item>
        <a href="/components/pagination">promotion list</a>
      </ep-breadcrumb-item>
      <ep-breadcrumb-item>promotion detail</ep-breadcrumb-item>
    </ep-breadcrumb>
  </div>
</template>
<script>
export default {
  name: 'BasicUsage'
}
</script>
