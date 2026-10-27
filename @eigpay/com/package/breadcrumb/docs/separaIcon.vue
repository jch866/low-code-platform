<template>
  <div style="margin-top: 10px">
    <ep-breadcrumb separator-icon="ep-i-arrow-to-right">
      <ep-breadcrumb-item :to="{ path: '/' }">homepage</ep-breadcrumb-item>
      <ep-breadcrumb-item :to="{ path: '/components/pagination' }">
        promotion management
      </ep-breadcrumb-item>
      <ep-breadcrumb-item>promotion list</ep-breadcrumb-item>
      <ep-breadcrumb-item>promotion detail</ep-breadcrumb-item>
    </ep-breadcrumb>
  </div>
</template>
<script>
export default {
  name: 'SeparaIcon'
}
</script>
