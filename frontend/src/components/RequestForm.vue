<template>
  <form @submit.prevent="onSubmit" class="card">
    <h3 class="card-title">{{ $t('requester.newTitle') }}</h3>
    <div class="grid grid-2">
      <div class="field">
        <label for="start">{{ $t('form.start') }}</label>
        <input id="start" type="date" v-model="form.start_date" required />
      </div>

      <div class="field">
        <label for="end">{{ $t('form.end') }}</label>
        <input id="end" type="date" v-model="form.end_date" required />
      </div>
    </div>

    <div class="field">
      <label for="reason">{{ $t('form.reasonOptional') }}</label>
      <UiInput
        id="reason"
        v-model="form.reason"
        :placeholder="$t('placeholders.reason')"
        :textarea="true"
        :rows="3"
        :ghostWhenEmpty="true"
      />
    </div>

    <div class="actions">
      <button class="btn" type="submit">{{ $t('requester.submit') }}</button>
    </div>
  </form>
</template>

<script setup>
import { reactive } from 'vue'
import UiInput from './ui/CustomInput/CustomInput.vue'
import API from '../api'
import { toast } from '../lib/toast'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const form = reactive({
  start_date: '',
  end_date: '',
  reason: ''
})

async function onSubmit() {
  if (new Date(form.start_date) > new Date(form.end_date)) {
    toast(t('errors.dateOrder'), 'error')
    return
  }
  try {
    await API.post('/api/requests', {
      start_date: form.start_date,
      end_date: form.end_date,
      reason: form.reason || null
    })
    toast(t('messages.requestSubmitted'), 'success')

    form.start_date = ''
    form.end_date = ''
    form.reason = ''
    window.dispatchEvent(new Event('refresh-requests'))
  } catch (e) {
    toast(e?.response?.data?.message || t('messages.actionFailed'), 'error')
  }
}
</script>
