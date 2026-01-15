<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
    <!-- Top Header Bar -->
    <div class="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-[1600px] mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Left: Back & Title -->
          <div class="flex items-center gap-4">
            <NuxtLink :to="`/customers/show/${$route.params.id}`"
              class="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 group">
              <ArrowLeftIcon class="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            </NuxtLink>
            <div>
              <h1 class="text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
                {{ t('customer_edit.title', 'Müşteri Düzenle') }}
              </h1>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {{ form.name }} {{ form.surname }}
              </p>
            </div>
          </div>

          <!-- Right: Actions -->
          <div class="flex items-center gap-3">
            <!-- Quick Actions -->
            <div class="hidden md:flex items-center gap-2 mr-4">
              <button @click="showHistory" 
                class="quick-action-btn group" 
                :title="t('customer_edit.actions.history', 'Geçmiş')">
                <ClockIcon class="h-5 w-5" />
                <span class="quick-action-tooltip">{{ t('customer_edit.actions.history', 'Geçmiş') }}</span>
              </button>
              <button @click="showNotes" 
                class="quick-action-btn group" 
                :title="t('customer_edit.actions.notes', 'Notlar')">
                <DocumentTextIcon class="h-5 w-5" />
                <span class="quick-action-tooltip">{{ t('customer_edit.actions.notes', 'Notlar') }}</span>
              </button>
              <button @click="showDoctorAssignment" 
                class="quick-action-btn group" 
                :title="t('customer_edit.actions.doctor', 'Doktor')">
                <UserIcon class="h-5 w-5" />
                <span class="quick-action-tooltip">{{ t('customer_edit.actions.doctor', 'Doktor') }}</span>
              </button>
              <button @click="showServices" 
                class="quick-action-btn group" 
                :title="t('customer_edit.actions.services', 'Hizmetler')">
                <ShoppingBagIcon class="h-5 w-5" />
                <span class="quick-action-tooltip">{{ t('customer_edit.actions.services', 'Hizmetler') }}</span>
              </button>
              <button @click="showFiles" 
                class="quick-action-btn group" 
                :title="t('customer_edit.actions.files', 'Dosyalar')">
                <FolderIcon class="h-5 w-5" />
                <span class="quick-action-tooltip">{{ t('customer_edit.actions.files', 'Dosyalar') }}</span>
              </button>
            </div>

            <!-- Save Status Indicator -->
            <div v-if="saveStatus" class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300"
              :class="saveStatusClass">
              <component :is="saveStatusIcon" class="h-4 w-4" />
              <span>{{ saveStatus }}</span>
            </div>

            <!-- Save Button -->
            <button @click="saveCustomer" 
              :disabled="saving || loading"
              class="relative inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:shadow-none transition-all duration-200 disabled:cursor-not-allowed">
              <ArrowPathIcon v-if="saving" class="h-5 w-5 animate-spin" />
              <CheckIcon v-else class="h-5 w-5" />
              <span>{{ saving ? t('customer_edit.buttons.saving', 'Kaydediliyor...') : t('customer_edit.buttons.save', 'Kaydet') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Global Error Toast -->
    <Transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="globalError" 
        class="fixed top-20 right-6 z-50 max-w-md bg-red-50 dark:bg-red-900/90 border border-red-200 dark:border-red-800 rounded-2xl shadow-2xl shadow-red-500/20 p-4">
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0 p-1 bg-red-100 dark:bg-red-800 rounded-lg">
            <ExclamationCircleIcon class="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-semibold text-red-800 dark:text-red-200">{{ t('customer_edit.errors.title', 'Hata') }}</h4>
            <p class="mt-1 text-sm text-red-700 dark:text-red-300">{{ globalError }}</p>
          </div>
          <button @click="globalError = ''" class="flex-shrink-0 p-1 hover:bg-red-100 dark:hover:bg-red-800 rounded-lg transition-colors">
            <XMarkIcon class="h-5 w-5 text-red-500" />
          </button>
        </div>
      </div>
    </Transition>

    <!-- Success Toast -->
    <Transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="successMessage" 
        class="fixed top-20 right-6 z-50 max-w-md bg-emerald-50 dark:bg-emerald-900/90 border border-emerald-200 dark:border-emerald-800 rounded-2xl shadow-2xl shadow-emerald-500/20 p-4">
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0 p-1 bg-emerald-100 dark:bg-emerald-800 rounded-lg">
            <CheckCircleIcon class="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-semibold text-emerald-800 dark:text-emerald-200">{{ t('customer_edit.success.title', 'Başarılı') }}</h4>
            <p class="mt-1 text-sm text-emerald-700 dark:text-emerald-300">{{ successMessage }}</p>
          </div>
          <button @click="successMessage = ''" class="flex-shrink-0 p-1 hover:bg-emerald-100 dark:hover:bg-emerald-800 rounded-lg transition-colors">
            <XMarkIcon class="h-5 w-5 text-emerald-500" />
          </button>
        </div>
      </div>
    </Transition>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <div class="relative">
          <div class="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
          <div class="absolute top-0 left-0 w-16 h-16 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p class="mt-4 text-slate-600 dark:text-slate-400 font-medium">{{ t('customer_edit.loading', 'Müşteri bilgileri yükleniyor...') }}</p>
      </div>
    </div>

    <!-- Access Error -->
    <div v-else-if="accessError" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center max-w-md">
        <div class="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mb-4">
          <ShieldExclamationIcon class="h-8 w-8 text-red-500" />
        </div>
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">{{ t('customer_edit.errors.access_denied', 'Erişim Engellendi') }}</h2>
        <p class="text-slate-600 dark:text-slate-400">{{ accessError }}</p>
        <NuxtLink to="/customers" class="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium hover:opacity-90 transition-opacity">
          <ArrowLeftIcon class="h-4 w-4" />
          {{ t('customer_edit.buttons.back_to_list', 'Müşteri Listesine Dön') }}
        </NuxtLink>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="max-w-[1600px] mx-auto px-6 py-8">
      <div class="flex gap-8">
        <!-- Left Sidebar Navigation -->
        <div class="w-64 flex-shrink-0">
          <div class="sticky top-28">
            <!-- Profile Preview Card -->
            <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 mb-6">
              <div class="flex flex-col items-center">
                <div class="relative group cursor-pointer" @click="triggerImageUpload">
                  <div v-if="imagePreview || form.imageUrl" class="relative">
                    <img :src="imagePreview || form.imageUrl" alt="Profile"
                      class="h-24 w-24 rounded-2xl object-cover ring-4 ring-slate-100 dark:ring-slate-800" />
                    <div class="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <CameraIcon class="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div v-else class="h-24 w-24 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center group-hover:from-slate-200 group-hover:to-slate-300 dark:group-hover:from-slate-700 dark:group-hover:to-slate-600 transition-all">
                    <UserIcon class="h-10 w-10 text-slate-400" />
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <CameraIcon class="h-6 w-6 text-slate-600 dark:text-slate-300" />
                    </div>
                  </div>
                </div>
                <input ref="imageInput" type="file" accept="image/*" @change="handleImageUpload" class="hidden" />
                <button v-if="imagePreview || form.imageUrl" @click.stop="removeImage" 
                  class="mt-2 text-xs text-red-500 hover:text-red-600 font-medium">
                  {{ t('customer_edit.remove_photo', 'Fotoğrafı Kaldır') }}
                </button>
                <h3 class="mt-4 text-lg font-semibold text-slate-900 dark:text-white text-center">
                  {{ form.name || 'İsim' }} {{ form.surname || 'Soyisim' }}
                </h3>
                <p class="text-sm text-slate-500 dark:text-slate-400">{{ form.email || 'email@example.com' }}</p>
                <span class="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                  :class="form.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'">
                  <span class="w-1.5 h-1.5 rounded-full" :class="form.isActive ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                  {{ form.isActive ? t('customer_edit.status.active', 'Aktif') : t('customer_edit.status.inactive', 'Pasif') }}
                </span>
              </div>
            </div>

            <!-- Navigation Tabs -->
            <nav class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2">
              <button v-for="tab in tabs" :key="tab.id"
                @click="switchTab(tab.id)"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200"
                :class="[
                  activeTab === tab.id 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
                  tabErrors[tab.id] && activeTab !== tab.id ? 'ring-2 ring-red-500 ring-offset-2 dark:ring-offset-slate-900' : ''
                ]">
                <component :is="tab.icon" class="h-5 w-5 flex-shrink-0" />
                <span class="font-medium text-sm">{{ tab.label }}</span>
                <!-- Error Badge -->
                <span v-if="tabErrors[tab.id]" 
                  class="ml-auto flex-shrink-0 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                  {{ tabErrors[tab.id] }}
                </span>
              </button>
            </nav>

            <!-- Progress Indicator -->
            <div class="mt-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ t('customer_edit.completion', 'Tamamlanma') }}</span>
                <span class="text-xs font-semibold text-slate-900 dark:text-white">{{ completionPercentage }}%</span>
              </div>
              <div class="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                  :style="{ width: `${completionPercentage}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Content Area -->
        <div class="flex-1 min-w-0 max-w-3xl x-auto">
          <form @submit.prevent="saveCustomer" class="space-y-6">
            <!-- Tab Content - Simplified transitions for better performance -->
            <div class="transition-opacity duration-150" :class="{ 'opacity-0': isTabChanging }">
              
              <!-- Basic Info Tab -->
              <div v-show="activeTab === 'basic'" class="space-y-6">
                <SectionCard :title="t('customer_edit.sections.basic_info', 'Temel Bilgiler')" icon="UserIcon">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      ref="nameInput"
                      v-model="form.name"
                      :label="t('customer_edit.fields.name', 'Ad')"
                      :placeholder="t('customer_edit.fields.name_placeholder', 'Müşteri adı')"
                      :error="fieldErrors.name"
                      required
                      @focus="clearFieldError('name')" />
                    
                    <FormInput
                      ref="surnameInput"
                      v-model="form.surname"
                      :label="t('customer_edit.fields.surname', 'Soyad')"
                      :placeholder="t('customer_edit.fields.surname_placeholder', 'Müşteri soyadı')"
                      :error="fieldErrors.surname"
                      required
                      @focus="clearFieldError('surname')" />

                    <FormInput
                      v-model="form.title"
                      :label="t('customer_edit.fields.title', 'Ünvan')"
                      :placeholder="t('customer_edit.fields.title_placeholder', 'Ünvan')" />

                    <FormSelect
                      v-model="form.gender"
                      :label="t('customer_edit.fields.gender', 'Cinsiyet')"
                      :options="genderOptions"
                      :placeholder="t('customer_edit.fields.gender_select', 'Seçiniz')" />

                    <FormInput
                      v-model="form.birth_date"
                      type="date"
                      :label="t('customer_edit.fields.birth_date', 'Doğum Tarihi')" />

                    <FormInput
                      v-model="form.identity_number"
                      :label="t('customer_edit.fields.identity_number', 'Kimlik Numarası')"
                      :placeholder="t('customer_edit.fields.identity_placeholder', '11 haneli kimlik numarası')" />

                    <FormInput
                      v-model="form.patient"
                      :label="t('customer_edit.fields.disease', 'Hastalık')"
                      :placeholder="t('customer_edit.fields.disease_placeholder', 'Hastalık')" />

                    <FormInput
                      :modelValue="form.url"
                      :label="t('customer_edit.fields.url', 'URL')"
                      disabled
                      :hint="t('customer_edit.readonly_tooltip', 'Değiştirilemez')" />

                    <FormInput
                      :modelValue="form.checkup_package"
                      :label="t('customer_edit.fields.checkup_package', 'Checkup Paketi')"
                      disabled
                      :hint="t('customer_edit.readonly_tooltip', 'Değiştirilemez')" />

                    <div class="md:col-span-2">
                      <FormTextarea
                        :modelValue="form.message"
                        :label="t('customer_edit.fields.form_message', 'Form Mesajı')"
                        disabled
                        rows="3"
                        :hint="t('customer_edit.readonly_tooltip', 'Değiştirilemez')" />
                    </div>
                  </div>
                </SectionCard>
              </div>

              <!-- Contact Tab -->
              <div v-show="activeTab === 'contact'" class="space-y-6">
                <SectionCard :title="t('customer_edit.sections.contact_info', 'İletişim Bilgileri')" icon="PhoneIcon">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      ref="emailInput"
                      v-model="form.email"
                      type="email"
                      :label="t('customer_edit.fields.email', 'E-posta')"
                      :placeholder="t('customer_edit.fields.email_placeholder', 'ornek@email.com')"
                      :error="fieldErrors.email"
                      required
                      @focus="clearFieldError('email')" />

                    <FormInput
                      v-model="form.phone"
                      type="tel"
                      :label="t('customer_edit.fields.phone', 'Telefon')"
                      :placeholder="t('customer_edit.fields.phone_placeholder', '(5xx) xxx xx xx')"
                      :error="fieldErrors.phone"
                      @focus="clearFieldError('phone')" />

                    <FormInput
                      v-model="form.website"
                      type="url"
                      :label="t('customer_edit.fields.website', 'Website')"
                      :placeholder="t('customer_edit.fields.website_placeholder', 'https://www.example.com')"
                      :error="fieldErrors.website"
                      @focus="clearFieldError('website')" />

                    <FormInput
                      v-model="form.language"
                      :label="t('customer_edit.fields.language', 'Dil')"
                      :placeholder="t('customer_edit.fields.language_placeholder', 'Türkçe, İngilizce, vb.')" />
                  </div>
                </SectionCard>
              </div>

              <!-- Work Tab -->
              <div v-show="activeTab === 'work'" class="space-y-6">
                <SectionCard :title="t('customer_edit.sections.job_info', 'İş ve Kaynak Bilgileri')" icon="BriefcaseIcon">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      v-model="form.job"
                      :label="t('customer_edit.fields.job', 'Meslek')"
                      :placeholder="t('customer_edit.fields.job_placeholder', 'Meslek')" />

                    <FormSelect
                      v-model="form.sourceId"
                      :label="t('customer_edit.fields.source', 'Kaynak')"
                      :options="sourceOptions"
                      :placeholder="t('customer_edit.fields.source_select', 'Kaynak seçiniz')" />

                    <!-- Reference Customer Autocomplete -->
                    <div>
                      <label class="form-label">{{ t('customer_edit.fields.reference_customer', 'Referans Müşteri') }}</label>
                      <div class="relative">
                        <input
                          v-model="searchQuery"
                          @input="searchReferences"
                          @focus="showDropdown = true"
                          type="text"
                          :placeholder="t('customer_edit.fields.reference_placeholder', 'Referans müşteriyi yazın...')"
                          class="form-input pr-10" />
                        <div v-if="loadingReferanceCustomer" class="absolute right-3 top-1/2 -translate-y-1/2">
                          <ArrowPathIcon class="h-5 w-5 text-slate-400 animate-spin" />
                        </div>
                        <!-- Dropdown -->
                        <Transition
                          enter-active-class="transition ease-out duration-100"
                          enter-from-class="transform opacity-0 scale-95"
                          enter-to-class="transform opacity-100 scale-100"
                          leave-active-class="transition ease-in duration-75"
                          leave-from-class="transform opacity-100 scale-100"
                          leave-to-class="transform opacity-0 scale-95">
                          <ul v-if="filteredReferances.length && showDropdown"
                            class="absolute z-20 mt-2 w-full max-h-60 overflow-auto bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl">
                            <li v-for="reference in filteredReferances" :key="reference.id"
                              @click="selectReference(reference)"
                              class="px-4 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0">
                              <span class="font-medium text-slate-900 dark:text-white">{{ reference.name }}</span>
                              <span v-if="reference.email" class="text-sm text-slate-500 ml-2">{{ reference.email }}</span>
                            </li>
                          </ul>
                        </Transition>
                      </div>
                    </div>

                    <FormSelect
                      v-model="form.relevant_user"
                      :label="t('customer_edit.fields.responsible_user', 'Sorumlu Kullanıcı')"
                      :options="userOptions"
                      :placeholder="t('customer_edit.fields.user_select', 'Kullanıcı seçiniz')" />
                  </div>
                </SectionCard>
              </div>

              <!-- Dynamic Fields Tab -->
              <div v-show="activeTab === 'dynamic'" class="space-y-6">
                <SectionCard :title="t('customer_edit.sections.dynamic_fields', 'Dinamik Alanlar')" icon="AdjustmentsHorizontalIcon">
                  <div v-if="loadingDynamicFields" class="flex items-center justify-center py-12">
                    <ArrowPathIcon class="h-8 w-8 text-slate-400 animate-spin" />
                    <span class="ml-3 text-slate-500">{{ t('customer_edit.dynamic_loading', 'Dinamik alanlar yükleniyor...') }}</span>
                  </div>
                  
                  <div v-else-if="dynamicFields.length === 0" class="text-center py-12">
                    <div class="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
                      <CubeTransparentIcon class="h-8 w-8 text-slate-400" />
                    </div>
                    <p class="text-slate-500 dark:text-slate-400">{{ t('customer_edit.dynamic_empty', 'Henüz dinamik alan tanımlanmamış.') }}</p>
                  </div>

                  <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <template v-for="field in sortedDynamicFields" :key="field.id">
                      <FormInput
                        v-if="field.type === 'text'"
                        v-model="dynamicFieldValues[field.id]"
                        :label="field.name"
                        :required="field.is_required"
                        :error="fieldErrors[`dynamic_${field.id}`]"
                        :placeholder="`${field.name} giriniz`"
                        @focus="clearFieldError(`dynamic_${field.id}`)" />

                      <FormInput
                        v-else-if="field.type === 'number'"
                        v-model.number="dynamicFieldValues[field.id]"
                        type="number"
                        :label="field.name"
                        :required="field.is_required"
                        :error="fieldErrors[`dynamic_${field.id}`]"
                        @focus="clearFieldError(`dynamic_${field.id}`)" />

                      <FormInput
                        v-else-if="field.type === 'email'"
                        v-model="dynamicFieldValues[field.id]"
                        type="email"
                        :label="field.name"
                        :required="field.is_required"
                        :error="fieldErrors[`dynamic_${field.id}`]"
                        @focus="clearFieldError(`dynamic_${field.id}`)" />

                      <FormInput
                        v-else-if="field.type === 'phone'"
                        v-model="dynamicFieldValues[field.id]"
                        type="tel"
                        :label="field.name"
                        :required="field.is_required"
                        :error="fieldErrors[`dynamic_${field.id}`]"
                        @focus="clearFieldError(`dynamic_${field.id}`)" />

                      <FormInput
                        v-else-if="field.type === 'url'"
                        v-model="dynamicFieldValues[field.id]"
                        type="url"
                        :label="field.name"
                        :required="field.is_required"
                        :error="fieldErrors[`dynamic_${field.id}`]"
                        @focus="clearFieldError(`dynamic_${field.id}`)" />

                      <FormInput
                        v-else-if="field.type === 'date'"
                        v-model="dynamicFieldValues[field.id]"
                        type="date"
                        :label="field.name"
                        :required="field.is_required"
                        :error="fieldErrors[`dynamic_${field.id}`]"
                        @focus="clearFieldError(`dynamic_${field.id}`)" />

                      <FormSelect
                        v-else-if="field.type === 'select'"
                        v-model="dynamicFieldValues[field.id]"
                        :label="field.name"
                        :required="field.is_required"
                        :options="parseOptionsData(field.options_data).map(opt => ({ value: opt, label: opt }))"
                        :error="fieldErrors[`dynamic_${field.id}`]"
                        @focus="clearFieldError(`dynamic_${field.id}`)" />

                      <FormCheckbox
                        v-else-if="field.type === 'checkbox'"
                        v-model="dynamicFieldValues[field.id]"
                        :label="field.name" />

                      <div v-else-if="field.type === 'textarea'" class="md:col-span-2">
                        <FormTextarea
                          v-model="dynamicFieldValues[field.id]"
                          :label="field.name"
                          :required="field.is_required"
                          :error="fieldErrors[`dynamic_${field.id}`]"
                          @focus="clearFieldError(`dynamic_${field.id}`)" />
                      </div>

                      <FormFileInput
                        v-else-if="field.type === 'file'"
                        :label="field.name"
                        :required="field.is_required"
                        @change="handleDynamicFileUpload($event, field.id)" />
                    </template>
                  </div>
                </SectionCard>
              </div>

              <!-- Location Tab -->
              <div v-show="activeTab === 'location'" class="space-y-6">
                <SectionCard :title="t('customer_edit.sections.location_info', 'Konum Bilgileri')" icon="MapPinIcon">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormSelect
                      v-model="form.country"
                      @change="onCountryChange"
                      :label="t('customer_edit.fields.country', 'Ülke')"
                      :options="countryOptions"
                      :placeholder="t('customer_edit.fields.country_select', 'Ülke seçiniz')" />

                    <FormSelect
                      v-model="form.state"
                      @change="onStateChange"
                      :label="t('customer_edit.fields.state', 'İl')"
                      :options="stateOptions"
                      :placeholder="t('customer_edit.fields.state_select', 'İl seçiniz')"
                      :disabled="!form.country" />

                    <FormSelect
                      v-model="form.city"
                      :label="t('customer_edit.fields.city', 'İlçe')"
                      :options="cityOptions"
                      :placeholder="t('customer_edit.fields.city_select', 'İlçe seçiniz')"
                      :disabled="!form.state" />

                    <FormInput
                      v-model="form.district"
                      :label="t('customer_edit.fields.district', 'Mahalle')"
                      :placeholder="t('customer_edit.fields.district_placeholder', 'Mahalle adı giriniz')" />

                    <FormInput
                      v-model="form.postalCode"
                      :label="t('customer_edit.fields.postal_code', 'Posta Kodu')"
                      :placeholder="t('customer_edit.fields.postal_placeholder', '12345')" />

                    <div class="md:col-span-2">
                      <FormTextarea
                        v-model="form.address"
                        :label="t('customer_edit.fields.address', 'Açık Adres')"
                        :placeholder="t('customer_edit.fields.address_placeholder', 'Detaylı adres bilgisi...')"
                        rows="3" />
                    </div>
                  </div>
                </SectionCard>
              </div>

              <!-- Status Tab -->
              <div v-show="activeTab === 'status'" class="space-y-6">
                <SectionCard :title="t('customer_edit.sections.status_description', 'Durum ve Açıklamalar')" icon="FlagIcon">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormSelect
                      v-model="form.status"
                      @change="onStatusChange"
                      :label="t('customer_edit.fields.status', 'Durum')"
                      :options="statusOptions"
                      :placeholder="t('customer_edit.fields.status_select', 'Durum seçiniz')" />

                    <div class="flex items-center">
                      <FormCheckbox
                        v-model="form.isActive"
                        :label="t('customer_edit.fields.active_customer', 'Aktif müşteri')" />
                    </div>
                  </div>

                  <!-- Reminder Section -->
                  <Transition
                    enter-active-class="transition ease-out duration-200"
                    enter-from-class="opacity-0 -translate-y-2"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition ease-in duration-150"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-2">
                    <div v-if="showReminderFields" class="mt-6 p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800">
                      <div class="flex items-center gap-3 mb-4">
                        <div class="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-xl">
                          <BellIcon class="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <h4 class="font-semibold text-slate-900 dark:text-white">{{ t('customer_edit.reminder.title', 'Hatırlatma Bilgisi') }}</h4>
                          <p class="text-sm text-amber-700 dark:text-amber-300">
                            {{ tp('customer_edit.reminder.days_later', { days: selectedReminderDays }, '{days} gün sonra aranacak') }}
                          </p>
                        </div>
                      </div>

                      <div v-if="!showReminderInputs">
                        <button type="button" @click="showReminderInputs = true"
                          class="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition-colors">
                          <PlusIcon class="h-4 w-4" />
                          {{ t('customer_edit.reminder.add_button', 'Hatırlatma da ekle') }}
                        </button>
                      </div>

                      <div v-else class="space-y-4 mt-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormInput
                            v-model="reminderDateTime"
                            type="datetime-local"
                            :label="t('customer_edit.reminder.datetime', 'Hatırlatma Tarihi ve Saati')"
                            required />

                          <FormInput
                            :modelValue="selectedStatusName"
                            :label="t('customer_edit.reminder.note_type', 'Not Tipi')"
                            disabled />
                        </div>

                        <FormTextarea
                          v-model="reminderNote"
                          :label="t('customer_edit.reminder.note', 'Hatırlatma Notu')"
                          :placeholder="t('customer_edit.reminder.note_placeholder', 'Hatırlatma için not giriniz...')"
                          required
                          rows="3" />
                      </div>
                    </div>
                  </Transition>

                  <div class="grid grid-cols-1 gap-6 mt-6">
                    <FormTextarea
                      v-model="form.description"
                      :label="t('customer_edit.fields.description', 'Açıklama')"
                      :placeholder="t('customer_edit.fields.description_placeholder', 'Müşteri hakkında notlar...')"
                      rows="4" />

                    <FormTextarea
                      v-model="form.relatedTransaction"
                      :label="t('customer_edit.fields.related_transaction', 'İlgili İşlem')"
                      :placeholder="t('customer_edit.fields.transaction_placeholder', 'İlgili işlem bilgisi...')"
                      rows="4" />
                  </div>
                </SectionCard>
              </div>
            </div>

            <!-- Mobile Save Button -->
            <div class="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <button type="submit" 
                :disabled="saving || loading"
                class="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-medium rounded-xl shadow-lg transition-all">
                <ArrowPathIcon v-if="saving" class="h-5 w-5 animate-spin" />
                <CheckIcon v-else class="h-5 w-5" />
                <span>{{ saving ? t('customer_edit.buttons.saving', 'Kaydediliyor...') : t('customer_edit.buttons.save', 'Kaydet') }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <CustomerHistoryModal :show="showHistoryModal" :customer="customerData" @close="showHistoryModal = false" />
    <CustomerNotesModal :show="showNotesModal" :customer="customerData" @close="showNotesModal = false" @customer-updated="loadCustomer" />
    <DoctorAssignmentModal :show="showDoctorModal" :customer="customerData" @close="showDoctorModal = false" @assigned="handleDoctorAssigned" />
    <CustomerServicesModal :show="showServicesModal" :customer="customerData" @close="showServicesModal = false" @saved="handleServicesSaved" />
    <CustomerFilesModal :show="showFilesModal" :customer="customerData" @close="showFilesModal = false" />
  </div>
</template>

<script setup>
import {
  ArrowLeftIcon,
  ClockIcon,
  DocumentTextIcon,
  UserIcon,
  ShoppingBagIcon,
  FolderIcon,
  CheckIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
  CameraIcon,
  PhoneIcon,
  BriefcaseIcon,
  MapPinIcon,
  FlagIcon,
  BellIcon,
  PlusIcon,
  ShieldExclamationIcon,
  CubeTransparentIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/vue/24/outline'
import { useLanguage } from '~/composables/useLanguage'
import FormInput from '~/components/FormInput.vue'
import FormSelect from '~/components/FormSelect.vue'
import FormTextarea from '~/components/FormTextarea.vue'
import FormCheckbox from '~/components/FormCheckbox.vue'
import FormFileInput from '~/components/FormFileInput.vue'
import SectionCard from '~/components/SectionCard.vue'

const { t, tp } = useLanguage()
const route = useRoute()
const { canAccessCustomer } = usePermissions()
const { getDynamicFields, parseOptionsData } = useCustomerDynamicFields()

// Refs
const imageInput = ref(null)
const nameInput = ref(null)
const surnameInput = ref(null)
const emailInput = ref(null)

// State
const loading = ref(true)
const saving = ref(false)
const accessError = ref('')
const globalError = ref('')
const successMessage = ref('')
const saveStatus = ref('')
const saveStatusClass = ref('')
const saveStatusIcon = ref(null)

const activeTab = ref('basic')
const isTabChanging = ref(false)
const fieldErrors = ref({})
const tabErrors = ref({})

const customerData = ref(null)

const showHistoryModal = ref(false)
const showNotesModal = ref(false)
const showDoctorModal = ref(false)
const showServicesModal = ref(false)
const showFilesModal = ref(false)

const dynamicFields = ref([])
const dynamicFieldValues = ref({})
const loadingDynamicFields = ref(false)

const countries = ref([])
const states = ref([])
const cities = ref([])
const sources = ref([])
const statuses = ref([])
const users = ref([])

const showReminderFields = ref(false)
const showReminderInputs = ref(false)
const selectedReminderDays = ref(0)
const reminderDateTime = ref('')
const reminderNote = ref('')
const selectedStatusName = ref('')

const filteredReferances = ref([])
const searchQuery = ref('')
const loadingReferanceCustomer = ref(false)
const showDropdown = ref(false)

const selectedImage = ref(null)
const imagePreview = ref(null)

let searchTimeout = null

const form = reactive({
  name: '',
  surname: '',
  title: '',
  email: '',
  gender: '',
  birth_date: '',
  patient: '',
  phone: '',
  sourceId: '',
  job: '',
  identity_number: '',
  referance_customer: '',
  language: '',
  isActive: true,
  status: '',
  website: '',
  country: '',
  state: '',
  city: '',
  district: '',
  postalCode: '',
  address: '',
  relevant_user: '',
  description: '',
  relatedTransaction: '',
  imageUrl: '',
  url: '',
  checkup_package: '',
  message: '',
})

// Tabs Configuration - Static array to prevent re-renders
const tabs = [
  { id: 'basic', label: 'Temel Bilgiler', icon: UserIcon },
  { id: 'contact', label: 'İletişim', icon: PhoneIcon },
  { id: 'work', label: 'İş Bilgileri', icon: BriefcaseIcon },
  { id: 'dynamic', label: 'Dinamik Alanlar', icon: AdjustmentsHorizontalIcon },
  { id: 'location', label: 'Konum', icon: MapPinIcon },
  { id: 'status', label: 'Durum', icon: FlagIcon },
]

// Field to Tab Mapping
const fieldTabMapping = {
  name: 'basic',
  surname: 'basic',
  email: 'contact',
  phone: 'contact',
  website: 'contact',
}

// Computed Options - Memoized to prevent unnecessary re-renders
const genderOptions = [
  { value: 'male', label: 'Erkek' },
  { value: 'female', label: 'Kadın' },
  { value: 'other', label: 'Diğer' },
]

// Use shallowRef for large arrays to prevent deep reactivity
const sourceOptions = computed(() => {
  if (!sources.value?.length) return []
  return sources.value.map(s => ({ value: s.id, label: s.name }))
})

const statusOptions = computed(() => {
  if (!statuses.value?.length) return []
  return statuses.value.map(s => ({ value: s.id, label: s.name }))
})

const userOptions = computed(() => {
  if (!users.value?.length) return []
  return users.value.map(u => ({ value: u.id, label: u.name }))
})

const countryOptions = computed(() => {
  if (!countries.value?.length) return []
  return countries.value.map(c => ({ value: c.id, label: c.name }))
})

// Cache previous country/state to avoid unnecessary recalculations
let cachedCountry = null
let cachedStateOptions = []
const stateOptions = computed(() => {
  if (!form.country) return []
  if (cachedCountry === form.country && cachedStateOptions.length > 0) {
    return cachedStateOptions
  }
  const countryId = parseInt(form.country)
  const filtered = states.value.filter(s => s.country === countryId)
  cachedCountry = form.country
  cachedStateOptions = filtered.map(s => ({ value: s.id, label: s.name }))
  return cachedStateOptions
})

let cachedState = null
let cachedCityOptions = []
const cityOptions = computed(() => {
  if (!form.state) return []
  if (cachedState === form.state && cachedCityOptions.length > 0) {
    return cachedCityOptions
  }
  const stateId = parseInt(form.state)
  const filtered = cities.value.filter(c => c.state === stateId)
  cachedState = form.state
  cachedCityOptions = filtered.map(c => ({ value: c.id, label: c.name }))
  return cachedCityOptions
})

const sortedDynamicFields = computed(() => 
  [...dynamicFields.value].sort((a, b) => a.order - b.order)
)

// Completion percentage - debounced calculation
const completionPercentage = ref(0)
const updateCompletionPercentage = () => {
  const fields = ['name', 'surname', 'email', 'phone', 'country', 'status']
  const filled = fields.filter(f => form[f] && String(form[f]).trim()).length
  completionPercentage.value = Math.round((filled / fields.length) * 100)
}

// Methods
const switchTab = (tabId) => {
  if (activeTab.value === tabId) return
  isTabChanging.value = true
  setTimeout(() => {
    activeTab.value = tabId
    isTabChanging.value = false
  }, 100)
}

const clearFieldError = (field) => {
  if (fieldErrors.value[field]) {
    delete fieldErrors.value[field]
    updateTabErrors()
  }
}

const updateTabErrors = () => {
  tabErrors.value = {}
  Object.keys(fieldErrors.value).forEach(field => {
    const tab = fieldTabMapping[field] || (field.startsWith('dynamic_') ? 'dynamic' : null)
    if (tab) {
      tabErrors.value[tab] = (tabErrors.value[tab] || 0) + 1
    }
  })
}

const scrollToError = (field) => {
  const tab = fieldTabMapping[field] || (field.startsWith('dynamic_') ? 'dynamic' : null)
  if (tab && activeTab.value !== tab) {
    activeTab.value = tab
    nextTick(() => {
      const element = document.querySelector(`[data-field="${field}"]`) || 
                      document.querySelector(`#${field}`) ||
                      document.querySelector(`[name="${field}"]`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.focus?.()
      }
    })
  } else {
    nextTick(() => {
      const element = document.querySelector(`[data-field="${field}"]`) || 
                      document.querySelector(`#${field}`) ||
                      document.querySelector(`[name="${field}"]`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.focus?.()
      }
    })
  }
}

const triggerImageUpload = () => {
  imageInput.value?.click()
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      globalError.value = t('customer_edit.errors.image_too_large', 'Dosya boyutu 5MB\'dan küçük olmalıdır')
      return
    }
    selectedImage.value = file
    const reader = new FileReader()
    reader.onload = (e) => { imagePreview.value = e.target.result }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  selectedImage.value = null
  imagePreview.value = null
  form.imageUrl = ''
  if (imageInput.value) imageInput.value.value = ''
}

const handleDynamicFileUpload = (event, fieldId) => {
  const file = event.target.files[0]
  if (file) {
    dynamicFieldValues.value[fieldId] = file.name
  }
}

const searchReferences = async () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(async () => {
    if (!searchQuery.value.trim()) {
      filteredReferances.value = []
      return
    }
    try {
      loadingReferanceCustomer.value = true
      showDropdown.value = true
      const api = useApi()
      const response = await api(`/customers?search=${searchQuery.value}`)
      const data = response.data || response || []
      filteredReferances.value = data.slice(0, 10)
    } catch (error) {
      console.error('Error loading customers:', error)
    } finally {
      loadingReferanceCustomer.value = false
    }
  }, 400)
}

const selectReference = (reference) => {
  form.referance_customer = reference.id
  searchQuery.value = reference.name
  showDropdown.value = false
}

const onCountryChange = () => {
  form.state = ''
  form.city = ''
  // Reset cache
  cachedState = null
  cachedCityOptions = []
}

const onStateChange = () => {
  form.city = ''
  // Reset cache
  cachedCityOptions = []
}

const onStatusChange = () => {
  const statusId = form.status ? parseInt(form.status) : null
  if (!statusId) {
    showReminderFields.value = false
    showReminderInputs.value = false
    selectedReminderDays.value = 0
    selectedStatusName.value = ''
    return
  }
  
  const selectedStatus = statuses.value.find(s => s.id === statusId)
  if (!selectedStatus) {
    showReminderFields.value = false
    showReminderInputs.value = false
    selectedReminderDays.value = 0
    selectedStatusName.value = ''
    return
  }
  
  const isRemindable = selectedStatus.is_remindable || selectedStatus.isRemindable || false
  
  // Only update if values actually changed to prevent re-renders
  if (showReminderFields.value !== isRemindable) {
    showReminderFields.value = isRemindable
  }
  
  if (selectedStatusName.value !== selectedStatus.name) {
    selectedStatusName.value = selectedStatus.name
  }
  
  if (isRemindable) {
    const remindingDay = selectedStatus.remindingDay || selectedStatus.reminding_day || 0
    if (selectedReminderDays.value !== remindingDay) {
      selectedReminderDays.value = remindingDay
    }
    showReminderInputs.value = false
    reminderDateTime.value = ''
    reminderNote.value = ''
  }
}

const validateForm = () => {
  fieldErrors.value = {}
  let firstErrorField = null

  // Required fields
  if (!form.name?.trim()) {
    fieldErrors.value.name = t('customer_edit.errors.name_required', 'Ad alanı zorunludur')
    if (!firstErrorField) firstErrorField = 'name'
  }

  if (!form.surname?.trim()) {
    fieldErrors.value.surname = t('customer_edit.errors.surname_required', 'Soyad alanı zorunludur')
    if (!firstErrorField) firstErrorField = 'surname'
  }

  if (!form.email?.trim()) {
    fieldErrors.value.email = t('customer_edit.errors.email_required', 'E-posta alanı zorunludur')
    if (!firstErrorField) firstErrorField = 'email'
  } else {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(form.email.trim())) {
      fieldErrors.value.email = t('customer_edit.errors.email_invalid', 'Geçerli bir e-posta adresi giriniz')
      if (!firstErrorField) firstErrorField = 'email'
    }
  }

  // Website validation
  if (form.website?.trim()) {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
    if (!urlPattern.test(form.website.trim())) {
      fieldErrors.value.website = t('customer_edit.errors.website_invalid', 'Geçerli bir web adresi giriniz')
      if (!firstErrorField) firstErrorField = 'website'
    }
  }

  // Dynamic fields validation
  for (const field of dynamicFields.value) {
    if (field.is_required) {
      const value = dynamicFieldValues.value[field.id]
      if (!value || (typeof value === 'string' && !value.trim())) {
        fieldErrors.value[`dynamic_${field.id}`] = tp('customer_edit.errors.field_required', { field: field.name }, '"{field}" alanı zorunludur')
        if (!firstErrorField) firstErrorField = `dynamic_${field.id}`
      }
    }
  }

  updateTabErrors()

  if (firstErrorField) {
    scrollToError(firstErrorField)
    return false
  }

  return true
}

const setSaveStatus = (status, type) => {
  saveStatus.value = status
  saveStatusClass.value = type === 'success' 
    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
    : type === 'error'
    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
  saveStatusIcon.value = type === 'success' ? CheckCircleIcon : type === 'error' ? ExclamationCircleIcon : ArrowPathIcon

  if (type !== 'loading') {
    setTimeout(() => { saveStatus.value = '' }, 3000)
  }
}

const saveCustomer = async () => {
  // Prevent double submission
  if (saving.value) {
    console.warn('Save already in progress')
    return
  }
  
  const startTime = Date.now()
  
  try {
    // Validate form first
    const isValid = validateForm()
    if (!isValid) {
      globalError.value = t('customer_edit.errors.validation_failed', 'Lütfen zorunlu alanları doldurunuz')
      return
    }

    if (showReminderInputs.value && (!reminderDateTime.value || !reminderNote.value)) {
      globalError.value = t('customer_edit.errors.reminder_required', 'Hatırlatma eklemek için tarih ve not alanları zorunludur')
      return
    }

    saving.value = true
    globalError.value = ''
    successMessage.value = ''
    setSaveStatus(t('customer_edit.status.saving', 'Kaydediliyor...'), 'loading')

    const customerId = route.params.id

    // Prepare dynamic fields data - use simple loop instead of chained methods
    const dynamicFieldsData = []
    for (const field of dynamicFields.value) {
      const value = dynamicFieldValues.value[field.id]
      if (value !== undefined && value !== null && value !== '') {
        dynamicFieldsData.push({
          customer_dynamic_field: field.id,
          name: field.name,
          type: field.type,
          file: field.type === 'file' ? value : undefined,
          options_data: field.type === 'file' ? undefined : String(value),
          order: field.order
        })
      }
    }

    // Prepare update data
    const updateData = {
      name: form.name.trim(),
      surname: form.surname.trim(),
      title: form.title?.trim() || null,
      email: form.email.trim(),
      gender: form.gender || null,
      birthDate: form.birth_date || null,
      patient: form.patient || null,
      phone: form.phone?.trim() || null,
      sourceId: form.sourceId ? parseInt(form.sourceId) : null,
      job: form.job?.trim() || null,
      identityNumber: form.identity_number ? parseInt(form.identity_number) : null,
      referanceCustomer: form.referance_customer ? parseInt(form.referance_customer) : null,
      language: form.language ? parseInt(form.language) : null,
      isActive: form.isActive,
      status: form.status ? parseInt(form.status) : null,
      website: form.website?.trim() || null,
      country: form.country ? parseInt(form.country) : null,
      state: form.state ? parseInt(form.state) : null,
      city: form.city ? parseInt(form.city) : null,
      district: form.district?.trim() || null,
      postalCode: form.postalCode ? parseInt(form.postalCode) : null,
      address: form.address?.trim() || null,
      relevantUser: form.relevant_user ? parseInt(form.relevant_user) : null,
      description: form.description?.trim() || null,
      relatedTransaction: form.relatedTransaction?.trim() || null,
      ...(dynamicFieldsData.length > 0 && { dynamicFields: dynamicFieldsData })
    }

    const api = useApi()

    // Handle image upload
    if (selectedImage.value) {
      const formData = new FormData()
      formData.append('image', selectedImage.value)
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value)
        }
      })
      await api(`/customers/${customerId}`, { method: 'PATCH', body: formData })
    } else {
      await api(`/customers/${customerId}`, { method: 'PATCH', body: updateData })
    }

    // Handle reminder note
    if (showReminderInputs.value && reminderDateTime.value && reminderNote.value) {
      try {
        await api('/customer-notes', {
          method: 'POST',
          body: {
            customer: parseInt(customerId),
            note: reminderNote.value.trim(),
            isReminding: true,
            remindingAt: new Date(reminderDateTime.value).toISOString(),
            noteType: selectedStatusName.value
          }
        })
      } catch (noteError) {
        console.error('Customer note creation error:', noteError)
        const errorMessage = noteError.data?.message || noteError.data?.error || 'Bilinmeyen hata'
        globalError.value = tp('customer_edit.success.updated_note_failed', { error: errorMessage }, 'Müşteri bilgileri güncellendi ancak hatırlatma notu kaydedilemedi: {error}')
      }
    }

    // Check for slow request
    const duration = Date.now() - startTime
    if (duration > 3000) {
      console.warn(`Slow save operation: ${duration}ms`)
    }

    setSaveStatus(t('customer_edit.status.saved', 'Kaydedildi'), 'success')
    successMessage.value = t('customer_edit.success.updated', 'Müşteri bilgileri başarıyla güncellendi!')

    setTimeout(() => {
      navigateTo(`/customers/show/${customerId}`)
    }, 1500)

  } catch (err) {
    console.error('Save error:', err)
    
    // Detailed error handling
    let errorMessage = t('customer_edit.errors.save_failed', 'Güncelleme sırasında bir hata oluştu.')
    
    if (err.data?.message) {
      errorMessage = err.data.message
    } else if (err.data?.error) {
      errorMessage = err.data.error
    } else if (err.message) {
      if (err.message.includes('network') || err.message.includes('Network')) {
        errorMessage = t('customer_edit.errors.network', 'Ağ hatası. Lütfen internet bağlantınızı kontrol edin.')
      } else if (err.message.includes('timeout') || err.message.includes('Timeout')) {
        errorMessage = t('customer_edit.errors.timeout', 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.')
      } else if (err.message.includes('duplicate') || err.message.includes('Duplicate')) {
        errorMessage = t('customer_edit.errors.duplicate', 'Bu e-posta veya telefon numarası zaten kayıtlı.')
      }
    }

    globalError.value = errorMessage
    setSaveStatus(t('customer_edit.status.error', 'Hata'), 'error')

  } finally {
    saving.value = false
  }
}

const loadDropdownData = async () => {
  try {
    const api = useApi()
    const [countriesRes, statesRes, citiesRes, sourcesRes, statusesRes, usersRes] = await Promise.all([
      api('/countries').catch(() => []),
      api('/states').catch(() => []),
      api('/cities').catch(() => []),
      api('/sources').catch(() => []),
      api('/statuses').catch(() => []),
      api('/users').catch(() => []),
    ])
    countries.value = countriesRes
    states.value = statesRes
    cities.value = citiesRes
    sources.value = sourcesRes.data || sourcesRes || []
    statuses.value = statusesRes.data || statusesRes || []
    users.value = usersRes.data || usersRes
  } catch (err) {
    console.error('Dropdown data loading error:', err)
    globalError.value = t('customer_edit.errors.dropdown_failed', 'Dropdown verileri yüklenemedi')
  }
}

const loadDynamicFields = async () => {
  try {
    loadingDynamicFields.value = true
    const fields = await getDynamicFields()
    dynamicFields.value = fields.sort((a, b) => a.order - b.order)
  } catch (error) {
    console.error('Error loading dynamic fields:', error)
  } finally {
    loadingDynamicFields.value = false
  }
}

const loadCustomer = async () => {
  try {
    loading.value = true
    accessError.value = ''
    const customerId = route.params.id
    const api = useApi()
    const response = await api(`/customers/${customerId}`)

    if (!canAccessCustomer(response)) {
      accessError.value = t('customer_edit.errors.no_access', 'Bu müşteriye erişim yetkiniz bulunmamaktadır.')
      return
    }

    customerData.value = response
    
    // Populate form
    Object.assign(form, {
      name: response.name || '',
      surname: response.surname || '',
      title: response.title || '',
      email: response.email || '',
      gender: response.gender || '',
      birth_date: response.birthDate || response.birth_date || '',
      patient: response.patient || '',
      phone: response.phone || '',
      sourceId: response.sourceId || response.source_id || '',
      job: response.job || '',
      identity_number: response.identityNumber || response.identity_number || '',
      referance_customer: response.referanceCustomer || response.referance_customer || '',
      language: response.language || '',
      isActive: response.isActive !== false,
      status: response.status || '',
      website: response.website || '',
      country: response.country || '',
      state: response.state || '',
      city: response.city || '',
      district: response.district || '',
      postalCode: response.postalCode || response.postal_code || '',
      address: response.address || '',
      relevant_user: response.relevantUser || response.relevant_user || '',
      description: response.description || '',
      relatedTransaction: response.relatedTransaction || '',
      imageUrl: response.image || response.imageUrl || '',
      url: response.url || '',
      checkup_package: response.checkup_package || '',
      message: response.message || ''
    })

    // Handle status reminder
    if (form.status && statuses.value.length > 0) {
      const selectedStatus = statuses.value.find(s => s.id === parseInt(form.status))
      if (selectedStatus?.is_remindable || selectedStatus?.isRemindable) {
        showReminderFields.value = true
        selectedStatusName.value = selectedStatus.name
        selectedReminderDays.value = selectedStatus.remindingDay || selectedStatus.reminding_day || 0
      }
    }

    // Populate dynamic field values
    if (response.dynamicFieldValues?.length > 0) {
      dynamicFieldValues.value = {}
      response.dynamicFieldValues.forEach(field => {
        if (field.customer_dynamic_field) {
          dynamicFieldValues.value[field.customer_dynamic_field] = field.options_data || field.file || ''
        }
      })
    }

    searchQuery.value = response.referanceCustomerData || ''
    
    // Update completion percentage
    updateCompletionPercentage()

  } catch (err) {
    console.error('Customer loading error:', err)
    accessError.value = t('customer_edit.errors.load_failed', 'Müşteri bilgileri yüklenemedi.')
  } finally {
    loading.value = false
  }
}

// Modal handlers
const showHistory = () => { showHistoryModal.value = true }
const showNotes = () => { showNotesModal.value = true }
const showDoctorAssignment = () => { showDoctorModal.value = true }
const showServices = () => { showServicesModal.value = true }
const showFiles = () => { showFilesModal.value = true }
const handleDoctorAssigned = () => {}
const handleServicesSaved = () => { showServicesModal.value = false }

// Click outside handler for dropdown
const handleClickOutside = (event) => {
  if (!event.target.closest('#referanceCustomer') && !event.target.closest('ul')) {
    showDropdown.value = false
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  await loadDropdownData()
  await Promise.all([loadDynamicFields(), loadCustomer()])
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

useHead({
  title: 'Müşteri Düzenle - Valdori CRM'
})
</script>

<style scoped>
.quick-action-btn {
  @apply relative p-2.5 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-all duration-200;
}

.quick-action-tooltip {
  @apply absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50;
}

.form-label {
  @apply block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2;
}

.form-input {
  @apply w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:text-slate-500 dark:disabled:text-slate-500 disabled:cursor-not-allowed;
}

.form-input-error {
  @apply ring-2 ring-red-500 border-transparent;
}
</style>