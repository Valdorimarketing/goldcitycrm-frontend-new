<template>
  <Teleport to="body">
    <Transition 
      enter-active-class="duration-300 ease-out" 
      enter-from-class="opacity-0" 
      enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in" 
      leave-from-class="opacity-100" 
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- BACKDROP -->
        <div class="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 backdrop-blur-sm" @click="close"></div>

        <!-- MODAL BOX -->
        <div class="flex min-h-screen items-center justify-center p-4">
          <Transition 
            enter-active-class="duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100" 
            leave-active-class="duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div 
              v-if="show"
              class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all w-full max-w-6xl max-h-[90vh] flex flex-col"
            >
              <!-- HEADER -->
              <div class="bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-4 flex justify-between items-center flex-shrink-0">
                <div>
                  <h3 class="text-lg font-semibold text-white">
                    {{ t('operation_followup.title', 'Operasyon Takip Sistemi') }}
                  </h3>
                  <p class="text-sm text-pink-100">
                    {{ customer?.name }} {{ customer?.surname }}
                  </p>
                </div>
                <button @click="close" class="rounded-lg p-2 hover:bg-white/20 transition">
                  <XMarkIcon class="h-5 w-5 text-white" />
                </button>
              </div>

              <!-- CONTENT -->
              <div class="flex-1 overflow-y-auto">
                <!-- LISTE GÖRÜNÜMÜ -->
                <div v-if="view === 'list'" class="p-6 space-y-4">
                  <div class="flex justify-between items-center mb-3">
                    <h4 class="text-md font-semibold text-gray-800 dark:text-gray-200">
                      {{ t('operation_followup.list.title', 'Operasyon Kayıtları') }}
                    </h4>
                    <button 
                      @click="startNew"
                      class="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-rose-700 transition flex items-center gap-2"
                    >
                      <PlusIcon class="h-4 w-4" />
                      {{ t('operation_followup.list.add_new', 'Yeni Operasyon') }}
                    </button>
                  </div>

                  <div v-if="loading" class="flex items-center justify-center py-8">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
                    <span class="ml-3 text-gray-500">{{ t('operation_followup.list.loading', 'Yükleniyor...') }}</span>
                  </div>

                  <div v-else-if="schedules.length" class="space-y-3">
                    <div 
                      v-for="item in schedules" 
                      :key="item.id" 
                      @click="openFollowup(item)"
                      class="p-4 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition group"
                    >
                      <div class="flex justify-between items-start">
                        <div>
                          <span class="font-semibold text-gray-900 dark:text-white">{{ item.operationType?.name }}</span>
                          <div class="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                            <span class="flex items-center gap-1">
                              <CalendarIcon class="h-4 w-4" />
                              {{ formatDate(item.scheduled_at) }}
                            </span>
                            <span class="flex items-center gap-1">
                              <ClockIcon class="h-4 w-4" />
                              {{ getProgress(item) }}
                            </span>
                          </div>
                        </div>
                        <ChevronRightIcon class="h-5 w-5 text-gray-400 group-hover:text-rose-600 transition" />
                      </div>
                    </div>
                  </div>

                  <div v-else class="text-center py-12">
                    <ClipboardDocumentListIcon class="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p class="text-gray-500 dark:text-gray-400">{{ t('operation_followup.list.empty', 'Henüz operasyon kaydı bulunamadı.') }}</p>
                    <button 
                      @click="startNew"
                      class="mt-4 text-rose-600 hover:text-rose-700 text-sm font-medium"
                    >
                      {{ t('operation_followup.list.add_first', 'İlk operasyonu ekleyin →') }}
                    </button>
                  </div>
                </div>

                <!-- YENİ OPERASYON OLUŞTUR -->
                <div v-else-if="view === 'create'" class="p-6 space-y-6">
                  <div class="flex justify-between items-center">
                    <h4 class="text-md font-semibold text-gray-800 dark:text-gray-200">
                      {{ t('operation_followup.create.title', 'Yeni Operasyon Kaydı') }}
                    </h4>
                    <button 
                      @click="backToList"
                      class="text-sm text-gray-600 dark:text-gray-300 hover:text-rose-600 transition flex items-center gap-1"
                    >
                      <ArrowLeftIcon class="h-4 w-4" />
                      {{ t('operation_followup.detail.back_to_list', 'Listeye Dön') }}
                    </button>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- TARİH SEÇİMİ -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {{ t('operation_followup.form.operation_date', 'Operasyon Tarihi') }} *
                      </label>
                      <div class="relative">
                        <input
                          ref="datepickerInput"
                          type="text"
                          v-model="selectedDateDisplay"
                          readonly
                          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          :placeholder="t('operation_followup.form.select_date', 'Tarih seçin')"
                        />
                        <CalendarIcon class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <!-- İŞLEM TİPİ -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {{ t('operation_followup.form.operation_type', 'İşlem Tipi') }} *
                      </label>
                      <select 
                        v-model="selectedOperationType"
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      >
                        <option value="" disabled>{{ t('operation_followup.form.select_type', 'İşlem tipi seçin') }}</option>
                        <option v-for="opType in operationTypes" :key="opType.id" :value="opType.id">
                          {{ opType.name }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <!-- ÖNIZLEME -->
                  <div v-if="selectedDate && selectedOperationType" class="mt-6">
                    <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      {{ t('operation_followup.create.preview', 'Takip Takvimi Önizleme') }}
                    </h5>
                    <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div v-for="item in [...previewDays, ...previewMonths].slice(0, 8)" :key="`${item.kind}-${item.offset}`" class="flex items-center gap-2">
                          <span class="w-2 h-2 rounded-full" :class="item.kind === 'day' ? 'bg-blue-500' : 'bg-green-500'"></span>
                          <span class="text-gray-600 dark:text-gray-300">
                            {{ item.kind === 'day' ? `${item.offset}. Gün` : `${item.offset}. Ay` }}:
                          </span>
                          <span class="text-gray-900 dark:text-white font-medium">{{ formatPreviewDate(item.date) }}</span>
                        </div>
                      </div>
                      <p class="text-xs text-gray-500 mt-3">
                        {{ t('operation_followup.create.total_followups', 'Toplam') }}: {{ previewDays.length + previewMonths.length }} {{ t('operation_followup.create.followup_points', 'takip noktası') }}
                      </p>
                    </div>
                  </div>

                  <!-- BUTONLAR -->
                  <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button 
                      @click="backToList"
                      class="px-5 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                      {{ t('operation_followup.actions.cancel', 'İptal') }}
                    </button>
                    <button 
                      @click="onSave" 
                      :disabled="isSaving || !selectedDate || !selectedOperationType"
                      class="px-5 py-2.5 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                    >
                      <span v-if="isSaving" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      {{ isSaving ? t('operation_followup.actions.saving', 'Kaydediliyor...') : t('operation_followup.actions.save', 'Kaydet') }}
                    </button>
                  </div>
                </div>

                <!-- TAKİP DETAY - ACCORDION STYLE -->
                <div v-else-if="view === 'detail'" class="p-6 space-y-6">
                  <!-- Header -->
                  <div class="flex justify-between items-center">
                    <div>
                      <h4 class="text-md font-semibold text-gray-800 dark:text-gray-200">
                        {{ selectedItem?.operationType?.name }}
                      </h4>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ t('operation_followup.detail.operation_date', 'Operasyon Tarihi') }}: {{ formatDate(selectedItem?.scheduled_at) }}
                      </p>
                    </div>
                    <div class="flex items-center gap-3">
                      <button 
                        @click="confirmDelete"
                        class="text-sm text-red-600 hover:text-red-700 transition flex items-center gap-1"
                      >
                        <TrashIcon class="h-4 w-4" />
                        {{ t('operation_followup.actions.delete', 'Sil') }}
                      </button>
                      <button 
                        @click="backToList"
                        class="text-sm text-gray-600 dark:text-gray-300 hover:text-rose-600 transition flex items-center gap-1"
                      >
                        <ArrowLeftIcon class="h-4 w-4" />
                        {{ t('operation_followup.detail.back_to_list', 'Listeye Dön') }}
                      </button>
                    </div>
                  </div>

                  <!-- Progress Summary -->
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
                      <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ daysDoneCount }}/{{ dayList.length }}</p>
                      <p class="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">Gün Takibi</p>
                    </div>
                    <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
                      <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ monthsDoneCount }}/{{ monthList.length }}</p>
                      <p class="text-xs text-green-600/70 dark:text-green-400/70 mt-1">Ay Takibi</p>
                    </div>
                    <div class="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-4 text-center">
                      <p class="text-2xl font-bold text-rose-600 dark:text-rose-400">{{ pendingCount }}</p>
                      <p class="text-xs text-rose-600/70 dark:text-rose-400/70 mt-1">Bekleyen</p>
                    </div>
                    <div class="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-4 text-center">
                      <p class="text-2xl font-bold text-rose-600 dark:text-rose-400">%{{ completionPercentage }}</p>
                      <p class="text-xs text-rose-600/70 dark:text-rose-400/70 mt-1">Tamamlanma</p>
                    </div>
                  </div>

                  <!-- GÜN TAKİPLERİ - ACCORDION -->
                  <div class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <button 
                      @click="toggleSection('days')"
                      class="w-full flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
                    >
                      <div class="flex items-center gap-3">
                        <span class="w-3 h-3 rounded-full bg-blue-500"></span>
                        <span class="font-medium text-gray-900 dark:text-white">
                          {{ t('operation_followup.sections.days', 'Gün Takipleri') }}
                        </span>
                        <span class="text-sm text-gray-500 dark:text-gray-400">
                          ({{ daysDoneCount }}/{{ dayList.length }} tamamlandı)
                        </span>
                      </div>
                      <ChevronDownIcon 
                        class="h-5 w-5 text-gray-500 transition-transform duration-200" 
                        :class="{ 'rotate-180': expandedSections.days }"
                      />
                    </button>
                    
                    <Transition
                      enter-active-class="transition-all duration-200 ease-out"
                      enter-from-class="max-h-0 opacity-0"
                      enter-to-class="max-h-[2000px] opacity-100"
                      leave-active-class="transition-all duration-200 ease-in"
                      leave-from-class="max-h-[2000px] opacity-100"
                      leave-to-class="max-h-0 opacity-0"
                    >
                      <div v-show="expandedSections.days" class="divide-y divide-gray-100 dark:divide-gray-700">
                        <div 
                          v-for="item in dayList" 
                          :key="`day-${item.offset}`"
                          class="bg-white dark:bg-gray-800"
                        >
                          <!-- Accordion Item Header -->
                          <button 
                            @click="toggleItem(`day-${item.offset}`)"
                            class="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                          >
                            <div class="flex items-center gap-4">
                              <span 
                                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                                :class="item.done 
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' 
                                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'"
                              >
                                {{ item.offset }}. Gün
                              </span>
                              <span class="text-sm text-gray-600 dark:text-gray-300">
                                {{ formatTableDate(item.date) }}
                              </span>
                              <span v-if="item.note" class="text-xs text-gray-400 truncate max-w-[200px]">
                                📝 {{ item.note }}
                              </span>
                            </div>
                            <div class="flex items-center gap-3">
                              <span 
                                class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                                :class="item.done 
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' 
                                  : 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'"
                              >
                                <CheckCircleIcon v-if="item.done" class="h-3.5 w-3.5" />
                                <ClockIcon v-else class="h-3.5 w-3.5" />
                                {{ item.done ? 'Yapıldı' : 'Yapılacak' }}
                              </span>
                              <ChevronDownIcon 
                                class="h-4 w-4 text-gray-400 transition-transform duration-200" 
                                :class="{ 'rotate-180': expandedItems[`day-${item.offset}`] }"
                              />
                            </div>
                          </button>
                          
                          <!-- Accordion Item Content -->
                          <Transition
                            enter-active-class="transition-all duration-200 ease-out"
                            enter-from-class="max-h-0 opacity-0"
                            enter-to-class="max-h-96 opacity-100"
                            leave-active-class="transition-all duration-200 ease-in"
                            leave-from-class="max-h-96 opacity-100"
                            leave-to-class="max-h-0 opacity-0"
                          >
                            <div v-show="expandedItems[`day-${item.offset}`]" class="px-4 pb-4 bg-gray-50 dark:bg-gray-900/50">
                              <div class="pt-4 space-y-4">
                                <!-- Info Grid -->
                                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Müşteri</p>
                                    <p class="font-medium text-gray-900 dark:text-white">{{ customerFullName }}</p>
                                  </div>
                                  <div>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Danışman</p>
                                    <p class="font-medium text-gray-900 dark:text-white">{{ consultantName }}</p>
                                  </div>
                                  <div>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Segment</p>
                                    <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium" :class="getSegmentClass(customerStatus)">
                                      {{ customerStatus.name || '-' }}
                                    </span>
                                  </div>
                                  <div>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Tarih</p>
                                    <p class="font-medium text-gray-900 dark:text-white">{{ formatTableDate(item.date) }}</p>
                                  </div>
                                </div>
                                
                                <!-- Note Textarea -->
                                <div>
                                  <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    Not
                                  </label>
                                  <textarea 
                                    v-model="editingNotes[`day-${item.offset}`]"
                                    rows="3"
                                    :placeholder="t('operation_followup.table.note_placeholder', 'Not ekleyin...')"
                                    class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                                  ></textarea>
                                </div>
                                
                                <!-- Action Buttons -->
                                <div class="flex items-center justify-between pt-2">
                                  <button 
                                    @click="toggleDone(item)"
                                    class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition"
                                    :class="item.done 
                                      ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/50 dark:text-rose-300' 
                                      : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300'"
                                  >
                                    <template v-if="item.done">
                                      <XMarkIcon class="h-4 w-4" />
                                      Yapılmadı Olarak İşaretle
                                    </template>
                                    <template v-else>
                                      <CheckCircleIcon class="h-4 w-4" />
                                      Yapıldı Olarak İşaretle
                                    </template>
                                  </button>
                                  
                                  <button 
                                    @click="saveNote(item)"
                                    :disabled="savingNote === `day-${item.offset}`"
                                    class="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                  >
                                    <template v-if="savingNote === `day-${item.offset}`">
                                      <span class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                      Kaydediliyor...
                                    </template>
                                    <template v-else>
                                      <DocumentTextIcon class="h-4 w-4" />
                                      Notu Kaydet
                                    </template>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </Transition>
                        </div>
                      </div>
                    </Transition>
                  </div>

                  <!-- AY TAKİPLERİ - ACCORDION -->
                  <div class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <button 
                      @click="toggleSection('months')"
                      class="w-full flex items-center justify-between px-4 py-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition"
                    >
                      <div class="flex items-center gap-3">
                        <span class="w-3 h-3 rounded-full bg-green-500"></span>
                        <span class="font-medium text-gray-900 dark:text-white">
                          {{ t('operation_followup.sections.months', 'Ay Takipleri') }}
                        </span>
                        <span class="text-sm text-gray-500 dark:text-gray-400">
                          ({{ monthsDoneCount }}/{{ monthList.length }} tamamlandı)
                        </span>
                      </div>
                      <ChevronDownIcon 
                        class="h-5 w-5 text-gray-500 transition-transform duration-200" 
                        :class="{ 'rotate-180': expandedSections.months }"
                      />
                    </button>
                    
                    <Transition
                      enter-active-class="transition-all duration-200 ease-out"
                      enter-from-class="max-h-0 opacity-0"
                      enter-to-class="max-h-[2000px] opacity-100"
                      leave-active-class="transition-all duration-200 ease-in"
                      leave-from-class="max-h-[2000px] opacity-100"
                      leave-to-class="max-h-0 opacity-0"
                    >
                      <div v-show="expandedSections.months" class="divide-y divide-gray-100 dark:divide-gray-700">
                        <div 
                          v-for="item in monthList" 
                          :key="`month-${item.offset}`"
                          class="bg-white dark:bg-gray-800"
                        >
                          <!-- Accordion Item Header -->
                          <button 
                            @click="toggleItem(`month-${item.offset}`)"
                            class="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                          >
                            <div class="flex items-center gap-4">
                              <span 
                                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                                :class="item.done 
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' 
                                  : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'"
                              >
                                {{ item.offset }}. Ay
                              </span>
                              <span class="text-sm text-gray-600 dark:text-gray-300">
                                {{ formatTableDate(item.date) }}
                              </span>
                              <span v-if="item.note" class="text-xs text-gray-400 truncate max-w-[200px]">
                                📝 {{ item.note }}
                              </span>
                            </div>
                            <div class="flex items-center gap-3">
                              <span 
                                class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                                :class="item.done 
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' 
                                  : 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'"
                              >
                                <CheckCircleIcon v-if="item.done" class="h-3.5 w-3.5" />
                                <ClockIcon v-else class="h-3.5 w-3.5" />
                                {{ item.done ? 'Yapıldı' : 'Yapılacak' }}
                              </span>
                              <ChevronDownIcon 
                                class="h-4 w-4 text-gray-400 transition-transform duration-200" 
                                :class="{ 'rotate-180': expandedItems[`month-${item.offset}`] }"
                              />
                            </div>
                          </button>
                          
                          <!-- Accordion Item Content -->
                          <Transition
                            enter-active-class="transition-all duration-200 ease-out"
                            enter-from-class="max-h-0 opacity-0"
                            enter-to-class="max-h-96 opacity-100"
                            leave-active-class="transition-all duration-200 ease-in"
                            leave-from-class="max-h-96 opacity-100"
                            leave-to-class="max-h-0 opacity-0"
                          >
                            <div v-show="expandedItems[`month-${item.offset}`]" class="px-4 pb-4 bg-gray-50 dark:bg-gray-900/50">
                              <div class="pt-4 space-y-4">
                                <!-- Info Grid -->
                                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Müşteri</p>
                                    <p class="font-medium text-gray-900 dark:text-white">{{ customerFullName }}</p>
                                  </div>
                                  <div>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Danışman</p>
                                    <p class="font-medium text-gray-900 dark:text-white">{{ consultantName }}</p>
                                  </div>
                                  <div>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Segment</p>
                                    <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium" :class="getSegmentClass(customerStatus)">
                                      {{ customerStatus.name || '-' }}
                                    </span>
                                  </div>
                                  <div>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Tarih</p>
                                    <p class="font-medium text-gray-900 dark:text-white">{{ formatTableDate(item.date) }}</p>
                                  </div>
                                </div>
                                
                                <!-- Note Textarea -->
                                <div>
                                  <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    Not
                                  </label>
                                  <textarea 
                                    v-model="editingNotes[`month-${item.offset}`]"
                                    rows="3"
                                    :placeholder="t('operation_followup.table.note_placeholder', 'Not ekleyin...')"
                                    class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                                  ></textarea>
                                </div>
                                
                                <!-- Action Buttons -->
                                <div class="flex items-center justify-between pt-2">
                                  <button 
                                    @click="toggleDone(item)"
                                    class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition"
                                    :class="item.done 
                                      ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/50 dark:text-rose-300' 
                                      : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300'"
                                  >
                                    <template v-if="item.done">
                                      <XMarkIcon class="h-4 w-4" />
                                      Yapılmadı Olarak İşaretle
                                    </template>
                                    <template v-else>
                                      <CheckCircleIcon class="h-4 w-4" />
                                      Yapıldı Olarak İşaretle
                                    </template>
                                  </button>
                                  
                                  <button 
                                    @click="saveNote(item)"
                                    :disabled="savingNote === `month-${item.offset}`"
                                    class="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                  >
                                    <template v-if="savingNote === `month-${item.offset}`">
                                      <span class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                      Kaydediliyor...
                                    </template>
                                    <template v-else>
                                      <DocumentTextIcon class="h-4 w-4" />
                                      Notu Kaydet
                                    </template>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </Transition>
                        </div>
                      </div>
                    </Transition>
                  </div>
                </div>
              </div>

              <!-- DELETE MODAL -->
              <Teleport to="body">
                <Transition
                  enter-active-class="duration-200 ease-out"
                  enter-from-class="opacity-0"
                  enter-to-class="opacity-100"
                  leave-active-class="duration-150 ease-in"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
                >
                  <div v-if="showDeleteModal" class="fixed inset-0 z-[60] overflow-y-auto">
                    <div class="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80" @click="showDeleteModal = false"></div>
                    <div class="flex min-h-screen items-center justify-center p-4">
                      <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
                        <div class="flex items-start gap-4">
                          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                            <ExclamationTriangleIcon class="h-5 w-5 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                              {{ t('operation_followup.delete_modal.title', 'Operasyon Takibini Sil') }}
                            </h3>
                            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                              {{ t('operation_followup.delete_modal.message', 'Bu kaydı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.') }}
                            </p>
                          </div>
                        </div>
                        <div class="mt-6 flex justify-end gap-3">
                          <button 
                            @click="showDeleteModal = false"
                            class="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                          >
                            {{ t('operation_followup.delete_modal.cancel', 'İptal') }}
                          </button>
                          <button 
                            @click="handleDelete"
                            class="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
                          >
                            {{ t('operation_followup.delete_modal.confirm', 'Sil') }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition>
              </Teleport>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, computed, nextTick, reactive } from 'vue'
import { 
  XMarkIcon, 
  CalendarIcon, 
  ClockIcon, 
  ChevronRightIcon,
  ChevronDownIcon,
  PlusIcon,
  ArrowLeftIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'
import { useApi } from '@/composables/useApi'
import { useToast } from '@/composables/useToast'
import { useLanguage } from '~/composables/useLanguage'
import flatpickr from 'flatpickr'
import { Turkish } from 'flatpickr/dist/l10n/tr.js'
import 'flatpickr/dist/flatpickr.min.css'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/tr'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('tr')

const { t } = useLanguage()

const props = defineProps({
  show: Boolean,
  customer: Object
})
const emit = defineEmits(['close', 'saved'])

const api = useApi()
const toast = useToast()

// State
const view = ref('list')
const schedules = ref([])
const loading = ref(false)
const selectedItem = ref(null)
const isSaving = ref(false)
const showDeleteModal = ref(false)
const savingNote = ref(null)

// Accordion State
const expandedSections = reactive({
  days: true,
  months: false
})
const expandedItems = reactive({})
const editingNotes = reactive({})

// Form
const datepickerInput = ref(null)
const selectedDate = ref(null)
const selectedDateDisplay = ref('')
const selectedOperationType = ref('')
const operationTypes = ref([])

// Lists
const dayList = ref([])
const monthList = ref([])

// Flatpickr instance
let fpInstance = null

// Offsets
const dayOffsets = [1, 5, 7, 10]
const monthOffsets = [1, 2, 4, 6, 8, 10, 12]

// Computed
const customerFullName = computed(() => {
  if (!props.customer) return '-'
  return `${props.customer.name || ''} ${props.customer.surname || ''}`.trim() || '-'
})

const consultantName = computed(() => {
  if (!selectedItem.value?.customer?.relevantUserData) {
    if (!props.customer?.relevantUserData) return '-'
    const u = props.customer.relevantUserData
    return `${u.name || ''} ${u.surname || ''}`.trim() || '-'
  }
  const u = selectedItem.value.customer.relevantUserData
  return `${u.name || ''} ${u.surname || ''}`.trim() || '-'
})

const customerStatus = computed(() => {
  const customer = selectedItem.value?.customer || props.customer
  if (!customer) return { name: '-', color: null }
  
  if (customer.subSegment) {
    return {
      name: customer.subSegment.name,
      color: customer.subSegment.color,
      parentName: customer.subSegment.parentStatus?.name,
      parentColor: customer.subSegment.parentStatus?.color
    }
  }

  if (selectedItem.value?.customer?.statusData?.name) {
    return { name: selectedItem.value.customer.statusData.name }
  }
  return { name: props.customer?.statusData?.name || '-' }
})

const previewDays = computed(() => {
  if (!selectedDate.value) return []
  return dayOffsets.map(offset => {
    const date = dayjs(selectedDate.value).add(offset, 'day')
    return { offset, date: date.toDate(), kind: 'day' }
  })
})

const previewMonths = computed(() => {
  if (!selectedDate.value) return []
  return monthOffsets.map(offset => {
    const date = dayjs(selectedDate.value).add(offset, 'month')
    return { offset, date: date.toDate(), kind: 'month' }
  })
})

// Progress Computed
const daysDoneCount = computed(() => dayList.value.filter(d => d.done).length)
const monthsDoneCount = computed(() => monthList.value.filter(m => m.done).length)
const pendingCount = computed(() => {
  const allItems = [...dayList.value, ...monthList.value]
  return allItems.filter(i => !i.done).length
})
const completionPercentage = computed(() => {
  const total = dayList.value.length + monthList.value.length
  if (total === 0) return 0
  const done = daysDoneCount.value + monthsDoneCount.value
  return Math.round((done / total) * 100)
})

// Methods
function close() {
  emit('close')
}

function backToList() {
  view.value = 'list'
  selectedItem.value = null
  resetForm()
}

function resetForm() {
  selectedDate.value = null
  selectedDateDisplay.value = ''
  selectedOperationType.value = ''
  dayList.value = []
  monthList.value = []
  Object.keys(expandedItems).forEach(key => delete expandedItems[key])
  Object.keys(editingNotes).forEach(key => delete editingNotes[key])
  if (fpInstance) {
    fpInstance.clear()
  }
}

function startNew() {
  resetForm()
  view.value = 'create'
  nextTick(() => {
    initFlatpickr()
  })
}

function openFollowup(item) {
  selectedItem.value = item
  
  const followups = item.followups || { days: [], months: [] }
  
  dayList.value = (followups.days || []).map(d => ({
    ...d,
    kind: 'day'
  }))
  
  monthList.value = (followups.months || []).map(m => ({
    ...m,
    kind: 'month'
  }))
  
  // Initialize editing notes
  dayList.value.forEach(d => {
    editingNotes[`day-${d.offset}`] = d.note || ''
  })
  monthList.value.forEach(m => {
    editingNotes[`month-${m.offset}`] = m.note || ''
  })
  
  view.value = 'detail'
}

function toggleSection(section) {
  expandedSections[section] = !expandedSections[section]
}

function toggleItem(key) {
  expandedItems[key] = !expandedItems[key]
}

function confirmDelete() {
  showDeleteModal.value = true
}

function initFlatpickr() {
  if (!datepickerInput.value) return
  
  if (fpInstance) {
    fpInstance.destroy()
  }
  
  fpInstance = flatpickr(datepickerInput.value, {
    locale: Turkish,
    dateFormat: 'd.m.Y',
    allowInput: false,
    disableMobile: true,
    onChange: (selectedDates) => {
      if (selectedDates.length > 0) {
        selectedDate.value = selectedDates[0]
        selectedDateDisplay.value = dayjs(selectedDates[0]).format('DD.MM.YYYY')
      }
    }
  })
}

// API Calls
async function fetchSchedules() {
  if (!props.customer?.id) return
  loading.value = true
  try {
    const res = await api(`/operations/followups/${props.customer.id}`)
    schedules.value = res.data || []
  } catch {
    schedules.value = []
  } finally {
    loading.value = false
  }
}

async function fetchOperationTypes() {
  try {
    operationTypes.value = await api('/operations/types')
  } catch {
    operationTypes.value = []
  }
}

async function onSave() {
  if (!selectedDate.value || !selectedOperationType.value) return
  
  const scheduled_at = dayjs(selectedDate.value).tz('Europe/Istanbul').format('YYYY-MM-DD[T]00:00:00+03:00')
  
  const payload = {
    customer_id: props.customer.id,
    operation_type_id: selectedOperationType.value,
    scheduled_at
  }
  
  isSaving.value = true
  try {
    const res = await api('/operations/schedule', { method: 'POST', body: payload })
    emit('saved', res)
    toast.showSuccess(t('operation_followup.toast.saved', 'Operasyon kaydı oluşturuldu'))
    await fetchSchedules()
    backToList()
  } catch (e) {
    console.error(e)
    toast.showError(t('operation_followup.toast.save_error', 'Kaydetme başarısız'))
  } finally {
    isSaving.value = false
  }
}

async function handleDelete() {
  if (!selectedItem.value) return
  try {
    await api(`/operations/schedule/${selectedItem.value.id}`, { method: 'DELETE' })
    toast.showSuccess(t('operation_followup.toast.deleted', 'Operasyon takibi silindi'))
    await fetchSchedules()
    backToList()
  } catch {
    toast.showError(t('operation_followup.toast.delete_error', 'Silme işlemi başarısız'))
  } finally {
    showDeleteModal.value = false
  }
}

async function toggleDone(item) {
  if (!selectedItem.value?.id) return
  
  const newDone = !item.done
  const key = `${item.kind}-${item.offset}`
  const currentNote = editingNotes[key] || ''
  
  try {
    await api(`/operations/followups/${selectedItem.value.id}/followup`, {
      method: 'PATCH',
      body: {
        kind: item.kind,
        offset: item.offset,
        done: newDone,
        note: currentNote // Not varsa birlikte gönder
      }
    })
    
    item.done = newDone
    item.note = currentNote
    toast.showSuccess(t('operation_followup.toast.status_updated', 'Durum güncellendi'))
  } catch {
    toast.showError(t('operation_followup.toast.status_error', 'Durum güncellenemedi'))
  }
}

async function saveNote(item) {
  if (!selectedItem.value?.id) return
  
  const key = `${item.kind}-${item.offset}`
  const newNote = editingNotes[key] || ''
  
  // Eğer not değişmediyse kaydetme
  if (newNote === (item.note || '')) {
    toast.showSuccess('Not zaten güncel')
    return
  }
  
  savingNote.value = key
  
  try {
    await api(`/operations/followups/${selectedItem.value.id}/followup`, {
      method: 'PATCH',
      body: {
        kind: item.kind,
        offset: item.offset,
        note: newNote
      }
    })
    
    item.note = newNote
    toast.showSuccess('Not kaydedildi')
  } catch {
    toast.showError(t('operation_followup.toast.note_error', 'Not kaydedilemedi'))
  } finally {
    savingNote.value = null
  }
}

// Formatters
function formatDate(d) {
  if (!d) return '-'
  return dayjs(d).tz('Europe/Istanbul').format('DD MMMM YYYY')
}

function formatTableDate(d) {
  if (!d) return '-'
  return dayjs(d).tz('Europe/Istanbul').format('DD.MM.YYYY')
}

function formatPreviewDate(d) {
  if (!d) return '-'
  return dayjs(d).format('DD.MM.YYYY')
}

function getProgress(item) {
  if (!item.followups) return '0/0'
  const days = item.followups.days || []
  const months = item.followups.months || []
  const all = [...days, ...months]
  const done = all.filter(f => f.done).length
  return `${done}/${all.length} tamamlandı`
}

function getSegmentClass(status) {
  const statusLower = (status.name || '')?.toLowerCase()
  if (statusLower.includes('vip') || statusLower.includes('premium')) {
    return 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'
  }
  if (statusLower.includes('gold') || statusLower.includes('altın')) {
    return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'
  }
  if (statusLower.includes('silver') || statusLower.includes('gümüş')) {
    return 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
  }
  return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
}

// Watchers
watch(
  () => props.show,
  (v) => {
    if (v && props.customer?.id) {
      view.value = 'list'
      fetchSchedules()
      fetchOperationTypes()
    } else {
      resetForm()
    }
  }
)

watch(
  () => view.value,
  (v) => {
    if (v === 'create') {
      nextTick(() => {
        initFlatpickr()
      })
    }
  }
)

onMounted(() => {
  fetchOperationTypes()
})
</script>

<style>
/* Flatpickr Dark Mode */
.dark .flatpickr-calendar {
  background: #1f2937;
  border-color: #374151;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.dark .flatpickr-months .flatpickr-month {
  background: #1f2937;
  color: #f3f4f6;
}

.dark .flatpickr-current-month .flatpickr-monthDropdown-months {
  background: #1f2937;
  color: #f3f4f6;
}

.dark .flatpickr-current-month input.cur-year {
  color: #f3f4f6;
}

.dark .flatpickr-weekdays {
  background: #1f2937;
}

.dark .flatpickr-weekday {
  color: #9ca3af;
}

.dark .flatpickr-days {
  border-color: #374151;
}

.dark .flatpickr-day {
  color: #f3f4f6;
}

.dark .flatpickr-day:hover {
  background: #374151;
  border-color: #374151;
}

.dark .flatpickr-day.selected {
  background: #4f46e5;
  border-color: #4f46e5;
}

.dark .flatpickr-day.today {
  border-color: #4f46e5;
}

.dark .flatpickr-months .flatpickr-prev-month,
.dark .flatpickr-months .flatpickr-next-month {
  fill: #9ca3af;
}

.dark .flatpickr-months .flatpickr-prev-month:hover,
.dark .flatpickr-months .flatpickr-next-month:hover {
  fill: #f3f4f6;
}
</style>