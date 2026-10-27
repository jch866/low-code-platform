<template>
  <div :class="ns.b()" @click.stop="$emit('pick')">
    {{ t('datePicker.today') }}
  </div>
</template>

<script setup>
import { useLocale } from '../../../hooks/locale'
import { buildCssNamespace } from '../../../util'

const { t } = useLocale()

const ns = buildCssNamespace('date-picker-panel-footer')

defineEmits(['pick'])
</script>
