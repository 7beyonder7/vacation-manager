<template>
  <div class="container">
    <header>
      <div class="brand">
        <span class="spark"></span>
        <h1>{{ $t('app.title') }}</h1>
      </div>
      <div class="toolbar">
        <label for="select-user">{{ $t('app.user') }}:</label>
        <select id="select-user" v-model.number="userId" @change="onChangeUser">
          <option :value="1">Paul ({{ $t('nav.requester') }})</option>
          <option :value="2">Bob ({{ $t('nav.validator') }})</option>
        </select>
    
        <!-- ONE dynamic link by role -->
        <router-link :to="userId === 1 ? '/requester' : '/validator'">
          {{ userId === 1 ? $t('nav.requester') : $t('nav.validator') }}
        </router-link>
    
        <!-- Theme toggle -->
        <button class="btn secondary" @click="toggleTheme">
          {{ theme === 'light' ? $t('app.toggleToDark') : $t('app.toggleToLight') }}
        </button>
    
        <!-- Language select -->
        <select id ='lang_select' v-model="lang" @change="applyLang" aria-label="Language">
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </div>
    </header>
    <main>
      <router-view />
    </main>
    <ConfirmHost />
    <ToastHost />
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import ToastHost from './components/ui/ToastHost.vue'
  import ConfirmHost from './components/ui/ConfirmModal/ConfirmHost.vue'
  import { setUser } from './api'
  import { getUserId, setUserId } from './lib/user'
  import './styles/main.scss'
  
  // user persistence
  const userId = ref(getUserId())
  const onChangeUser = () => {
    setUserId(userId.value)
    setUser(userId.value) // keep compatibility with existing code
  }
  
  // theme
  const theme = ref(localStorage.getItem('theme') || 'light')
  watch(theme, (val) => {
    document.documentElement.setAttribute('data-theme', val)
  }, { immediate: true })
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
  }
  
  // i18n
  const { locale } = useI18n()
  const lang = ref(localStorage.getItem('lang') || locale.value || 'en')
  
  const applyLang = () => {
    locale.value = lang.value
    localStorage.setItem('lang', lang.value)
  }
  
  // initialize on load
  applyLang()
</script>
  