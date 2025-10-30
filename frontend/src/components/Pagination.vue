<template>
  <nav class="pagination">
    <div class="pagination-left">
      {{ startIndex }}–{{ endIndex }} / {{ total }}
    </div>
    <div class="pagination-center">
      <button class="btn secondary" :disabled="page <= 1" @click="goPrev">{{ prevText }}</button>
      <button class="btn" :disabled="page >= totalPages" @click="goNext">{{ nextText }}</button>
    </div>
    <div class="pagination-right">
      <UiSelect
        class="page-size-select"
        :label="labelItemsPerPage"
        v-model="localPageSize"
        :options="pageSizeOptionsToUse"
        :coerceNumber="true"
        @change="emitPageSize"
    />
    </div>
  </nav>
</template>

<script setup>
  import { computed, ref, watch } from 'vue'
  import UiSelect from './ui/Selector/UiSelect.vue'
  import { useI18n } from 'vue-i18n'
  import { makePageSizeOptions } from '../lib/options'
  
  const props = defineProps({
    page: { type: Number, required: true },
    pageSize: { type: Number, required: true },
    total: { type: Number, required: true }, // total items
    pageSizeOptions: { type: Array, default: null }, // [{value,label}] optional override
  })
  const emit = defineEmits(['update:page', 'update:pageSize', 'change'])
  
  const { t, locale } = useI18n()
  
  // Build default options if not provided
  const defaultOptions = computed(() => {
    // reactive to locale if you localize labels in the future
    const _ = locale.value
    return makePageSizeOptions()
  })
  const pageSizeOptionsToUse = computed(() => props.pageSizeOptions || defaultOptions.value)
  
  // local v-model for the select
  const localPageSize = ref(props.pageSize)
  watch(() => props.pageSize, v => { localPageSize.value = v })
  
  function emitPageSize() {
    emit('update:pageSize', localPageSize.value)
    // reset page to 1 when pageSize changes
    if (props.page !== 1) emit('update:page', 1)
  }
  
  const totalPages = computed(() => Math.max(1, Math.ceil(props.total / localPageSize.value)))
  const startIndex = computed(() => (props.total === 0 ? 0 : (props.page - 1) * localPageSize.value + 1))
  const endIndex = computed(() => Math.min(props.page * localPageSize.value, props.total))
  
  function goPrev() {
    if (props.page > 1) {
      emit('update:page', props.page - 1)
    }
  }
  function goNext() {
    if (props.page < totalPages.value) {
      emit('update:page', props.page + 1)
    }
  }
  
  const labelItemsPerPage = computed(() => t('paging.itemsPerPage') || 'Items per page')
  const prevText = computed(() => t('actions.prev') || 'Prev')
  const nextText = computed(() => t('actions.next') || 'Next')
</script>




