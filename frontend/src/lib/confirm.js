import { reactive } from 'vue'

export const confirmState = reactive({
  open: false,
  title: '',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  _resolve: null,
})

export function confirm(opts = {}) {
  return new Promise(resolve => {
    confirmState.title       = opts.title       || 'Confirm Action'
    confirmState.message     = opts.message     || 'Are you sure?'
    confirmState.confirmText = opts.confirmText || 'Confirm'
    confirmState.cancelText  = opts.cancelText  || 'Cancel'
    confirmState._resolve    = resolve
    confirmState.open        = true
  })
}
export function resolveConfirm(result) {
  if (confirmState._resolve) confirmState._resolve(result)
  confirmState.open = false
  confirmState._resolve = null
}
