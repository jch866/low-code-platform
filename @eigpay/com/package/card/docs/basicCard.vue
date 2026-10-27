<template>
  <div>
    <ep-card class="box-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>Card name</span>
          <ep-button>Operation button</ep-button>
        </div>
      </template>
      <div v-for="item in 4" :key="item" class="item">
        {{ 'List item ' + item }}
      </div>
    </ep-card>
  </div>
</template>
<script>
export default {
  name: 'BasicCard'
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item {
  margin-bottom: 10px;
}

.box-card {
  width: 380px;
}
</style>
