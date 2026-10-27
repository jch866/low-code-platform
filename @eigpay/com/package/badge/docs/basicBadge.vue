<template>
  <div>
    <ep-badge :value="999" class="item">
      <ep-button>replies</ep-button>
    </ep-badge>
    <ep-badge :value="1" type="success" class="item">
      <ep-button>comments</ep-button>
    </ep-badge>
    <ep-badge :value="1" type="error" class="item">
      <ep-button>comments</ep-button>
    </ep-badge>
    <ep-badge :value="2" type="warning" class="item">
      <ep-button>replies</ep-button>
    </ep-badge>
    <ep-badge :value="2" type="processing" class="item">
      <ep-button>replies</ep-button>
    </ep-badge>
    <ep-badge value="new" class="item">
      <ep-button>replies</ep-button>
    </ep-badge>
  </div>
</template>

<style scoped>
.item {
  margin-top: 20px;
  margin-right: 40px;
}
</style>
