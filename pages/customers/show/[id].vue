<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">

      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 mb-6 text-sm">
        <NuxtLink to="/customers"
          class="flex items-center gap-1.5 text-gray-500 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400 transition-colors">
          <UsersIcon class="h-4 w-4" />
          {{ t('customers.title', 'Müşteriler') }}
        </NuxtLink>
        <ChevronRightIcon class="h-4 w-4 text-gray-400" />
        <span class="text-gray-900 dark:text-white font-medium">{{ customer?.name || t('customer_show.customer',
          'Müşteri') }}</span>
      </nav>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24">
        <div class="relative">
          <div class="w-16 h-16 rounded-full border-4 border-rose-100 dark:border-rose-900/50"></div>
          <div
            class="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-t-rose-600 animate-spin">
          </div>
        </div>
        <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">
          {{ t('customer_show.loading', 'Müşteri bilgileri yükleniyor...') }}
        </p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="max-w-md mx-auto">
        <div class="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 text-center">
          <div
            class="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon class="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <p class="text-red-700 dark:text-red-300">{{ error }}</p>
          <button @click="refreshData" class="mt-4 text-sm text-red-600 dark:text-red-400 hover:underline">
            {{ t('customer_show.try_again', 'Tekrar Dene') }}
          </button>
        </div>
      </div>

      <!-- Customer Profile -->
      <div v-else-if="customer" class="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <!-- Left Sidebar - Profile Card -->
        <div class="lg:col-span-4 xl:col-span-3">
          <div
            class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden border border-gray-100 dark:border-gray-700">

            <!-- Cover & Avatar -->
            <div class="relative">
              
              <div class="h-28 bg-gradient-to-br from-rose-500 via-rose-500 to-pink-500"></div>

              <div class="absolute -bottom-12 left-1/2 -translate-x-1/2">
                <div class="relative">
                  <div
                    class="h-24 w-24 rounded-2xl ring-4 ring-white dark:ring-gray-800 shadow-xl overflow-hidden bg-white dark:bg-gray-700">
                    <img v-if="customer.image" :src="getImageUrl(customer.image)" :alt="customer.name"
                      class="h-full w-full object-cover" />
                    <div v-else
                      class="h-full w-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center">
                      <span class="text-2xl font-bold text-white">
                        {{ customer.name?.charAt(0)?.toUpperCase() }}{{ customer.surname?.charAt(0)?.toUpperCase() }}
                      </span>
                    </div>
                  </div>
                  <!-- Online indicator -->
                  <div
                    class="absolute -bottom-1 -right-1 h-6 w-6 bg-emerald-500 rounded-lg ring-2 ring-white dark:ring-gray-800 flex items-center justify-center">
                    <CheckIcon class="h-3.5 w-3.5 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Profile Info -->
            <div class="pt-14 pb-6 px-6">
              <!-- Name -->
              <div class="text-center mb-4">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                  {{ customer.name }} {{ customer.surname }}
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center gap-1">
                  <HashtagIcon class="h-3.5 w-3.5" />
                  ID: {{ customer.id }}
                </p>
              </div>

              <!-- Status Badges -->
              <div class="flex flex-wrap items-center justify-center gap-2 mb-6">
                <span :class="[
                  'inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full',
                  customer.isActive
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                ]">
                  <span class="w-1.5 h-1.5 rounded-full"
                    :class="customer.isActive ? 'bg-emerald-500' : 'bg-red-500'"></span>
                  {{ customer.isActive ? t('customer_show.status.active', 'Aktif') : t('customer_show.status.inactive',
                  'Pasif') }}
                </span>
                <span v-if="customerStatus"
                  class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                  {{ customerStatus.name }}
                </span>
              </div>

              <!-- Reminder Badge -->
              <div v-if="customer.remindingDate" class="mb-6">
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 text-center">
                  <div class="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <BellAlertIcon class="h-4 w-4" />
                    <span>{{ t('customer_show.reminder', 'Hatırlatma') }}</span>
                  </div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ formatDate(customer.remindingDate) }}
                  </p>
                  <span class="inline-block mt-2 text-xs font-medium px-3 py-1 rounded-full"
                    :class="getRemainingTimeClass(customer.remindingDate)">
                    {{ getRemainingTime(customer.remindingDate) }}
                  </span>
                </div>
              </div>

              <!-- Quick Stats -->
              <div class="grid grid-cols-2 gap-3 mb-6">
                <div
                  class="bg-gradient-to-br from-blue-50 to-rose-50 dark:from-blue-900/20 dark:to-rose-900/20 rounded-xl p-3 text-center">
                  <ClockIcon class="h-5 w-5 text-rose-600 dark:text-rose-400 mx-auto mb-1" />
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('customer_show.quick_stats.created', 'Kayıt')
                    }}</p>
                  <p class="text-xs font-medium text-gray-900 dark:text-white">{{ formatShortDate(customer.createdAt) }}
                  </p>
                </div>
                <div
                  class="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl p-3 text-center">
                  <ArrowPathIcon class="h-5 w-5 text-rose-600 dark:text-rose-400 mx-auto mb-1" />
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('customer_show.quick_stats.updated',
                    'Güncelleme') }}</p>
                  <p class="text-xs font-medium text-gray-900 dark:text-white">{{ formatShortDate(customer.updatesAt) }}
                  </p>
                </div>
              </div>

              <!-- Contact Info -->
              <div class="space-y-3">
                <h3 class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  {{ t('customer_show.contact.title', 'İletişim') }}
                </h3>

                <!-- Assigned User -->
                <div v-if="customer.relevantUserData"
                  class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div
                    class="h-9 w-9 rounded-lg bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center text-white text-sm font-medium shadow">
                    {{ customer.relevantUserData.name?.charAt(0) }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {{ customer.relevantUserData.name }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('customer_show.contact.health_advisor',
                      'Sağlık Danışmanı') }}</p>
                  </div>
                </div>

                <div class="flex-1 flex items-center gap-2">
                  <template v-if="!phoneRevealed && isUser">
                    <button @click="revealPhone"
                      class="text-sm text-rose-600 dark:text-rose-400 hover:underline font-medium">
                      {{ t('customer_show.contact.show_phone', 'Telefonu Göster') }}
                    </button>
                  </template>
                  <template v-else>
                    <div class="flex justify-center w-full items-center gap-3">
                      <!-- Telefon linki -->
                      <a :href="`tel:${customer.phone}`"
                        class="text-sm font-medium text-gray-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                        {{ customer.phone }}
                      </a>

                      <!-- Kopyala butonu -->
                      <button @click="copyPhone"
                        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        :title="t('customer_show.contact.copy_number', 'Numarayı kopyala')">
                        <ClipboardDocumentIcon v-if="!phoneCopied" class="h-6 w-6" />
                        <ClipboardDocumentCheckIcon v-else class="h-6 w-6 text-green-600" />
                      </button>

                      <!-- WhatsApp butonu - Sadece telefon varsa göster -->
                      <a v-if="customer.phone" :href="`https://wa.me/${formatPhoneForWhatsApp(customer.phone)}`"
                        target="_blank" class="text-green-600 hover:text-green-700"
                        :title="t('customer_show.contact.open_whatsapp', 'WhatsApp\'ta aç')">
                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path
                            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </a>
                    </div>
                  </template>
                </div>

                <!-- Engagement Timer -->
                <div v-if="customer.phone && activeEngagement && isEngagementOwner"
                  class="flex items-center gap-3 p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-200 dark:border-rose-800">
                  <div class="h-9 w-9 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                    <ClockIcon class="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-bold text-rose-600 dark:text-rose-400">
                      {{ formattedEngagementTime }}
                    </p>
                    <p class="text-xs text-rose-500 dark:text-rose-300">
                      {{ activeEngagement.role === 'SALES' ? t('customer_show.engagement.sales', 'Satış Görüşmesi') :
                        t('customer_show.engagement.doctor', 'Doktor Görüşmesi') }}
                    </p>
                  </div>
                </div>

                <!-- Email -->
                <div v-if="customer.email"
                  class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div class="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <EnvelopeIcon class="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <a :href="`mailto:${customer.email}`"
                    class="text-sm font-medium text-gray-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition-colors truncate">
                    {{ customer.email }}
                  </a>
                </div>
 

                <!-- Gender -->
                <div v-if="customer.gender"
                  class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div class="h-9 w-9 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                    <UserIcon class="h-4 w-4 text-pink-600 dark:text-pink-400" />
                  </div>
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ getGenderText(customer.gender) }}</span>
                </div>

                <!-- Birth Date -->
                <div v-if="customer.birth_date"
                  class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div class="h-9 w-9 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <CalendarIcon class="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ formatBirthDate(customer.birth_date)
                  }}</span>
                </div>

                <!-- Location -->
                <div v-if="locationText" class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div class="h-9 w-9 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                    <MapPinIcon class="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  </div>
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ locationText }}</span>
                </div>

                <!-- URL -->
                <div v-if="customer.url" class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div class="h-9 w-9 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                    <GlobeAltIcon class="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <span class="text-sm text-gray-700 dark:text-gray-300 truncate">{{ customer.url }}</span>
                </div>

                <!-- Checkup Package -->
                <div v-if="customer.checkup_package"
                  class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div class="h-9 w-9 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                    <CursorArrowRippleIcon class="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ customer.checkup_package }}</span>
                </div>

                <!-- Message -->
                <div v-if="customer.message" class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div class="flex items-center gap-2 mb-2">
                    <ChatBubbleLeftIcon class="h-4 w-4 text-gray-400" />
                    <span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {{ t('customer_show.message', 'Mesaj') }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{{ customer.message }}</p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="mt-6 space-y-2">
                <h3 class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                  {{ t('customer_show.quick_actions', 'Hızlı İşlemler') }}
                </h3>

                <div class="grid grid-cols-2 gap-2">
                  <button @click="showNotes"
                    class="flex items-center justify-center gap-2 px-3 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all text-sm font-medium">
                    <DocumentTextIcon class="h-4 w-4" />
                    {{ t('pool.actions.notes', 'Notlar') }}
                  </button>
                  <button @click="showDoctorAssignment"
                    class="flex items-center justify-center gap-2 px-3 py-2.5 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-all text-sm font-medium">
                    <UserIcon class="h-4 w-4" />
                    {{ t('pool.actions.doctor', 'Doktor') }}
                  </button>
                  <button @click="showServices"
                    class="flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all text-sm font-medium">
                    <ShoppingBagIcon class="h-4 w-4" />
                    {{ t('pool.actions.services', 'Hizmetler') }}
                  </button>
                  <button @click="showFiles"
                    class="flex items-center justify-center gap-2 px-3 py-2.5 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 rounded-xl hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-all text-sm font-medium">
                    <FolderIcon class="h-4 w-4" />
                    {{ t('pool.actions.files', 'Dosyalar') }}
                  </button>
                </div>

                <button @click="showOperationFollowUpModal"
                  v-if="customer?.status === 3"
                  class="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-all text-sm font-medium">
                  <ViewfinderCircleIcon class="h-4 w-4" />
                  {{ t('customer_show.operation_follow_up', 'Operasyon Takip') }}
                </button>

                <NuxtLink v-if="!isDoctor" :to="`/customers/edit/${$route.params.id}`"
                  class="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-xl hover:from-rose-700 hover:to-rose-700 transition-all text-sm font-medium shadow-lg shadow-rose-500/25">
                  <PencilIcon class="h-4 w-4" />
                  {{ t('pool.actions.edit', 'Düzenle') }}
                </NuxtLink>

                <button @click="goBack"
                  class="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm font-medium">
                  <ArrowLeftIcon class="h-4 w-4" />
                  {{ t('customer_show.go_back', 'Geri Dön') }}
                </button>

                  <NuxtLink :to="`/customers/detail/${customer.id}`" 
                   class="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-xl hover:from-rose-700 hover:to-rose-700 transition-all text-sm font-medium shadow-lg shadow-rose-500/25">
                    <MagnifyingGlassIcon class="h-4 w-4" />
                   {{ t('customer.view_details', 'Detaylı Görünüm') }}
                </NuxtLink>


              </div>

              <!-- Source & Additional Info -->
              <div v-if="customer.source?.name || customer.description"
                class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <h3 class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                  {{ t('customer_show.additional_info', 'Ek Bilgiler') }}
                </h3>

                <div v-if="customer.source?.name" class="flex items-center justify-between text-sm mb-2">
                  <span class="text-gray-500 dark:text-gray-400">{{ t('pool.table.source', 'Kaynak') }}</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ customer.source.name }}</span>
                </div>

                <div v-if="customer.description" class="mt-3">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ t('customer_show.description', 'Açıklama')
                    }}</p>
                 
                  
                  <div class="max-h-[300px] overflow-y-auto custom-scrollbar">
                    <div class="prose prose-sm dark:prose-invert max-w-none">
                      <p class="text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{{ customer.description }}</p>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Content - History Timeline -->
        <div class="lg:col-span-8 xl:col-span-9">
          <div
            class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden border border-gray-100 dark:border-gray-700">

            <!-- Header -->
            <div class="relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-rose-600 to-rose-700"></div>
              <div
                class="absolute inset-0 bg-white/5 bg-[length:20px_20px] bg-[radial-gradient(circle,_rgba(255,255,255,0.1)_1px,_transparent_1px)]">
              </div>

              <div class="relative px-6 py-5">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div class="flex items-center gap-4">
                    <div class="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                      <ClockIcon class="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 class="text-lg font-bold text-white">{{ t('customer_show.history.title', 'Müşteri Geçmişi') }}
                      </h3>
                      <p class="text-sm text-blue-100">{{ t('customer_show.history.subtitle', 'Tüm aktiviteler ve değişiklikler') }}</p>
                    </div>
                  </div>
                  <button @click="refreshData"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur transition-all text-sm font-medium">
                    <ArrowPathIcon class="h-4 w-4" :class="{ 'animate-spin': loadingHistory }" />
                    {{ t('dashboard.refresh', 'Yenile') }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Content -->
            <div class="max-h-[calc(100vh-280px)] overflow-y-auto">

              <!-- Loading -->
              <div v-if="loadingHistory" class="flex flex-col items-center justify-center py-16">
                <div class="relative">
                  <div class="w-12 h-12 rounded-full border-4 border-rose-100 dark:border-rose-900/50"></div>
                  <div
                    class="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-t-rose-600 animate-spin">
                  </div>
                </div>
                <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">{{ t('customer_show.history.loading', 'Geçmiş yükleniyor...') }}</p>
              </div>

              <!-- Timeline -->
              <div v-else-if="history.length > 0" class="p-6">

                <!-- Action Bar: Add Action + Filter -->
                <div class="relative mb-6">
                  <div class="flex flex-col lg:flex-row lg:items-center gap-4">
                    
                    <!-- Add Action Button -->
                    <div class="flex items-center gap-4">
                      <div class="relative">
                        <button @click="toggleActionsDropdown"
                          class="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-red-500 flex items-center justify-center shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 transition-all">
                          <PlusIcon class="h-5 w-5 text-white" />
                        </button>

                        <!-- Dropdown -->
                        <Transition enter-active-class="transition ease-out duration-200"
                          enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0"
                          leave-active-class="transition ease-in duration-150"
                          leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
                          <div v-if="showActionsDropdown"
                            class="absolute left-0 top-12 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-20">
                            <div class="p-2">
                              <button @click="handleDropdownAction(showNotes)"
                                class="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <div
                                  class="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                  <DocumentTextIcon class="h-4 w-4 text-red-600 dark:text-red-400" />
                                </div>
                                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{
                                  t('pool.actions.notes',
                                  'Notlar') }}</span>
                              </button>
                              <button @click="handleDropdownAction(showDoctorAssignment)"
                                class="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <div
                                  class="h-8 w-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                                  <UserIcon class="h-4 w-4 text-rose-600 dark:text-rose-400" />
                                </div>
                                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{
                                  t('customer_show.dropdown.doctor_opinion', 'Doktor Görüşü') }}</span>
                              </button>
                              <button @click="handleDropdownAction(showServices)"
                                class="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <div
                                  class="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                  <ShoppingBagIcon class="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{
                                  t('pool.actions.services',
                                  'Hizmetler') }}</span>
                              </button>
                              <button @click="handleDropdownAction(showFiles)"
                                class="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <div
                                  class="h-8 w-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                                  <FolderIcon class="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                                </div>
                                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{
                                  t('pool.actions.files',
                                  'Dosyalar') }}</span>
                              </button>
                              <div v-if="!isDoctor" class="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                                <button
                                  @click="handleDropdownAction(() => router.push(`/customers/edit/${route.params.id}`))"
                                  class="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                  <div
                                    class="h-8 w-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                                    <PencilIcon class="h-4 w-4 text-rose-600 dark:text-rose-400" />
                                  </div>
                                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{
                                    t('pool.actions.edit',
                                    'Düzenle') }}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </Transition>
                      </div>
                      <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('customer_show.add_action', 'Yeni İşlem Ekle') }}</p>
                    </div>

                    <!-- Divider -->
                    <div class="hidden lg:block w-px h-8 bg-gray-200 dark:bg-gray-700"></div>

                    <!-- Filter Section -->
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        <!-- Filter Toggle Button -->
                        <button 
                          @click="showFilterPanel = !showFilterPanel"
                          class="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm font-medium"
                        >
                          <FunnelIcon class="h-4 w-4" />
                          <span>Filtrele</span>
                          <span v-if="activeFiltersCount > 0" class="flex items-center justify-center h-5 w-5 bg-rose-500 text-white text-xs font-bold rounded-full">
                            {{ activeFiltersCount }}
                          </span>
                          <ChevronDownIcon class="h-4 w-4 transition-transform" :class="{ 'rotate-180': showFilterPanel }" />
                        </button>

                        <!-- Active Filter Pills (Quick View) -->
                        <div v-if="activeFiltersCount > 0 && !showFilterPanel" class="flex flex-wrap items-center gap-2">
                          <template v-for="filter in activityFilters" :key="filter.id">
                            <span 
                              v-if="selectedFilters.includes(filter.id)"
                              class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg"
                              :class="filter.bgClass"
                            >
                              <component :is="filter.icon" class="h-3 w-3" />
                              {{ filter.label }}
                              <button @click="toggleFilter(filter.id)" class="ml-0.5 hover:opacity-70">
                                <XMarkIcon class="h-3 w-3" />
                              </button>
                            </span>
                          </template>
                          
                          <button 
                            @click="clearAllFilters"
                            class="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
                          >
                            Temizle
                          </button>
                        </div>
                      </div>

                      <!-- Expandable Filter Panel -->
                      <Transition 
                        enter-active-class="transition-all duration-200 ease-out"
                        enter-from-class="opacity-0 max-h-0"
                        enter-to-class="opacity-100 max-h-40"
                        leave-active-class="transition-all duration-150 ease-in"
                        leave-from-class="opacity-100 max-h-40"
                        leave-to-class="opacity-0 max-h-0"
                      >
                        <div v-if="showFilterPanel" class="mt-3 overflow-hidden">
                          <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                            <div class="flex flex-wrap gap-2">
                              <button
                                v-for="filter in activityFilters"
                                :key="filter.id"
                                @click="toggleFilter(filter.id)"
                                class="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all border-2"
                                :class="[
                                  selectedFilters.includes(filter.id)
                                    ? `${filter.activeBgClass} ${filter.activeTextClass} border-current shadow-sm`
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                ]"
                              >
                                <component :is="filter.icon" class="h-4 w-4" />
                                {{ filter.label }}
                                <span 
                                  class="text-xs px-1.5 py-0.5 rounded-md"
                                  :class="selectedFilters.includes(filter.id) ? 'bg-white/30' : 'bg-gray-100 dark:bg-gray-700'"
                                >
                                  {{ getFilterCount(filter.id) }}
                                </span>
                              </button>
                            </div>
                            
                            <!-- Filter Actions -->
                            <div class="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                              <p class="text-xs text-gray-500 dark:text-gray-400">
                                {{ filteredHistory.length }} / {{ history.length }} kayıt gösteriliyor
                              </p>
                              <div class="flex items-center gap-2">
                                <button 
                                  @click="selectAllFilters"
                                  class="text-xs text-rose-600 dark:text-rose-400 hover:underline font-medium"
                                >
                                  Tümünü Seç
                                </button>
                                <span class="text-gray-300 dark:text-gray-600">|</span>
                                <button 
                                  @click="clearAllFilters"
                                  class="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
                                >
                                  Temizle
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Transition>
                    </div>
                  </div>
                </div>

                <!-- History Items (Filtered) -->
                <div class="space-y-4">
                  <template v-if="filteredHistory.length > 0">
                    <div v-for="(item, index) in filteredHistory" :key="item.id" class="relative pl-14">
                      <!-- Timeline Line -->
                      <div v-if="index < filteredHistory.length - 1"
                        class="absolute left-5 top-12 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 to-transparent dark:from-gray-700">
                      </div>

                      <!-- Icon -->
                      <div class="absolute left-0 top-0">
                        <div :class="[
                          'h-10 w-10 rounded-xl flex items-center justify-center shadow-sm',
                          getActionColorClasses(item.action)
                        ]">
                          <component :is="getActionIcon(item.action)" class="h-4 w-4" />
                        </div>
                      </div>

                      <!-- Content Card -->
                      <div
                        class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div class="flex-1">
                            <p class="text-sm font-semibold text-gray-600 dark:text-gray-400">
                              {{ item.action || t('customer_show.history.action', 'İşlem') }}
                            </p>
                            <p v-if="item.description"
                              class="mt-1 text-md text-gray-900  dark:text-white leading-relaxed">
                              {{ item.description }}
                            </p>

                            <!-- Expandable Data -->
                            <Transition enter-active-class="transition-all duration-300 ease-out"
                              enter-from-class="opacity-0 max-h-0" enter-to-class="opacity-100 max-h-96"
                              leave-active-class="transition-all duration-200 ease-in"
                              leave-from-class="opacity-100 max-h-96" leave-to-class="opacity-0 max-h-0">
                              <div v-if="showStates[item.id]" class="mt-3 space-y-2 overflow-hidden">
                                <div v-if="item.requestData" class="bg-white dark:bg-gray-800 rounded-lg p-3">
                                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{{
                                    t('customer_show.history.request_data', 'İstek Verisi') }}</p>
                                  <pre
                                    class="text-xs text-gray-600 dark:text-gray-400 font-mono whitespace-pre-wrap break-words">
                            {{ item.requestData }}</pre>
                                </div>
                                <div v-if="item.responseData" class="bg-white dark:bg-gray-800 rounded-lg p-3">
                                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{{
                                    t('customer_show.history.response_data', 'Yanıt Verisi') }}</p>
                                  <pre
                                    class="text-xs text-gray-600 dark:text-gray-400 font-mono whitespace-pre-wrap break-words">
                            {{ item.responseData }}</pre>
                                </div>
                              </div>
                            </Transition>

                            <button v-if="item.requestData || item.responseData" @click="toggleShow(item.id)"
                              class="mt-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline">
                              {{ showStates[item.id] ? t('customer_show.history.hide', 'Gizle') :
                                t('customer_show.history.show_details', 'Detayları Göster') }}
                            </button>
                          </div>

                          <div class="flex flex-col items-end gap-1 text-right shrink-0">
                            <p class="text-xs font-medium text-gray-900 dark:text-white">
                              {{ formatHistoryDate(item.createdAt || item.updatesAt) }}
                            </p>
                            <div class="flex gap-2">
                              <p class="text-xs text-gray-500 dark:text-gray-400">
                                {{ formatHistoryPass(item.createdAt) }}
                              </p>
                              <p class="text-xs text-gray-500 dark:text-gray-400">
                                {{ formatTime(item.createdAt) }}
                              </p>
                            </div>
                            <p v-if="item.user || item.userInfo"
                              class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <UserIcon class="h-3 w-3" />
                              {{ item.user?.name || item.userInfo?.name || t('customer_show.history.system', 'Sistem') }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                  
                  <!-- No Results After Filter -->
                  <div v-else class="flex flex-col items-center justify-center py-12">
                    <div class="h-16 w-16 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-4">
                      <FunnelIcon class="h-8 w-8 text-rose-500" />
                    </div>
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Sonuç Bulunamadı
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm mb-4">
                      Seçili filtrelere uygun kayıt bulunmuyor.
                    </p>
                    <button 
                      @click="clearAllFilters"
                      class="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all text-sm font-medium"
                    >
                      <XMarkIcon class="h-4 w-4" />
                      Filtreleri Temizle
                    </button>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else class="flex flex-col items-center justify-center py-16">
                <div class="h-16 w-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                  <ClockIcon class="h-8 w-8 text-gray-400" />
                </div>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">{{
                  t('customer_show.history.empty.title',
                  'Geçmiş Bulunamadı') }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
                  {{ t('customer_show.history.empty.description', 'Bu müşteri için henüz geçmiş kaydı bulunmuyor.') }}
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div class="flex items-center justify-between">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  <template v-if="activeFiltersCount > 0">
                    <span class="font-semibold text-gray-900 dark:text-white">{{ filteredHistory.length }}</span> / {{ history.length }} kayıt
                  </template>
                  <template v-else>
                    {{ t('dashboard.total', 'Toplam') }} <span class="font-semibold text-gray-900 dark:text-white">{{
                      history.length }}</span> {{ t('customer_show.history.records', 'kayıt') }}
                  </template>
                </p>
                <div class="flex items-center gap-2 text-xs text-gray-400">
                  <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  {{ t('customer_show.history.live_updates', 'Canlı güncelleme aktif') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <CustomerOperationFollowupModal :show="showOperationFollowUp" :customer="customer" @close="showOperationFollowUp = false" />
    <CustomerNotesModal :show="showNotesModal" :customer="customer" @close="showNotesModal = false"
      @customer-updated="refreshData" />
    <DoctorAssignmentModal :show="showDoctorModal" :customer="customer" @close="showDoctorModal = false"
      @assigned="handleDoctorAssigned" />
    <CustomerServicesModal :show="showServicesModal" :customer="customer" @close="showServicesModal = false"
      @saved="handleServicesSaved" />
    <CustomerFilesModal :show="showFilesModal" :customer="customer" @close="showFilesModal = false" />
 
  </div>
</template>

<script setup>
import {
  ClockIcon,
  DocumentTextIcon,
  UserIcon,
  ShoppingBagIcon,
  FolderIcon,
  PencilIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  GlobeAltIcon,
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ViewfinderCircleIcon,
  CursorArrowRippleIcon,
  ChevronRightIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  HashtagIcon,
  CheckIcon,
  BellAlertIcon,
  ChatBubbleLeftIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  XMarkIcon,
  BellIcon,
  CurrencyDollarIcon,
  TagIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'
import CustomerOperationFollowupModal from '~/components/CustomerOperationFollowupModal.vue'
import { useLanguage } from '~/composables/useLanguage'

const { t, tp } = useLanguage()

const route = useRoute()
const router = useRouter()
const { userId, isDoctor, isUser } = usePermissions()
const { $dayjs } = useNuxtApp()


const customer = ref(null)
const loading = ref(true)
const error = ref('')
const customerDynamicFields = ref([])
const loadingDynamicFields = ref(false)
const statuses = ref([])
const locations = ref({ countries: [], states: [], cities: [] })
const history = ref([])
const loadingHistory = ref(false)
const showStates = ref({})
const phoneRevealed = ref(false)

// Engagement Timer
const activeEngagement = ref(null)
const engagementTimer = ref(0)
let timerInterval = null

// Modal states
const showNotesModal = ref(false)
const showDoctorModal = ref(false)
const showServicesModal = ref(false)
const showFilesModal = ref(false)
const showActionsDropdown = ref(false)
const showOperationFollowUp = ref(false)

// Filter State
const showFilterPanel = ref(false)
const selectedFilters = ref([])

// Activity Filters Definition
const activityFilters = [
  {
    id: 'status_change',
    label: 'Durum Değişikliği',
    icon: TagIcon,
    bgClass: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
    activeBgClass: 'bg-rose-100 dark:bg-rose-900/30',
    activeTextClass: 'text-rose-700 dark:text-rose-400',
    keywords: ['durum', 'status', 'segment', 'değişti', 'güncellendi']
  },
  {
    id: 'note',
    label: 'Notlar',
    icon: DocumentTextIcon,
    bgClass: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    activeBgClass: 'bg-red-100 dark:bg-red-900/30',
    activeTextClass: 'text-red-700 dark:text-red-400',
    keywords: ['not', 'note', 'yorum']
  },
  {
    id: 'reminder',
    label: 'Hatırlatma',
    icon: BellIcon,
    bgClass: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
    activeBgClass: 'bg-rose-100 dark:bg-rose-900/30',
    activeTextClass: 'text-rose-700 dark:text-rose-400',
    keywords: ['hatırlatma', 'reminding', 'aranacak', 'tekrar ara']
  },
  {
    id: 'doctor',
    label: 'Doktor Görüşü',
    icon: UserIcon,
    bgClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    activeBgClass: 'bg-blue-100 dark:bg-blue-900/30',
    activeTextClass: 'text-blue-700 dark:text-blue-400',
    keywords: ['doktor', 'doctor', 'hekim', 'muayene', 'görüş']
  },
  {
    id: 'sale',
    label: 'Satış',
    icon: CurrencyDollarIcon,
    bgClass: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    activeBgClass: 'bg-emerald-100 dark:bg-emerald-900/30',
    activeTextClass: 'text-emerald-700 dark:text-emerald-400',
    keywords: ['satış', 'sale', 'ödeme', 'fiyat', 'teklif', 'proforma']
  },
  {
    id: 'file',
    label: 'Dosyalar',
    icon: FolderIcon,
    bgClass: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400',
    activeBgClass: 'bg-cyan-100 dark:bg-cyan-900/30',
    activeTextClass: 'text-cyan-700 dark:text-cyan-400',
    keywords: ['dosya', 'file', 'belge', 'döküman', 'yükle']
  },
  {
    id: 'assignment',
    label: 'Atama',
    icon: UserGroupIcon,
    bgClass: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
    activeBgClass: 'bg-rose-100 dark:bg-rose-900/30',
    activeTextClass: 'text-rose-700 dark:text-rose-400',
    keywords: ['atandı', 'atama', 'assign', 'kullanıcı', 'danışman']
  },
  {
    id: 'create',
    label: 'Oluşturma',
    icon: PlusIcon,
    bgClass: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    activeBgClass: 'bg-green-100 dark:bg-green-900/30',
    activeTextClass: 'text-green-700 dark:text-green-400',
    keywords: ['oluşturuldu', 'created', 'kayıt', 'yeni']
  }
]

// Computed
const locationText = computed(() => {
  if (!customer.value) return ''
  const parts = []
  const country = locations.value.countries.find(c => c.id === customer.value.country)
  const state = locations.value.states.find(s => s.id === customer.value.state)
  const city = locations.value.cities.find(c => c.id === customer.value.city)
  if (customer.value.district) parts.push(customer.value.district)
  if (city) parts.push(city.name)
  if (state) parts.push(state.name)
  if (country) parts.push(country.name)
  return parts.join(', ')
})

const customerStatus = computed(() => {
  if (!customer.value || !customer.value.status) return null
  return statuses.value.find(s => s.id === customer.value.status) || null
})

const isEngagementOwner = computed(() => {
  if (!activeEngagement.value || !userId) return false
  return activeEngagement.value.userId === userId.value
})

const formattedEngagementTime = computed(() => {
  if (!engagementTimer.value) return '0 dk 0 sn'
  const totalSeconds = engagementTimer.value
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (days > 0) return `${days} gün ${hours} saat ${minutes} dk`
  if (hours > 0) return `${hours} saat ${minutes} dk ${seconds} sn`
  if (minutes > 0) return `${minutes} dk ${seconds} sn`
  return `${seconds} sn`
})

// Filter Computed
const activeFiltersCount = computed(() => selectedFilters.value.length)

const filteredHistory = computed(() => {
  // Eğer filtre seçili değilse tüm history'i göster
  if (selectedFilters.value.length === 0) {
    return history.value
  }

  return history.value.filter(item => {
    const searchText = `${item.action || ''} ${item.description || ''}`.toLowerCase()
    
    // Seçili filtrelerden herhangi birine uyuyor mu?
    return selectedFilters.value.some(filterId => {
      const filter = activityFilters.find(f => f.id === filterId)
      if (!filter) return false
      
      // Keywords içinde herhangi biri eşleşiyor mu?
      return filter.keywords.some(keyword => searchText.includes(keyword.toLowerCase()))
    })
  })
})

// Filter Methods
const toggleFilter = (filterId) => {
  const index = selectedFilters.value.indexOf(filterId)
  if (index === -1) {
    selectedFilters.value.push(filterId)
  } else {
    selectedFilters.value.splice(index, 1)
  }
}

const clearAllFilters = () => {
  selectedFilters.value = []
}

const selectAllFilters = () => {
  selectedFilters.value = activityFilters.map(f => f.id)
}

const getFilterCount = (filterId) => {
  const filter = activityFilters.find(f => f.id === filterId)
  if (!filter) return 0
  
  return history.value.filter(item => {
    const searchText = `${item.action || ''} ${item.description || ''}`.toLowerCase()
    return filter.keywords.some(keyword => searchText.includes(keyword.toLowerCase()))
  }).length
}

const formatHistoryPass = (stringData) => {
  return $dayjs(stringData).fromNow();
}

// ref tanımla
const phoneCopied = ref(false)

// method ekle
const copyPhone = async () => {
  try {
    await navigator.clipboard.writeText(customer.value.phone)
    phoneCopied.value = true
    setTimeout(() => {
      phoneCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Kopyalama başarısız:', err)
  }
}


// Methods
const toggleShow = (id) => showStates.value[id] = !showStates.value[id]

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPhoneForWhatsApp = (phone) => {
  if (!phone) return '' // ✅ Null/undefined kontrolü
  return phone.replace(/[\s\-\(\)\+]/g, '')
}


const formatShortDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const getRemainingTime = (remindingDate) => {
  if (!remindingDate) return ''

  const now = new Date()
  const target = new Date(remindingDate)
  const diff = target.getTime() - now.getTime()

  if (diff < 0) {
    // Geçmiş zamanlar
    const hours = Math.floor(Math.abs(diff) / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 0) {
      return tp('reminders.time.days_overdue', { days }, '{days} gün gecikmiş')
    }
    if (hours > 0) {
      return tp('reminders.time.hours_overdue', { hours }, '{hours} saat gecikmiş')
    }
    return t('reminders.time.just_passed', 'Az önce geçti')
  }

  // Gelecek zamanlar
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return tp('reminders.time.days_left', { days }, '{days} gün kaldı')
  }
  if (hours > 0) {
    return tp('reminders.time.hours_left', { hours }, '{hours} saat kaldı')
  }
  return t('reminders.time.now', 'Şimdi')
}

const getRemainingTimeClass = (remindingDate) => {
  if (!remindingDate) return ''
  const diff = new Date(remindingDate).getTime() - new Date().getTime()
  const hours = diff / (1000 * 60 * 60)
  if (diff < 0) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  if (hours <= 1) return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
  if (hours <= 24) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
  return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
}

const formatHistoryDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
}

const formatTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
}

const formatBirthDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
}

const getGenderText = (gender) => {
  const genders = {
    'male': t('customer_show.gender.male', 'Erkek'),
    'female': t('customer_show.gender.female', 'Kadın'),
    'other': t('customer_show.gender.other', 'Diğer')
  }
  return genders[gender] || gender
}

const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http')) return imagePath
  const config = useRuntimeConfig()
  return `${config.public.apiBase || 'http://localhost:3001'}/${imagePath}`
}

const getActionIcon = (action) => {
  const icons = {
    'created': PlusIcon,
    'updated': PencilIcon,
    'deleted': TrashIcon,
    'status_changed': ArrowPathIcon,
    'email_sent': EnvelopeIcon,
    'phone_called': PhoneIcon,
    'address_changed': MapPinIcon,
    'activated': CheckCircleIcon,
    'deactivated': XCircleIcon
  }
  return icons[action] || ClockIcon
}

const getActionColorClasses = (action) => {
  const colors = {
    'created': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    'updated': 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    'deleted': 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    'status_changed': 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
    'email_sent': 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    'phone_called': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400'
  }
  return colors[action] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
}

const goBack = () => router.back()
const toggleActionsDropdown = () => showActionsDropdown.value = !showActionsDropdown.value
const handleDropdownAction = (action) => {
  showActionsDropdown.value = false
  action()
}

const showNotes = () => showNotesModal.value = true
const showDoctorAssignment = () => showDoctorModal.value = true
const showServices = () => showServicesModal.value = true
const showFiles = () => showFilesModal.value = true


const showOperationFollowUpModal = () => {
  console.log('🔴 Operation Follow Up button clicked')
  console.log('🔴 Customer:', customer.value)
  console.log('🔴 Current showOperationFollowUp value:', showOperationFollowUp.value)
  showOperationFollowUp.value = true
  console.log('🔴 New showOperationFollowUp value:', showOperationFollowUp.value)
}


const handleDoctorAssigned = () => refreshData()
const handleServicesSaved = () => {
  showServicesModal.value = false
  refreshData()
}

const revealPhone = async () => {
  phoneRevealed.value = true
  try {
    const api = useApi()
    await api(`/customers/${route.params.id}/view-phone`, { method: 'POST' })
  } catch (error) {
    console.error('Error registering phone view:', error)
  }
}

// Timer
const startEngagementTimer = () => {
  if (!activeEngagement.value?.assignedAt) return
  const calculateElapsedTime = () => {
    const assignedTime = new Date(activeEngagement.value.assignedAt).getTime()
    engagementTimer.value = Math.floor((Date.now() - assignedTime) / 1000)
  }
  calculateElapsedTime()
  timerInterval = setInterval(calculateElapsedTime, 1000)
}

const stopEngagementTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

// Data fetching
const fetchLocations = async () => {
  try {
    const api = useApi()
    const [countriesRes, statesRes, citiesRes, statusesRes] = await Promise.all([
      api('/countries'),
      api('/states'),
      api('/cities'),
      api('/statuses').catch(() => [])
    ])
    locations.value = { countries: countriesRes, states: statesRes, cities: citiesRes }
    const rawStatuses = statusesRes.data || statusesRes || []
    statuses.value = rawStatuses.map(status => ({
      ...status,
      isDoctor: status.isDoctor ?? status.is_doctor ?? false,
      isPricing: status.isPricing ?? status.is_pricing ?? false,
      isRemindable: status.isRemindable ?? status.is_remindable ?? false,
      isFirst: status.isFirst ?? status.is_first ?? false,
      isClosed: status.isClosed ?? status.is_closed ?? false,
      isSale: status.isSale ?? status.is_sale ?? false
    }))
  } catch (err) {
    console.error('Error fetching locations:', err)
  }
}

const fetchCustomer = async () => {
  try {
    loading.value = true
    error.value = ''
    const api = useApi()
    const response = await api(`/customers/${route.params.id}`)
    if (response.status && statuses.value.length > 0) {
      const statusInfo = statuses.value.find(s => s.id === response.status)
      if (statusInfo) response.statusInfo = statusInfo
    }
    customer.value = response
    if (response.activeEngagement) {
      activeEngagement.value = response.activeEngagement
      startEngagementTimer()
    } else {
      stopEngagementTimer()
      activeEngagement.value = null
      engagementTimer.value = 0
    }
  } catch (err) {
    console.error('Error fetching customer:', err)
    if (err?.data?.statusCode === 404 || err?.status === 404) {
      error.value = t('customer_show.errors.not_found', 'Müşteri bulunamadı.')
    } else if (err?.data?.statusCode === 401 || err?.status === 401) {
      error.value = t('customer_show.errors.unauthorized', 'Oturum açmanız gerekiyor.')
    } else {
      error.value = t('customer_show.errors.general', 'Müşteri bilgileri yüklenirken bir hata oluştu.')
    }
  } finally {
    loading.value = false
  }
}

const fetchCustomerDynamicFields = async () => {
  try {
    loadingDynamicFields.value = true
    if (customer.value?.dynamicFieldValues) {
      customerDynamicFields.value = customer.value.dynamicFieldValues.map(field => ({
        id: field.id,
        name: field.name,
        type: field.type,
        value: field.options_data || field.file,
        file: field.file,
        order: field.order
      }))
    }
  } catch (err) {
    console.error('Error fetching customer dynamic fields:', err)
  } finally {
    loadingDynamicFields.value = false
  }
}

const fetchCustomerHistory = async () => {
  if (!customer.value?.id) return
  loadingHistory.value = true
  try {
    const customerHistoriesStore = useCustomerHistoriesStore()
    const histories = await customerHistoriesStore.fetchCustomerHistories(customer.value.id)
    history.value = histories.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.created_at || 0)
      const dateB = new Date(b.createdAt || b.created_at || 0)
      return dateB - dateA
    })
  } catch (error) {
    console.error('Error fetching customer history:', error)
    history.value = []
  } finally {
    loadingHistory.value = false
  }
}

const refreshData = async () => {
  await fetchCustomer()
  await fetchCustomerDynamicFields()
  await fetchCustomerHistory()
}

const handleClickOutside = (event) => {
  const dropdown = event.target.closest('.relative')
  if (!dropdown && showActionsDropdown.value) showActionsDropdown.value = false
}



onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  await fetchLocations()
  await fetchCustomer()
  await fetchCustomerDynamicFields()
  await fetchCustomerHistory()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  stopEngagementTimer()
})

useHead({
  title: computed(() => customer.value ? `${customer.value.name} - ${t('customer_show.page_title', 'Müşteri Detayı')}` : t('customer_show.page_title', 'Müşteri Detayı'))
})
</script>

<style scoped>
/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800 rounded-full;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-gray-400 dark:hover:bg-gray-500;
}
</style>