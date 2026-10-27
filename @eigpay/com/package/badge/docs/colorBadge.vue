<template>
  <div>
    <ep-badge :value="999" class="item" color="blue">
      <ep-button>replies</ep-button>
    </ep-badge>
    <ep-badge :value="1" type="success" class="item" color="#800000">
      <ep-button>comments</ep-button>
    </ep-badge>
    <ep-badge :value="1" type="error" class="item" color="#000">
      <ep-button>comments</ep-button>
    </ep-badge>
  </div>
</template>

<style scoped>
.item {
  margin-top: 20px;
  margin-right: 40px;
}
</style>
