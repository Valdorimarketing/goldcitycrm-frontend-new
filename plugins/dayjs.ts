import dayjs from 'dayjs'
import 'dayjs/locale/tr'
import relativeTime from 'dayjs/plugin/relativeTime'

// Plugin'i yükle
dayjs.extend(relativeTime)
dayjs.locale('tr')

// Global olarak erişilebilir hale getir
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('dayjs', dayjs)
})
