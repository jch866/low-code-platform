<template>
  <div>
    <div @click.stop="$emit('cancel')">
      {{ t('common.cancel') }}
    </div>
    <div @click.stop="$emit('confirm')">
      {{ t('common.confirm') }}
    </div>
  </div>
</template>

<script setup>
import { useLocale } from '../../../hooks/locale'

const { t } = useLocale()

defineEmits(['cancel', 'confirm'])
</script>
