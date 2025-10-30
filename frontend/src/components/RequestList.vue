<template>
  <div class="card">
    <div class="header-row">
      <h3 class="card-title">{{ $t('requester.myRequests') }}</h3>
      <div class="filter-box">
        <UiSelect
          v-model="status"
          :options="statusOptions"
          label="Filter by status"
          placeholder="All statuses"
        />
      </div>
  </div>
  <table class="table" v-if="items.length">
    <thead>
      <tr>
        <th>{{ $t('table.id') }}</th>
        <th>{{ $t('table.start') }}</th>
        <th>{{ $t('table.end') }}</th>
        <th>{{ $t('table.status') }}</th>
        <th>{{ $t('table.reason') }}</th>
        <th>{{ $t('table.comments') }}</th>
        <th>{{ $t('table.created') }}</th>
        <th>{{ $t('table.action') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="r in items" :key="r.id">
        <td>{{ r.id }}</td>
        <td>{{ r.start_date }}</td>
        <td>{{ r.end_date }}</td>
        <td><span class="badge" :class="r.status">{{ $t(`status.${r.status}`) }}</span></td>
        <td>{{ r.reason }}</td>
        <td>{{ r.comments }}</td>
        <td>{{ new Date(r.created_at).toLocaleString() }}</td>
        <td>
          <button v-if="r.status === 'Pending'" class="btn danger" @click="onDelete(r.id)">
            {{ $t('actions.delete') }}
          </button>
        </td>
      </tr>
    </tbody>
  </table>
  <div v-else class="empty">
    <div class="loading-line line-60"></div>
    <div class="loading-line line-40"></div>
    <div class="empty-message">{{ $t('requester.noRequests') }}</div>
  </div>
  <Pagination
    v-model:page="page"
    v-model:pageSize="pageSize"
    :total="total"
    :pageSizeOptions="pageSizeOptions"
  />
  </div>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue';
  import UiSelect from './ui/Selector/UiSelect.vue'
  import { useStatusOptions } from '../lib/useStatusOptions';
  import { usePageSizeOptions } from '../lib/usePageSizeOptions';
  import API from '../api';
  import Pagination from './Pagination.vue';
  import { toast } from '../lib/toast'
  import { confirm } from './../lib/confirm'
  import { useI18n } from 'vue-i18n'
  import { getNumberPref, setNumberPref } from '../lib/prefs'
  
  const { t } = useI18n()
  
  const items = ref([]);
  const total = ref(0);
  const page = ref(1);
  const pageSize = ref(getNumberPref('pageSize.requests', 10)) // unique key per view
  const status = ref('');
  const confirmOpen = ref(false)
  const requestToDelete = ref(null)
  const { options: statusOptions } = useStatusOptions({ includeAll: true });
  const { options: pageSizeOptions } = usePageSizeOptions()
  
  async function load() {
    const params = { page: page.value, pageSize: pageSize.value };
    if (status.value) params.status = status.value;
    const { data } = await API.get('/api/requests/mine', { params });
    items.value = data.items;
    total.value = data.total;
  }
  
  async function onDelete(id) {
    const okMessage = await confirm({
      title: t('actions.delete'),
      message: t('messages.confirmDelete'),
      confirmText: t('actions.delete'),
      cancelText: t('actions.cancel') || 'Cancel'
    })
    if (!okMessage || !id) return
    try {
    await API.delete(`/api/requests/${id}`)
      toast(t('messages.deleted'),'success')
      await load()
    } catch (e) {
      const code = e?.response?.status
      if ([403,409].includes(code)) toast(t('messages.deleteBlocked'),'error')
      else toast(t('messages.actionFailed'),'error')
    }
    finally {
      confirmOpen.value = false
      requestToDelete.value = null
    }
  }
  
  const reload = () => { page.value = 1; load(); };
  
  onMounted(() => {
    load();
    window.addEventListener('refresh-requests', reload);
  });
  
  watch(pageSize, (n) => {
    setNumberPref('pageSize.requests', n) // persist per-view
    load()
  })
  watch([page, status], load);
</script>
