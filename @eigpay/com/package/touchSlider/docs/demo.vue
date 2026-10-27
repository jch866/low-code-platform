<template>
  <div>
    <ep-touch-slider slider-length="3">
      <div>
        <div class="bg-grey"><i>slider 1</i></div>
        <div class="bg-blue"><i>slider 2</i></div>
        <div class="bg-salmon"><i>slider 3</i></div>
      </div>
    </ep-touch-slider>
  </div>
</template>

<script>
export default {
  name: 'TouchSliderDemo'
}
</script>
<style>
.touch-slider {
  width: 500px;
  overflow: hidden;
}
.touch-slider > div {
  width: 1500px;
}
.touch-slider > div > * {
  display: inline-block;
  width: 500px;
  line-height: 200px;
  text-align: center;
}
.bg-grey {
  background-color: lightgrey;
  height: 200px;
}
.bg-blue {
  background-color: aqua;
  height: 600px;
}
.bg-salmon {
  background-color: darksalmon;
  height: 400px;
}
</style>
