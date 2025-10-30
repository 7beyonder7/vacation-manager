<template>
  <div
    v-if="show"
    class="confirm-modal-backdrop"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="titleId"
    :aria-describedby="descId"
  >
    <div class="confirm-modal" @keydown.esc="$emit('cancel')" tabindex="-1" ref="panel">
      <h2 :id="titleId">{{ title }}</h2>
      <p :id="descId">{{ message }}</p>

      <div class="confirm-modal-actions">
        <button class="btn-cancel" @click="$emit('cancel')">{{ cancelText }}</button>
        <button class="btn-confirm" @click="$emit('confirm')">{{ confirmText }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  title: { type: String, default: 'Confirm Action' },
  message: { type: String, default: 'Are you sure you want to continue?' },
  confirmText: { type: String, default: 'Confirm' },
  cancelText: { type: String, default: 'Cancel' },
})

defineEmits(['confirm', 'cancel'])

const panel = ref(null)
const titleId = `modal-title-${Math.random().toString(36).slice(2)}`
const descId  = `modal-desc-${Math.random().toString(36).slice(2)}`

/* optional: focus the panel when opened */
watch(() => props.show, (v) => {
  if (v) setTimeout(() => panel.value?.focus(), 0)
})

/* optional: prevent background scroll while open */
const prevOverflow = { value: '' }
onMounted(() => {
  if (props.show) {
    prevOverflow.value = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
})
onBeforeUnmount(() => {
  document.body.style.overflow = prevOverflow.value || ''
})
watch(() => props.show, (v) => {
  if (v) {
    prevOverflow.value = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = prevOverflow.value || ''
  }
})
</script>

<style src="./_modal.scss" lang="scss"></style>
