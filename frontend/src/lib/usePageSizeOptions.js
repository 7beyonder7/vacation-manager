import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { makePageSizeOptions } from './options.js';

export function usePageSizeOptions() {
  const { t, locale } = useI18n();
  const options = computed(() => {
    // ensure recompute on language change (future-proof)
    const _ = locale.value;
    return makePageSizeOptions(t);
  });
  return { options };
}