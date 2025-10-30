<template>
  <ConfirmModal
    :show="state.open"
    :title="state.title"
    :message="state.message"
    :confirmText="state.confirmText"
    :cancelText="state.cancelText"
    @confirm="() => resolveConfirm(true)"
    @cancel="() => resolveConfirm(false)"
  />
</template>

<script setup>
  import { confirmState as state, resolveConfirm } from '../../../lib/confirm'
  import ConfirmModal from './ConfirmModal.vue'
</script>
