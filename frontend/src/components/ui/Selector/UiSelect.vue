<template>
  <div class="ui-select">
    <label v-if="label" :for="id" class="ui-select__label">{{ label }}</label>
    <select
      :id="id"
      class="ui-select__control"
      :value="internalValue"
      @change="onChange"
      :aria-label="ariaLabel || label"
    >
      <option v-if="placeholder" value="__placeholder__" disabled selected hidden>
        {{ placeholder }}
      </option>
      <option
        v-for="opt in options"
        :key="String(opt.value)"
        :value="String(opt.value)"
      >
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  options: { type: Array, required: true }, // [{ value: 'Pending', label: 'Pending' }, { value: 10, label: '10' }]
  label: String,
  placeholder: String,
  ariaLabel: String,
  /** If true, convert emitted value to Number (e.g., page size) */
  coerceNumber: { type: Boolean, default: false },
  id: { type: String, default: () => `sel-${Math.random().toString(36).slice(2)}` },
})
const emit = defineEmits(['update:modelValue', 'change'])

const internalValue = computed(() =>
  props.modelValue === undefined || props.modelValue === null
    ? (props.placeholder ? '__placeholder__' : '')
    : String(props.modelValue)
)

function onChange(e) {
  const raw = e.target.value
  const val = props.coerceNumber ? Number(raw) : raw
  emit('update:modelValue', val)
  emit('change', val)
}
</script>

<style src="./_select.scss" lang="scss"></style>
