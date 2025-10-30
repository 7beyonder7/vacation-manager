import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { makeStatusOptions } from './options.js';

export function useStatusOptions({ includeAll = false } = {}) {
  const { t, locale } = useI18n();

  const options = computed(() => {
    // locale.value is accessed, so the computed re-runs on language change
    return makeStatusOptions(t, { includeAll, currentLocale: locale.value });
  });

  return { options };
}