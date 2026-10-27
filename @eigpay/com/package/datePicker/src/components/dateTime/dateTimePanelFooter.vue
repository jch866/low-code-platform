<template>
  <div :class="ns.b()">
    <div @click.stop="$emit('pick')">
      {{ t('common.now') }}
    </div>
    <div @click.stop="$emit('confirm')">
      {{ t('common.confirm') }}
    </div>
  </div>
</template>

<script setup>
import { useLocale } from '../../../../hooks/locale'
import { buildCssNamespace } from '../../../../util'

const { t } = useLocale()

const ns = buildCssNamespace('date-time-panel__footer')

defineEmits(['pick', 'confirm'])
</script>
