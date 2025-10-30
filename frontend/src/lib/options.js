export const STATUS_VALUES = ['Pending', 'Approved', 'Rejected'];

/**
 * Build localized status options.
 * @param {Function} t - i18n translate function
 * @param {Object}   opts
 * @param {boolean}  opts.includeAll - prepend an "All" option
 * @param {string}   opts.allKey - i18n key for "All"
 */

export function makeStatusOptions(t, { includeAll = false, allKey = 'status.all' } = {}) {
  const base = STATUS_VALUES.map(v => ({ value: v, label: t(`status.${v}`) }));
  return includeAll ? [{ value: '', label: t(allKey) }, ...base] : base;
}

export const PAGE_SIZE_VALUES = [5, 10, 20];
export function makePageSizeOptions() {
  return PAGE_SIZE_VALUES.map(n => ({ value: n, label: String(n) }));
}