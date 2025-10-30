<template>
  <div class="toast-host">
    <div v-for="t in toasts" :key="t.id" class="toast" :data-type="t.type">
      {{ t.msg }}
    </div>
  </div>
</template>

<script setup>
    import { toasts } from '../../lib/toast';
</script>

