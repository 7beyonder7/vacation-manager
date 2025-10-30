<template>
  <div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
      <h3 class="card-title">{{ $t('validator.allRequests') }}</h3>
      <div style="display:flex;gap:3.3rem;align-items:center;">
        <UiSelect
          v-model="status"
          :options="statusOptions"
          label="Filter by status"
          placeholder="All statuses"
        />
        <UiInput
          v-model="search"
          :placeholder="$t('placeholders.search')"
          :debounce="300"
        />
      </div>
    </div>
    <table class="table" v-if="items.length">
      <thead>
        <tr>
          <th>{{ $t('table.id') }}</th>
          <th>{{ $t('table.user') }}</th>
          <th>{{ $t('table.start') }}</th>
          <th>{{ $t('table.end') }}</th>
          <th>{{ $t('table.status') }}</th>
          <th>{{ $t('table.reason') }}</th>
          <th>{{ $t('table.comments') }}</th>
          <th>{{ $t('table.action') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in items" :key="r.id">
          <td>{{ r.id }}</td>
          <td>{{ r.User?.name ?? r.user_id }}</td>
          <td>{{ r.start_date }}</td>
          <td>{{ r.end_date }}</td>
          <td><span class="badge" :class="r.status">{{ $t(`status.${r.status}`) }}</span></td>
          <td style="max-width:240px">{{ r.reason }}</td>
          <td>
            <UiInput
              v-model="comments[r.id]"
              :placeholder="$t('placeholders.addComment')"
              :ghostWhenEmpty="true"
              :dense="true"
              :textarea="true"
              :rows="2"
              @change="val => onCommentEdit(r.id, val)"
            />
          </td>
          <td class="request_action">
            <button class="btn" @click="decide(r.id, 'Approved')">{{ $t('actions.approve') }}</button>
            <button class="btn secondary" @click="decide(r.id, 'Rejected')">{{ $t('actions.reject') }}</button>
            <button class="btn danger" @click="deleteReq(r.id)">{{ $t('actions.delete') }}</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="empty">
      <div class="loading-line line-70"></div>
      <div class="loading-line line-50"></div>
      <div class="empty-message">{{ $t('validator.noRequests') }}</div>
    </div>
    <Pagination
      v-model:page="page"
      v-model:pageSize="pageSize"
      :total="total"
      :pageSizeOptions="pageSizeOptions"
      @change="load"
    />
  </div>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue';
  import API from '../api';
  import Pagination from './Pagination.vue';
  import UiSelect from './ui/Selector/UiSelect.vue';
  import UiInput from './ui/CustomInput/CustomInput.vue'
  import { useStatusOptions } from '../lib/useStatusOptions';
  import { usePageSizeOptions } from '../lib/usePageSizeOptions';
  import { confirm } from '../lib/confirm';
  import { toast } from '../lib/toast';
  import { useI18n } from 'vue-i18n';
  import { getNumberPref, setNumberPref } from '../lib/prefs';
  
  const { t } = useI18n();
  const { options: statusOptions } = useStatusOptions({ includeAll: true });
  const { options: pageSizeOptions } = usePageSizeOptions();
  
  const items = ref([]);
  const total = ref(0);
  const page = ref(1)
  const pageSize = ref(getNumberPref('pageSize.requests', 10)) // unique key per view
  const status = ref('');
  const comments = ref({});
  const search = ref('');
  
  async function load() {
    const params = { page: page.value, pageSize: pageSize.value };
    if (status.value) params.status = status.value;
    if (search.value.trim()) params.search = search.value.trim();
    const { data } = await API.get('/api/requests', { params });
    items.value = data.items;
    total.value = data.total;
    comments.value = {};
    for (const r of items.value) {
      comments.value[r.id] = r.comments || '';
    }
  }
  
  async function decide(id, status) {
    const body = { status, comments: comments.value[id] }
    try {
      await API.patch(`/api/requests/${id}/decision`, body)
      toast(
        status === 'Approved' ? t('messages.approved') : t('messages.rejected'),
        'success'
      )
      await load()
    } catch (e) {
      const code = e?.response?.status
      const msg = e?.response?.data?.message || e.message
      if (code === 409) {
        toast(msg, 'error') // Will show overlap error on approve
      } else {
        toast(t('messages.actionFailed'), 'error')
      }
    }
  }

  async function deleteReq(id) {
    const okMessage = await confirm({
      title: t('actions.delete'),
      message: t('messages.confirmDelete'),
      confirmText: t('actions.delete'),
      cancelText: t('actions.cancel') || 'Cancel'
    })
    if (!okMessage) return
    try {
      await API.delete(`/api/requests/${id}`)
      toast(t('messages.deleted'), 'success')
      await load()
    } catch (e) {
      const msg = e?.response?.data?.message || t('messages.actionFailed')
      toast(msg, 'error')
    }
  }

  function onCommentEdit(id, val) {
   comments[id] = val // keep local state; send on Reject/Save if needed
  }
  
  onMounted(load);
  watch(pageSize, (n) => {
    setNumberPref('pageSize.requests', n) // persist per-view
    page.value = 1
    load()
  })
  watch([page, status], load);
  watch(search, () => { page.value = 1; load() })
</script>
