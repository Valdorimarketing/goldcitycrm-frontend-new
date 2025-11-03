<template>
  <div class="card">
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import trLocale from '@fullcalendar/core/locales/tr'

const props = defineProps({
  meetings: {
    type: Array,
    required: true,
    default: () => []
  }, 
  loading: {
    type: Boolean,
    default: false
  }
})
 

const emit = defineEmits(['eventClick', 'dateSelect'])

const getEventTitle = (meeting) => {
  const parts = []

  if (meeting.customerData) { 
    parts.push(meeting.customerData)
  }

  if (meeting.hospital?.name) {
    parts.push(meeting.hospital.name)
  }

  if (meeting.doctor?.name) {
    parts.push(meeting.doctor.name)
  }

  return parts.join(' - ') || 'Randevu'
}
 
const events = computed(() => {
  return props.meetings.map(meeting => {
    let color = '#3B82F6'

    if (meeting.meetingStatus) {
      const status = meeting.meetingStatus
      if (typeof status === 'object' && status.is_sale) {
        color = '#10B981'
      } else if (typeof status === 'object' && status.is_closed) {
        color = '#EF4444'
      }
    }

    return {
      id: meeting.id?.toString(),
      title: getEventTitle(meeting),
      start: meeting.startTime,
      end: meeting.endTime,
      backgroundColor: color,
      borderColor: color,
      extendedProps: {
        meeting: meeting
      }
    }
  })
})



// 🔹 Dark mode'u izleyen reactive değer
const isDarkMode = ref(document.documentElement.classList.contains('dark'))

// 🔹 Dark mode değişimlerini dinle (örneğin Tailwind dark toggle)
const observer = new MutationObserver(() => {
  isDarkMode.value = document.documentElement.classList.contains('dark')
})
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

 

// 🔹 Dark mode'a göre dinamik tema renkleri
const calendarOptions = ref({})

const updateCalendarOptions = () => {
  calendarOptions.value = {
    plugins: [timeGridPlugin, dayGridPlugin, interactionPlugin, listPlugin],
    initialView: 'timeGridWeek',
    locale: trLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    slotMinTime: '08:00:00',
    slotMaxTime: '20:00:00',
    allDaySlot: false,
    height: 'auto',
    expandRows: true,
    events: events.value,
    nowIndicator: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    weekends: true,
    editable: false,
    eventTimeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
    slotLabelFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
    displayEventTime: true,
    displayEventEnd: true,

    // 🔹 Dark mode farkı
    eventClassNames: isDarkMode.value ? ['fc-dark-event'] : ['fc-light-event'],
    dayHeaderClassNames: isDarkMode.value ? ['fc-dark-header'] : ['fc-light-header'],
    slotLabelClassNames: isDarkMode.value ? ['fc-dark-slot'] : ['fc-light-slot'],
    slotLaneContentClassNames: isDarkMode.value ? ['fc-dark-slot-lane'] : ['fc-light-slot-lane'],

    // 🔹 Buraya ekliyoruz
    dateClick: (info) => {
      emit('dateSelect', info)  // tıklanan günü parent’e gönder
    },
    eventClick: (info) => {
      emit('eventClick', info.event.extendedProps.meeting) // event objesini parent’e gönder
    },
  }
}


// İlk yükleme
updateCalendarOptions()

// 🔹 Dark mode değiştiğinde otomatik güncelle
watch(isDarkMode, () => {
  updateCalendarOptions()
})
 

watch(() => props.meetings, () => {
}, { deep: true })
</script>

<style scoped>
:deep(.fc) {
  --fc-border-color: rgb(229 231 235);
  --fc-button-bg-color: rgb(99 102 241);
  --fc-button-border-color: rgb(99 102 241);
  --fc-button-hover-bg-color: rgb(79 70 229);
  --fc-button-hover-border-color: rgb(79 70 229);
  --fc-button-active-bg-color: rgb(67 56 202);
  --fc-button-active-border-color: rgb(67 56 202);
  --fc-today-bg-color: rgba(99, 102, 241, 0.1);
}

:deep(.dark .fc) {
  --fc-border-color: rgb(55 65 81);
  --fc-neutral-bg-color: rgb(31 41 55);
  --fc-page-bg-color: rgb(17 24 39);
  --fc-today-bg-color: rgba(99, 102, 241, 0.2);
  color: rgb(243 244 246);
}

:deep(.dark .fc .fc-col-header-cell) {
  background-color: rgb(31 41 55);
  color: rgb(209 213 219);
}

:deep(.dark .fc .fc-daygrid-day) {
  background-color: rgb(17 24 39);
}

:deep(.dark .fc .fc-timegrid-slot) {
  background-color: rgb(17 24 39);
}

:deep(.dark .fc .fc-list-event:hover td) {
  background-color: rgb(31 41 55);
}

:deep(.fc-event) {
  cursor: pointer;
  font-size: 0.875rem;
  padding: 2px 4px;
  border-radius: 4px;
}

:deep(.fc-event:hover) {
  opacity: 0.8;
}

:deep(.fc-timegrid-slot-label) {
  font-size: 0.75rem;
  vertical-align: middle;
}

:deep(.fc .fc-toolbar-title) {
  font-size: 1.25rem;
  font-weight: 600;
}

:deep(.fc .fc-button) {
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
}

@media (max-width: 768px) {
  :deep(.fc .fc-toolbar) {
    flex-direction: column;
    gap: 0.5rem;
  }

  :deep(.fc .fc-toolbar-chunk) {
    margin: 0.25rem 0;
  }

  :deep(.fc .fc-button) {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
  }
}
</style>
