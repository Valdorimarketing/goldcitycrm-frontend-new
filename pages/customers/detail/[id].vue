<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <div class="max-w-[1800px] mx-auto py-6 px-4 sm:px-6 lg:px-8">

      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 mb-6 text-sm">
        <NuxtLink to="/customers"
          class="flex items-center gap-1.5 text-gray-500 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400 transition-colors">
          <UsersIcon class="h-4 w-4" />
          <span>{{ t('customers.title', 'Müşteriler') }}</span>
        </NuxtLink>
        <ChevronRightIcon class="h-4 w-4 text-gray-400" />
        <span class="text-gray-900 dark:text-white font-medium">{{ customer?.name || t('customer_detail.title', 'Müşteri Detayı') }}</span>
      </nav>

      <!-- Loading State -->
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
      >
        <div v-if="loading" class="space-y-6">
          <!-- Header Skeleton -->
          <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8">
            <div class="flex items-center gap-6">
              <div class="h-20 w-20 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
              <div class="flex-1 space-y-3">
                <div class="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                <div class="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          <!-- Stats Skeleton -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div v-for="i in 4" :key="i" class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div class="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-3"></div>
              <div class="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            </div>
          </div>

          <!-- Content Skeleton -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div v-for="i in 3" :key="i" class="space-y-4">
              <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 h-64">
                <div class="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-4"></div>
                <div class="space-y-3">
                  <div class="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                  <div class="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Error State -->
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
      >
        <div v-if="!loading && error" class="max-w-md mx-auto">
          <div class="bg-white dark:bg-gray-900 rounded-xl border border-red-200 dark:border-red-900/50 p-8 text-center">
            <div class="h-14 w-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExclamationTriangleIcon class="h-7 w-7 text-red-600 dark:text-red-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ t('customer_detail.error.title', 'Hata') }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
            <button @click="fetchCustomer" class="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
              {{ t('customer_detail.try_again', 'Tekrar Dene') }}
            </button>
          </div>
        </div>
      </Transition>

      <!-- Main Content -->
      <Transition
        enter-active-class="transition-all duration-500"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div v-if="!loading && !error && customer" class="space-y-6">

          <!-- Header Card -->
          <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div class="p-8">
              <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <!-- Profile Info -->
                <div class="flex items-center gap-6">
                  <!-- Avatar -->
                  <div class="relative group">
                    <div class="h-20 w-20 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 transition-all group-hover:ring-4 group-hover:ring-rose-500/20">
                      <img v-if="customer.image" :src="getImageUrl(customer.image)" :alt="customer.name" class="h-full w-full object-cover" />
                      <div v-else class="h-full w-full flex items-center justify-center">
                        <span class="text-2xl font-bold text-gray-600 dark:text-gray-400">
                          {{ customer.name?.charAt(0)?.toUpperCase() }}{{ customer.surname?.charAt(0)?.toUpperCase() }}
                        </span>
                      </div>
                    </div>
                    <div class="absolute -bottom-1 -right-1 h-6 w-6 bg-emerald-500 rounded-lg ring-2 ring-white dark:ring-gray-900 flex items-center justify-center">
                      <CheckIcon class="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>

                  <!-- Name & Status -->
                  <div>
                    <div class="flex items-center gap-3 mb-2">
                      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                        {{ customer.name }} {{ customer.surname }}
                      </h1>
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border"
                        :class="customer.isActive 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50' 
                          : 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'">
                        <span class="w-1.5 h-1.5 rounded-full" :class="customer.isActive ? 'bg-emerald-500' : 'bg-gray-400'"></span>
                        {{ customer.isActive ? t('customer_detail.active', 'Aktif') : t('customer_detail.inactive', 'Pasif') }}
                      </span>
                    </div>
                    <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span class="flex items-center gap-1.5">
                        <HashtagIcon class="h-4 w-4" />
                        {{ customer.id }}
                      </span>
                      <span v-if="customerStatus" class="flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                        {{ customerStatus.name }}
                      </span>
                      <span v-if="customer.relevantUserData" class="flex items-center gap-1.5">
                        <UserIcon class="h-4 w-4" />
                        {{ customer.relevantUserData.name }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex flex-wrap gap-2">
                    
                  <NuxtLink :to="`/customers/show/${$route.params.id}`" 
                    class="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors">
                    <EyeIcon class="h-4 w-4" />
                    <span class="hidden sm:inline">{{ t('pool.actions.view', 'Görüntüle') }}</span>
                  </NuxtLink>
                  <button @click="initData()" 
                    class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <ArrowPathIcon class="h-4 w-4" />
                    <span class="hidden sm:inline">{{ t('dashboard.refresh', 'Yenile') }}</span>
                  </button>
                  <button @click="showNotesModal = true" 
                    class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <DocumentTextIcon class="h-4 w-4" />
                    <span class="hidden sm:inline">{{ t('customer_detail.notes', 'Notlar') }}</span>
                  </button>
                  <button @click="showFilesModal = true" 
                    class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <FolderIcon class="h-4 w-4" />
                    <span class="hidden sm:inline">{{ t('customer_detail.files', 'Dosyalar') }}</span>
                  </button>
                  <NuxtLink v-if="!isDoctor" :to="`/customers/edit/${$route.params.id}`" 
                    class="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors">
                    <PencilIcon class="h-4 w-4" />
                    <span class="hidden sm:inline">{{ t('customer_detail.edit', 'Düzenle') }}</span>
                  </NuxtLink>
                  <button @click="$router.back()" 
                    class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <ArrowLeftIcon class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Created -->
            <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:border-rose-300 dark:hover:border-rose-800 transition-all duration-300 group">
              <div class="flex items-center justify-between mb-4">
                <div class="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-rose-100 dark:group-hover:bg-rose-900/30 transition-colors">
                  <CalendarIcon class="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-rose-600 dark:group-hover:text-rose-400" />
                </div>
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ t('customer_detail.created', 'Kayıt') }}</span>
              </div>
              <div class="space-y-1">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatStatDate(customer.createdAt) }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatRelativeTime(customer.createdAt) }}</p>
              </div>
            </div>

            <!-- Updated -->
            <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:border-rose-300 dark:hover:border-rose-800 transition-all duration-300 group">
              <div class="flex items-center justify-between mb-4">
                <div class="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-rose-100 dark:group-hover:bg-rose-900/30 transition-colors">
                  <ArrowPathIcon class="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-rose-600 dark:group-hover:text-rose-400" />
                </div>
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ t('customer_detail.updated', 'Güncelleme') }}</span>
              </div>
              <div class="space-y-1">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatStatDate(customer.updatesAt) }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatRelativeTime(customer.updatesAt) }}</p>
              </div>
            </div>

            <!-- Reminder -->
            <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:border-rose-300 dark:hover:border-rose-800 transition-all duration-300 group">
              <div class="flex items-center justify-between mb-4">
                <div class="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-rose-100 dark:group-hover:bg-rose-900/30 transition-colors">
                  <BellAlertIcon class="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-rose-600 dark:group-hover:text-rose-400" />
                </div>
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ t('customer_detail.reminder', 'Hatırlatma') }}</span>
              </div>
              <div v-if="customer.remindingDate" class="space-y-2">
                <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatStatDate(customer.remindingDate) }}</p>
                <span class="inline-block text-xs font-medium px-2.5 py-1 rounded-md" :class="getRemainingTimeClass(customer.remindingDate)">
                  {{ getRemainingTime(customer.remindingDate) }}
                </span>
              </div>
              <div v-else class="text-sm text-gray-500 dark:text-gray-400">
                {{ t('customer_detail.no_reminder', 'Yok') }}
              </div>
            </div>
 
            
          </div>

          <!-- Main Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                

              <!-- Location -->
              <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">{{ t('customer_detail.location', 'Konum') }}</h3>
                </div>
                <div class="p-6 space-y-4">
                  <InfoRow v-if="locationText" :icon="MapPinIcon" :label="t('customer_detail.location', 'Konum')" :value="locationText" />
                  <InfoRow v-if="customer.address" :icon="HomeIcon" :label="t('customer_detail.address', 'Adres')" :value="customer.address" />
                  <InfoRow v-if="customer.postalCode" :icon="HashtagIcon" :label="t('customer_detail.postal_code', 'Posta Kodu')" :value="customer.postalCode" mono />
                  
                  <div v-if="!locationText && !customer.address && !customer.postalCode" class="text-center py-8">
                    <div class="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                      <MapPinIcon class="h-6 w-6 text-gray-400" />
                    </div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('customer_detail.no_location', 'Konum bilgisi yok') }}</p>
                  </div>
                </div>
              </div>
              

              <!-- Contact Information -->
              <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">{{ t('customer_detail.contact_info', 'İletişim Bilgileri') }}</h3>
                </div>
                <div class="p-6">
                  <div class="space-y-4">
                    <!-- Phone -->
                    <div v-if="customer.phone" class="flex items-start gap-3 group">
                      <div class="h-9 w-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/30 transition-colors">
                        <PhoneIcon class="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-rose-600 dark:group-hover:text-rose-400" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{{ t('customer_detail.phone', 'Telefon') }}</p>
                        <div class="flex items-center gap-2 flex-wrap">
                          <a :href="`tel:${customer.phone}`" class="text-sm font-medium text-gray-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                            {{ customer.phone }}
                          </a>
                          <div class="flex items-center gap-1">
                            <button @click="copyPhone" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors" :title="t('customer_detail.copy', 'Kopyala')">
                              <ClipboardDocumentIcon v-if="!phoneCopied" class="h-3.5 w-3.5 text-gray-400" />
                              <ClipboardDocumentCheckIcon v-else class="h-3.5 w-3.5 text-emerald-600" />
                            </button>
                            <a :href="`https://wa.me/${formatPhoneForWhatsApp(customer.phone)}`" target="_blank" class="p-1 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded transition-colors">
                              <svg class="h-3.5 w-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Email -->
                    <InfoRow v-if="customer.email" :icon="EnvelopeIcon" :label="t('customer_detail.email', 'E-posta')">
                      <template #value>
                        <a :href="`mailto:${customer.email}`" class="text-sm font-medium text-gray-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition-colors break-all">
                          {{ customer.email }}
                        </a>
                      </template>
                    </InfoRow>

                    <!-- URL -->
                    <InfoRow v-if="customer.url" :icon="GlobeAltIcon" :label="t('customer_detail.website', 'Web Sitesi')">
                      <template #value>
                        <a :href="customer.url" target="_blank" class="text-sm font-medium text-gray-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition-colors break-all">
                          {{ truncateUrl(customer.url, 40) }}
                        </a>
                      </template>
                    </InfoRow>

                    <div v-if="!customer.phone && !customer.email && !customer.url" class="text-center py-8">
                      <div class="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                        <PhoneIcon class="h-6 w-6 text-gray-400" />
                      </div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('customer_detail.no_contact', 'İletişim bilgisi yok') }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Personal Information -->
              <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">{{ t('customer_detail.personal_info', 'Kişisel Bilgiler') }}</h3>
                </div>
                <div class="p-6">
                  <Transition
                    enter-active-class="transition-all duration-300"
                    enter-from-class="opacity-0 translate-x-2"
                    enter-to-class="opacity-100 translate-x-0"
                  >
                    <div v-if="!loadingPersonal" class="space-y-4">
                      <InfoRow v-if="customer.gender" :icon="UserIcon" :label="t('customer_detail.gender', 'Cinsiyet')" :value="getGenderText(customer.gender)" />
                      <InfoRow v-if="customer.birthDate" :icon="CakeIcon" :label="t('customer_detail.birth_date', 'Doğum Tarihi')">
                        <template #value>
                          <div>
                            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatBirthDate(customer.birthDate) }}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ calculateAge(customer.birthDate) }} {{ t('customer_detail.years_old', 'yaşında') }}</p>
                          </div>
                        </template>
                      </InfoRow>
                      <InfoRow v-if="customer.identityNumber" :icon="IdentificationIcon" :label="t('customer_detail.identity', 'Kimlik No')" :value="customer.identityNumber" mono />
                      <InfoRow v-if="customer.job" :icon="BriefcaseIcon" :label="t('customer_detail.job', 'Meslek')" :value="customer.job" />
                      <InfoRow v-if="customer.language" :icon="LanguageIcon" :label="t('customer_detail.language', 'Dil')" :value="customer.language" />
                      
                      <div v-if="!customer.gender && !customer.birthDate && !customer.identityNumber && !customer.job && !customer.language" class="text-center py-8">
                        <div class="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                          <UserCircleIcon class="h-6 w-6 text-gray-400" />
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('customer_detail.no_data', 'Veri yok') }}</p>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>

              <!-- Additional Info -->
              <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">{{ t('customer_detail.additional', 'Ek Bilgiler') }}</h3>
                </div>
                <div class="p-6 space-y-4">
                  <InfoRow v-if="customer.source" :icon="ArrowTopRightOnSquareIcon" :label="t('customer_detail.source', 'Kaynak')" :value="customer.source.name" />
                  <InfoRow v-if="customer.relatedTransaction" :icon="LinkIcon" :label="t('customer_detail.related_transaction', 'İlgili İşlem')" :value="customer.relatedTransaction" />
                  <InfoRow v-if="customer.referanceCustomerData" :icon="UsersIcon" :label="t('customer_detail.reference', 'Referans')" :value="customer.referanceCustomerData.name" />
                  
                  <div v-if="!customer.source && !customer.relatedTransaction && !customer.referanceCustomerData" class="text-center py-8">
                    <div class="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                      <InformationCircleIcon class="h-6 w-6 text-gray-400" />
                    </div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('customer_detail.no_additional', 'Ek bilgi yok') }}</p>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div v-if="customer.description" class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">{{ t('customer_detail.description', 'Açıklama') }}</h3>
                </div>
                <div class="p-6 max-h-[300px] overflow-y-auto custom-scrollbar">
                  <div class="prose prose-sm dark:prose-invert max-w-none">
                    <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{{ customer.description }}</p>
                  </div>
                </div>
              </div>

              <!-- Message -->
              <div v-if="customer.message" class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">{{ t('customer_detail.message', 'Mesaj') }}</h3>
                </div>
                <div class="p-6">
                  <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{{ customer.message }}</p>
                  </div>
                </div>
              </div>

              <!-- Dynamic Fields -->
              <div v-if="customerDynamicFields && customerDynamicFields.length > 0" class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">{{ t('customer_detail.custom_fields', 'Özel Alanlar') }}</h3>
                </div>
                <div class="p-6 max-h-[300px] overflow-y-auto custom-scrollbar space-y-3">
                  <div v-for="field in customerDynamicFields" :key="field.id" 
                    class="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div class="h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                      <TagIcon class="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{{ field.name }}</p>
                      <p class="text-sm text-gray-900 dark:text-white break-words">{{ field.value || '-' }}</p>
                    </div>
                  </div>
                </div>
              </div>
              

            
          </div>
        </div>
      </Transition>
    </div>

    <!-- Modals -->
    <CustomerNotesModal :show="showNotesModal" :customer="customer" @close="showNotesModal = false" @customer-updated="fetchCustomer" />
    <DoctorAssignmentModal :show="showDoctorModal" :customer="customer" @close="showDoctorModal = false" @assigned="fetchCustomer" />
    <CustomerServicesModal :show="showServicesModal" :customer="customer" @close="showServicesModal = false" @saved="fetchCustomer" />
    <CustomerFilesModal :show="showFilesModal" :customer="customer" @close="showFilesModal = false" />
  </div>
</template>

<script setup>
import {
  UsersIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  HashtagIcon,
  CheckIcon,
  BellAlertIcon,
  CalendarIcon,
  ArrowPathIcon,
  UserIcon,
  DocumentTextIcon,
  FolderIcon,
  PencilIcon,
  ArrowLeftIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  GlobeAltIcon,
  UserCircleIcon,
  InformationCircleIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
  HomeIcon,
  BriefcaseIcon,
  IdentificationIcon,
  LanguageIcon,
  CakeIcon,
  ArrowTopRightOnSquareIcon,
  LinkIcon,
  TagIcon,
  EyeIcon
} from '@heroicons/vue/24/outline'
import { useLanguage } from '~/composables/useLanguage'

const { t, tp } = useLanguage()
const route = useRoute()
const router = useRouter()
const { isDoctor } = usePermissions()
const { $dayjs } = useNuxtApp()

// State
const customer = ref(null)
const loading = ref(true)
const loadingPersonal = ref(false)
const loadingSales = ref(false)
const error = ref('')
const locations = ref({ countries: [], states: [], cities: [] })
const statuses = ref([])
const customerDynamicFields = ref([])
const doctors = ref([])
const products = ref([])
const sales = ref([])
const phoneCopied = ref(false)

// Modal states
const showNotesModal = ref(false)
const showDoctorModal = ref(false)
const showServicesModal = ref(false)
const showFilesModal = ref(false)

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

 
// Methods
const formatPhoneForWhatsApp = (phone) => {
  if (!phone) return ''
  return String(phone).replace(/[\s\-\(\)\+]/g, '')
}

const copyPhone = async () => {
  if (!customer.value?.phone) return
  try {
    await navigator.clipboard.writeText(customer.value.phone)
    phoneCopied.value = true
    setTimeout(() => phoneCopied.value = false, 2000)
  } catch (err) {
    console.error('Copy failed:', err)
  }
}

const formatStatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatRelativeTime = (dateString) => {
  if (!dateString) return ''
  return $dayjs(dateString).fromNow()
}

const formatBirthDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const calculateAge = (birthDate) => {
  if (!birthDate) return 0
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

const getGenderText = (gender) => {
  const genders = { 
    'male': t('customer_detail.gender.male', 'Erkek'), 
    'female': t('customer_detail.gender.female', 'Kadın'), 
    'other': t('customer_detail.gender.other', 'Diğer') 
  }
  return genders[gender] || gender
}

const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http')) return imagePath
  const config = useRuntimeConfig()
  return `${config.public.apiBase || 'http://localhost:3001'}/${imagePath}`
}

const formatCurrency = (amount, currency) => {
  if (amount === null || amount === undefined) return '-'
  const symbols = { USD: '$', EUR: '€', TRY: '₺' }
  const numAmount = parseFloat(amount) || 0
  return `${symbols[currency] || currency} ${numAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

const truncateUrl = (url, maxLength) => {
  if (!url) return ''
  if (url.length <= maxLength) return url
  return url.substring(0, maxLength) + '...'
}

const getRemainingTime = (remindingDate) => {
  if (!remindingDate) return ''
  const now = new Date()
  const target = new Date(remindingDate)
  const diff = target.getTime() - now.getTime()

  if (diff < 0) {
    const hours = Math.floor(Math.abs(diff) / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    if (days > 0) return tp('customer_detail.time.days_overdue', { days }, '{days} gün gecikmiş')
    if (hours > 0) return tp('customer_detail.time.hours_overdue', { hours }, '{hours} saat gecikmiş')
    return t('customer_detail.time.just_passed', 'Az önce geçti')
  }

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  if (days > 0) return tp('customer_detail.time.days_left', { days }, '{days} gün kaldı')
  if (hours > 0) return tp('customer_detail.time.hours_left', { hours }, '{hours} saat kaldı')
  return t('customer_detail.time.now', 'Şimdi')
}

const getRemainingTimeClass = (remindingDate) => {
  if (!remindingDate) return ''
  const diff = new Date(remindingDate).getTime() - new Date().getTime()
  const hours = diff / (1000 * 60 * 60)
  if (diff < 0) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-900/50'
  if (hours <= 1) return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-900/50'
  if (hours <= 24) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50'
  return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-200 dark:border-gray-800'
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
    statuses.value = rawStatuses
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
    
    customer.value = response

    // Dynamic fields
    if (response.dynamicFieldValues) {
      customerDynamicFields.value = response.dynamicFieldValues
    }

    // Fetch related data in parallel
    const promises = []

    // Doctors
    promises.push(
      api(`/customers/${route.params.id}/doctors`)
        .then(res => doctors.value = res || [])
        .catch(() => doctors.value = [])
    )

    // Products
    promises.push(
      api(`/customers/${route.params.id}/products`)
        .then(res => products.value = res || [])
        .catch(() => products.value = [])
    )

    // Sales
    loadingSales.value = true
    promises.push(
      api(`/sales?customer_id=${route.params.id}`)
        .then(res => {
          sales.value = res.data || res || []
          loadingSales.value = false
        })
        .catch(() => {
          sales.value = []
          loadingSales.value = false
        })
    )

    await Promise.all(promises)

  } catch (err) {
    console.error('Error fetching customer:', err)
    if (err?.data?.statusCode === 404 || err?.status === 404) {
      error.value = t('customer_detail.errors.not_found', 'Müşteri bulunamadı.')
    } else if (err?.data?.statusCode === 401 || err?.status === 401) {
      error.value = t('customer_detail.errors.unauthorized', 'Oturum açmanız gerekiyor.')
    } else {
      error.value = t('customer_detail.errors.general', 'Müşteri bilgileri yüklenirken bir hata oluştu.')
    }
  } finally {
    loading.value = false
  }
}


const initData = async () => {
  await fetchLocations()
  await fetchCustomer()
}

onMounted(async () => {
  await initData()
})

useHead({
  title: computed(() => customer.value ? `${customer.value.name} - ${t('customer_detail.page_title', 'Müşteri Detayı')}` : t('customer_detail.page_title', 'Müşteri Detayı'))
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