<template>
  <div class="ui-input" :class="rootClasses">
    <label v-if="label" :for="id" class="ui-input__label">{{ label }}</label>
    <component
      :is="textarea ? 'textarea' : 'input'"
      :id="id"
      :rows="textarea ? rows : undefined"
      class="ui-input__control"
      :placeholder="placeholder"
      :value="internal"
      @input="onInput"
      @change="onChange"
    />

    <button v-if="clearable && hasValue" class="ui-input__clear" @click="clear" type="button" aria-label="Clear">
      X
    </button>

    <div v-if="$slots.suffix" class="ui-input__suffix"><slot name="suffix" /></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: String,
  placeholder: String,
  textarea: { type: Boolean, default: false },
  rows: { type: Number, default: 2 },
  ghostWhenEmpty: { type: Boolean, default: true },
  dense: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  debounce: { type: Number, default: 0 },             // add debounce for search
  id: { type: String, default: () => `in-${Math.random().toString(36).slice(2)}` },
})

const emit = defineEmits(['update:modelValue', 'change', 'input'])

let timer = null
const internal = computed(() => props.modelValue ?? '')

const hasValue = computed(() => String(internal.value).trim().length > 0)

const rootClasses = computed(() => ({
  'is-empty': !hasValue.value,
  'is-filled': hasValue.value,
  'is-ghost': !hasValue.value && props.ghostWhenEmpty,
  'is-dense': props.dense,
  'is-reason': props.id === 'reason'
}))

function update(val) {
  emit('update:modelValue', val)
  emit('input', val)
}
function onInput(e) {
  const val = e.target.value
  if (props.debounce > 0) {
    clearTimeout(timer)
    timer = setTimeout(() => update(val), props.debounce)
  } else {
    update(val)
  }
}
function onChange(e) {
  emit('change', e.target.value)
}
function clear() {
  update('')
  emit('change', '')
}
</script>

<style src="./_input.scss" lang="scss"></style>
