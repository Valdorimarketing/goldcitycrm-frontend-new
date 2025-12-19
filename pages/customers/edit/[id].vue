<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-6xl mx-auto py-6 px-4">

      <!-- Başlık -->
      <div class="mb-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ t('customer_edit.title', 'Müşteri Düzenle') }}</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2">{{ t('customer_edit.subtitle', 'Müşteri bilgilerini güncelleyin') }}</p>
          </div>

          <!-- İşlemler Butonları -->
          <div class="flex flex-wrap gap-2">
            <button @click="showHistory"
              class="relative group inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              :title="t('customer_edit.actions.history', 'Geçmiş')">
              <ClockIcon class="h-5 w-5" />
              <span class="ml-1 hidden sm:inline">{{ t('customer_edit.actions.history', 'Geçmiş') }}</span>
            </button>
            <button @click="showNotes"
              class="relative group inline-flex items-center rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500"
              :title="t('customer_edit.actions.notes', 'Notlar')">
              <DocumentTextIcon class="h-5 w-5" />
              <span class="ml-1 hidden sm:inline">{{ t('customer_edit.actions.notes', 'Notlar') }}</span>
            </button>
            <button @click="showDoctorAssignment"
              class="relative group inline-flex items-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500"
              :title="t('customer_edit.actions.doctor', 'Doktor')">
              <UserIcon class="h-5 w-5" />
              <span class="ml-1 hidden sm:inline">{{ t('customer_edit.actions.doctor', 'Doktor') }}</span>
            </button>
            <button @click="showServices"
              class="relative group inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
              :title="t('customer_edit.actions.services', 'Hizmetler')">
              <ShoppingBagIcon class="h-5 w-5" />
              <span class="ml-1 hidden sm:inline">{{ t('customer_edit.actions.services', 'Hizmetler') }}</span>
            </button>
            <button @click="showFiles"
              class="relative group inline-flex items-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500"
              :title="t('customer_edit.actions.files', 'Dosyalar')">
              <FolderIcon class="h-5 w-5" />
              <span class="ml-1 hidden sm:inline">{{ t('customer_edit.actions.files', 'Dosyalar') }}</span>
            </button>
            <NuxtLink :to="`/customers/show/${$route.params.id}`"
              class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              :title="t('customer_edit.actions.view', 'Görüntüle')">
              <EyeIcon class="h-5 w-5 mr-1" />
              {{ t('customer_edit.actions.view', 'Görüntüle') }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Yükleniyor mesajı -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-400">{{ t('customer_edit.loading', 'Müşteri bilgileri yükleniyor...') }}</span>
      </div>

      <!-- Hata mesajı -->
      <div v-if="error"
        class="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
        {{ error }}
      </div>

      <!-- Form -->
      <div v-if="!loading && !error" class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <form @submit.prevent="saveCustomer" class="space-y-8">

          <!-- Temel Bilgiler -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">{{ t('customer_edit.sections.basic_info', 'Temel Bilgiler') }}</h3>

            <!-- Image Upload -->
            <div class="flex justify-center mb-6">
              <div class="w-full max-w-md">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
                  {{ t('customer_edit.profile_photo', 'Profil Fotoğrafı') }}
                </label>
                <div class="flex flex-col items-center">
                  <!-- Image Preview -->
                  <div v-if="imagePreview || form.imageUrl" class="mb-4">
                    <img :src="imagePreview || form.imageUrl" alt="Profile"
                      class="h-32 w-32 rounded-full object-cover border-4 border-blue-200 dark:border-blue-700" />
                  </div>
                  <div v-else class="mb-4">
                    <div class="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <UserIcon class="h-16 w-16 text-gray-400" />
                    </div>
                  </div>
                  <!-- File Input -->
                  <input id="image" type="file" accept="image/*" @change="handleImageUpload"
                    class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200" />
                  <button v-if="imagePreview || form.imageUrl" type="button" @click="removeImage"
                    class="mt-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400">
                    {{ t('customer_edit.remove_photo', 'Fotoğrafı Kaldır') }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Ad Soyad -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('customer_edit.fields.name', 'Ad *') }}
                </label>
                <input v-model="form.name" type="text" required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="t('customer_edit.fields.name_placeholder', 'Müşteri adı')" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('customer_edit.fields.surname', 'Soyad *') }}
                </label>
                <input v-model="form.surname" type="text" required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="t('customer_edit.fields.surname_placeholder', 'Müşteri soyadı')" />
              </div>
            </div>

            <!-- Ünvan ve Cinsiyet -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('customer_edit.fields.title', 'Ünvan') }}
                </label>
                <input v-model="form.title" type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="t('customer_edit.fields.title_placeholder', 'Ünvan')" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('customer_edit.fields.gender', 'Cinsiyet') }}
                </label>
                <select v-model="form.gender"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">{{ t('customer_edit.fields.gender_select', 'Seçiniz') }}</option>
                  <option value="male">{{ t('customer_edit.fields.gender_male', 'Erkek') }}</option>
                  <option value="female">{{ t('customer_edit.fields.gender_female', 'Kadın') }}</option>
                  <option value="other">{{ t('customer_edit.fields.gender_other', 'Diğer') }}</option>
                </select>
              </div>
            </div>

            <!-- Doğum Tarihi ve Kimlik No -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('customer_edit.fields.birth_date', 'Doğum Tarihi') }}
                </label>
                <input v-model="form.birth_date" type="date"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('customer_edit.fields.identity_number', 'Kimlik Numarası') }}
                </label>
                <input v-model="form.identity_number" type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="t('customer_edit.fields.identity_placeholder', '11 haneli kimlik numarası')" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('customer_edit.fields.disease', 'Hastalık') }}
                </label>
                <input v-model="form.patient" type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="t('customer_edit.fields.disease_placeholder', 'Hastalık')" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('customer_edit.fields.url', 'URL') }}
                </label>
                <input :value="form.url" type="text" disabled :title="t('customer_edit.readonly_tooltip', 'Değiştirilemez')"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md"
                  :placeholder="t('customer_edit.fields.url_placeholder', 'URL')" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('customer_edit.fields.checkup_package', 'Checkup Paketi') }}
                </label>
                <input :value="form.checkup_package" type="text" disabled :title="t('customer_edit.readonly_tooltip', 'Değiştirilemez')"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('customer_edit.fields.form_message', 'Form Mesajı') }}
                </label>
                <textarea type="text" disabled :title="t('customer_edit.readonly_tooltip', 'Değiştirilemez')"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md">{{ form.message }}</textarea>
              </div>
            </div>
          </div>

          <!-- İletişim Bilgileri -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">{{ t('customer_edit.sections.contact_info', 'İletişim Bilgileri') }}</h3>

            <!-- Email Telefon -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('customer_edit.fields.email', 'E-posta *') }}
                </label>
                <input v-model="form.email" type="email" required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="t('customer_edit.fields.email_placeholder', 'ornek@email.com')" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('customer_edit.fields.phone', 'Telefon') }}
                </label>
                <input v-model="form.phone" type="tel"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{ 'border-red-300 dark:border-red-500': errors.phone }" 
                  :placeholder="t('customer_edit.fields.phone_placeholder', '(5xx) xxx xx xx')"
                  maxlength="16" />
                <p v-if="errors.phone" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.phone }}</p>
              </div>
            </div>

            <!-- Website ve Dil -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('customer_edit.fields.website', 'Website') }}
                </label>
                <input v-model="form.website" type="url"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{ 'border-red-300 dark:border-red-500': errors.website }"
                  :placeholder="t('customer_edit.fields.website_placeholder', 'https://www.example.com')" />
                <p v-if="errors.website" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.website }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('customer_edit.fields.language', 'Dil') }}
                </label>
                <input v-model="form.language" type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="t('customer_edit.fields.language_placeholder', 'Türkçe, İngilizce, vb.')" />
              </div>
            </div>
          </div>

          <!-- İş Bilgileri -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">{{ t('customer_edit.sections.job_info', 'İş ve Kaynak Bilgileri') }}</h3>

            <!-- Meslek ve Kaynak -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('customer_edit.fields.job', 'Meslek') }}
                </label>
                <input v-model="form.job" type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="t('customer_edit.fields.job_placeholder', 'Meslek')" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('customer_edit.fields.source', 'Kaynak') }}
                </label>
                <select v-model="form.sourceId"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">{{ t('customer_edit.fields.source_select', 'Kaynak seçiniz') }}</option>
                  <option v-for="source in sources" :key="source.id" :value="source.id">
                    {{ source.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Referans Müşteri ve Sorumlu Kullanıcı -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('customer_edit.fields.reference_customer', 'Referans Müşteri') }}
                </label> 
                <div class="relative">
                  <input id="referanceCustomer" type="text" v-model="searchQuery" @input="searchReferences"
                    :disabled="loadingReferanceCustomer" 
                    :placeholder="t('customer_edit.fields.reference_placeholder', 'Referans müşteriyi yazın...')"
                    class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 dark:bg-gray-700 transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed dark:disabled:bg-gray-800 dark:disabled:text-gray-400" />

                  <!-- Loading Spinner -->
                  <div v-if="loadingReferanceCustomer" class="absolute right-3 top-3">
                    <svg class="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none"
                      viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z">
                      </path>
                    </svg>
                  </div>

                  <!-- Dropdown -->
                  <ul v-if="filteredReferances.length && showDropdown"
                    class="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
                    <li v-for="reference in filteredReferances" :key="reference.id" @click="selectReference(reference)"
                      class="px-4 py-2 cursor-pointer hover:bg-indigo-100 dark:hover:bg-gray-700">
                      {{ reference.name }}
                    </li>
                  </ul>
                </div>

              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('customer_edit.fields.responsible_user', 'Sorumlu Kullanıcı') }}
                </label>
                <select v-model="form.relevant_user"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">{{ t('customer_edit.fields.user_select', 'Kullanıcı seçiniz') }}</option>
                  <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Dinamik Alanlar -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">{{ t('customer_edit.sections.dynamic_fields', 'Dinamik Alanlar') }}</h3>

            <div v-if="loadingDynamicFields" class="text-center py-4">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p class="text-gray-600 dark:text-gray-400 mt-2">{{ t('customer_edit.dynamic_loading', 'Dinamik alanlar yükleniyor...') }}</p>
            </div>

            <div v-else-if="dynamicFields.length === 0" class="text-center py-4">
              <p class="text-gray-500 dark:text-gray-400">{{ t('customer_edit.dynamic_empty', 'Henüz dinamik alan tanımlanmamış.') }}</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="field in sortedDynamicFields" :key="field.id">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ field.name }}
                  <span v-if="field.is_required" class="text-red-500">*</span>
                </label>

                <!-- Text Input -->
                <input v-if="field.type === 'text'" v-model="dynamicFieldValues[field.id]" type="text"
                  :required="field.is_required"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="`${field.name} giriniz`" />

                <!-- Number Input -->
                <input v-else-if="field.type === 'number'" v-model.number="dynamicFieldValues[field.id]" type="number"
                  :required="field.is_required"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="`${field.name} giriniz`" />

                <!-- Email Input -->
                <input v-else-if="field.type === 'email'" v-model="dynamicFieldValues[field.id]" type="email"
                  :required="field.is_required"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="`${field.name} giriniz`" />

                <!-- Phone Input -->
                <input v-else-if="field.type === 'phone'" v-model="dynamicFieldValues[field.id]" type="tel"
                  :required="field.is_required"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="`${field.name} giriniz`" />

                <!-- URL Input -->
                <input v-else-if="field.type === 'url'" v-model="dynamicFieldValues[field.id]" type="url"
                  :required="field.is_required"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="`${field.name} giriniz`" />

                <!-- Date Input -->
                <input v-else-if="field.type === 'date'" v-model="dynamicFieldValues[field.id]" type="date"
                  :required="field.is_required"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />

                <!-- Select Dropdown -->
                <select v-else-if="field.type === 'select'" v-model="dynamicFieldValues[field.id]"
                  :required="field.is_required"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">{{ t('customer_edit.fields.gender_select', 'Seçiniz') }}</option>
                  <option v-for="option in parseOptionsData(field.options_data)" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>

                <!-- Checkbox -->
                <div v-else-if="field.type === 'checkbox'" class="flex items-center">
                  <input v-model="dynamicFieldValues[field.id]" type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ field.name }}</label>
                </div>

                <!-- Textarea -->
                <textarea v-else-if="field.type === 'textarea'" v-model="dynamicFieldValues[field.id]" rows="3"
                  :required="field.is_required"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="`${field.name} giriniz`"></textarea>

                <!-- File Input -->
                <input v-else-if="field.type === 'file'" type="file" :required="field.is_required"
                  @change="handleFileUpload($event, field.id)"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          <!-- Konum Bilgileri -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">{{ t('customer_edit.sections.location_info', 'Konum Bilgileri') }}</h3>

            <!-- Ülke ve İl -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('customer_edit.fields.country', 'Ülke') }}
                </label>
                <select v-model="form.country" @change="onCountryChange"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">{{ t('customer_edit.fields.country_select', 'Ülke seçiniz') }}</option>
                  <option v-for="country in countries" :key="country.id" :value="country.id">
                    {{ country.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('customer_edit.fields.state', 'İl') }}
                </label>
                <select v-model="form.state" @change="onStateChange"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :disabled="!form.country">
                  <option value="">{{ t('customer_edit.fields.state_select', 'İl seçiniz') }}</option>
                  <option v-for="state in filteredStates" :key="state.id" :value="state.id">
                    {{ state.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- İlçe ve Mahalle -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('customer_edit.fields.city', 'İlçe') }}
                </label>
                <select v-model="form.city" @change="onCityChange"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :disabled="!form.state">
                  <option value="">{{ t('customer_edit.fields.city_select', 'İlçe seçiniz') }}</option>
                  <option v-for="city in filteredCities" :key="city.id" :value="city.id">
                    {{ city.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('customer_edit.fields.district', 'Mahalle') }}
                </label>
                <input v-model="form.district" type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="t('customer_edit.fields.district_placeholder', 'Mahalle adı giriniz')" />
              </div>
            </div>

            <!-- Posta Kodu ve Adres -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('customer_edit.fields.postal_code', 'Posta Kodu') }}
                </label>
                <input v-model="form.postalCode" type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="t('customer_edit.fields.postal_placeholder', '12345')" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('customer_edit.fields.address', 'Açık Adres') }}
                </label>
                <textarea v-model="form.address" rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="t('customer_edit.fields.address_placeholder', 'Detaylı adres bilgisi...')"></textarea>
              </div>
            </div>
          </div>

          <!-- Durum ve Açıklama -->
          <div class="pb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">{{ t('customer_edit.sections.status_description', 'Durum ve Açıklamalar') }}</h3>

            <!-- Durum ve Aktiflik -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('customer_edit.fields.status', 'Durum') }}
                </label>
                <select v-model="form.status" @change="onStatusChange"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">{{ t('customer_edit.fields.status_select', 'Durum seçiniz') }}</option>
                  <option v-for="status in statuses" :key="status.id" :value="status.id">
                    {{ status.name }}
                  </option>
                </select>
              </div>
              <div class="flex items-center">
                <label class="flex items-center">
                  <input v-model="form.isActive" type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ t('customer_edit.fields.active_customer', 'Aktif müşteri') }}</span>
                </label>
              </div>
            </div>

            <!-- Hatırlatma Alanları -->
            <div v-if="showReminderFields" class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">{{ t('customer_edit.reminder.title', 'Hatırlatma Bilgisi') }}</h4>

              <!-- Reminding Day Info -->
              <div class="mb-4">
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  <span class="font-semibold">{{ tp('customer_edit.reminder.days_later', { days: selectedReminderDays }, '{days} gün sonra aranacak') }}</span>
                </p>
              </div>

              <!-- Add Reminder Button -->
              <div v-if="!showReminderInputs" class="mb-4">
                <button type="button" @click="showReminderInputs = true"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  {{ t('customer_edit.reminder.add_button', 'Hatırlatma da ekle') }}
                </button>
              </div>

              <!-- Reminder Input Fields -->
              <div v-if="showReminderInputs">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {{ t('customer_edit.reminder.datetime', 'Hatırlatma Tarihi ve Saati *') }}
                    </label>
                    <input v-model="reminderDateTime" type="datetime-local" required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {{ t('customer_edit.reminder.note_type', 'Not Tipi') }}
                    </label>
                    <input v-model="selectedStatusName" type="text" readonly
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white rounded-md" />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('customer_edit.reminder.note', 'Hatırlatma Notu *') }}
                  </label>
                  <textarea v-model="reminderNote" rows="3" required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :placeholder="t('customer_edit.reminder.note_placeholder', 'Hatırlatma için not giriniz...')"></textarea>
                </div>
              </div>
            </div>

            <!-- Açıklama -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('customer_edit.fields.description', 'Açıklama') }}
              </label>
              <textarea v-model="form.description" rows="4"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :placeholder="t('customer_edit.fields.description_placeholder', 'Müşteri hakkında notlar...')"></textarea>
            </div>

            <!-- İlgili İşlem -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('customer_edit.fields.related_transaction', 'İlgili İşlem') }}
              </label>
              <textarea v-model="form.relatedTransaction" rows="4"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :placeholder="t('customer_edit.fields.transaction_placeholder', 'İlgili işlem bilgisi...')"></textarea>
            </div>
          </div>

          <!-- Başarı mesajı -->
          <div v-if="successMessage"
            class="bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded mb-6">
            {{ successMessage }}
          </div>

          <!-- Submit hatası -->
          <div v-if="submitError"
            class="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
            {{ submitError }}
          </div>

          <!-- Butonlar -->
          <div class="flex justify-end space-x-4">
            <NuxtLink :to="`/customers/show/${$route.params.id}`"
              class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              {{ t('customer_edit.buttons.cancel', 'İptal') }}
            </NuxtLink>
            <button type="submit" :disabled="saving"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {{ saving ? t('customer_edit.buttons.saving', 'Kaydediliyor...') : t('customer_edit.buttons.save', 'Kaydet') }}
            </button>
          </div>
        </form>
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
  ClockIcon,
  DocumentTextIcon,
  UserIcon,
  ShoppingBagIcon,
  FolderIcon,
  EyeIcon
} from '@heroicons/vue/24/outline'
import { useLanguage } from '~/composables/useLanguage'

const { t, tp } = useLanguage()
const route = useRoute()
const { canAccessCustomer } = usePermissions()
const { getDynamicFields, parseOptionsData } = useCustomerDynamicFields()

const loading = ref(true)
const saving = ref(false)
const error = ref('')
const errors = ref({})
const successMessage = ref('')
const submitError = ref('')

const countries = ref([])
const states = ref([])
const cities = ref([])
const sources = ref([])
const statuses = ref([])
const users = ref([])
const customers = ref([])

const customerData = ref(null)

const showHistoryModal = ref(false)
const showNotesModal = ref(false)
const showDoctorModal = ref(false)
const showServicesModal = ref(false)
const showFilesModal = ref(false)

const dynamicFields = ref([])
const dynamicFieldValues = ref({})
const loadingDynamicFields = ref(false)

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

const selectedImage = ref(null)
const imagePreview = ref(null)

const showReminderFields = ref(false)
const showReminderInputs = ref(false)
const selectedReminderDays = ref(0)
const reminderDateTime = ref('')
const reminderNote = ref('')
const selectedStatusName = ref('')

const referances = ref([])
const filteredReferances = ref([])
const searchQuery = ref('')
const loadingReferanceCustomer = ref(false)
const showDropdown = ref(false)

let searchTimeout = null

const filteredStates = computed(() => {
  return form.country ? states.value.filter(s => s.country === parseInt(form.country)) : []
})

const filteredCities = computed(() => {
  return form.state ? cities.value.filter(c => c.state === parseInt(form.state)) : []
})

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
      referances.value = data
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
  form.district = ''
}

const onStateChange = () => {
  form.city = ''
  form.district = ''
}

const onCityChange = () => {}

const onStatusChange = () => { 
  const selectedStatus = statuses.value.find(s => s.id === parseInt(form.status)) 
  if (selectedStatus) {
    const isRemindable = selectedStatus.is_remindable || selectedStatus.isRemindable || false 
    showReminderFields.value = isRemindable
    selectedStatusName.value = selectedStatus.name
    if (isRemindable) {
      const remindingDay = selectedStatus.remindingDay || selectedStatus.reminding_day || 0
      selectedReminderDays.value = remindingDay
      showReminderInputs.value = false
      reminderDateTime.value = ''
      reminderNote.value = ''
    } else {
      showReminderInputs.value = false
      selectedReminderDays.value = 0
      reminderDateTime.value = ''
      reminderNote.value = ''
      selectedStatusName.value = ''
    }
  } else {
    showReminderFields.value = false
    showReminderInputs.value = false
    selectedReminderDays.value = 0
    reminderDateTime.value = ''
    reminderNote.value = ''
    selectedStatusName.value = ''
  }
}

const loadCustomer = async () => {
  try {
    loading.value = true
    error.value = ''
    const customerId = route.params.id
    const api = useApi()
    const response = await api(`/customers/${customerId}`)

    if (!canAccessCustomer(response)) {
      error.value = t('customer_edit.errors.no_access', 'Bu müşteriye erişim yetkiniz bulunmamaktadır.')
      loading.value = false
      return
    }

    customerData.value = response
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

    if (form.status && statuses.value.length > 0) {
      const selectedStatus = statuses.value.find(s => s.id === parseInt(form.status))
      if (selectedStatus) {
        const isRemindable = selectedStatus.is_remindable || selectedStatus.isRemindable || false
        if (isRemindable) {
          showReminderFields.value = true
          selectedStatusName.value = selectedStatus.name
          const remindingDay = selectedStatus.remindingDay || selectedStatus.reminding_day || 0
          selectedReminderDays.value = remindingDay
        }
      }
    }

    if (response.dynamicFieldValues && response.dynamicFieldValues.length > 0) {
      dynamicFieldValues.value = {}
      response.dynamicFieldValues.forEach(field => {
        if (field.customer_dynamic_field) {
          dynamicFieldValues.value[field.customer_dynamic_field] = field.options_data || field.file || ''
        }
      })
    }
    searchQuery.value = response.referanceCustomerData || ''
  } catch (err) {
    console.error('Müşteri yükleme hatası:', err)
    error.value = t('customer_edit.errors.load_failed', 'Müşteri bilgileri yüklenemedi.')
  } finally {
    loading.value = false
  }
}

const showHistory = () => { showHistoryModal.value = true }
const showNotes = () => { showNotesModal.value = true }
const showDoctorAssignment = () => { showDoctorModal.value = true }
const handleDoctorAssigned = (assignment) => { console.log('Doctor assigned:', assignment) }
const showServices = () => { showServicesModal.value = true }
const handleServicesSaved = () => { console.log('Services saved successfully'); showServicesModal.value = false }
const showFiles = () => { showFilesModal.value = true }

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

const sortedDynamicFields = computed(() => {
  return dynamicFields.value.sort((a, b) => a.order - b.order)
})

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
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
  const fileInput = document.getElementById('image')
  if (fileInput) { fileInput.value = '' }
}

const handleFileUpload = (event, fieldId) => {
  const file = event.target.files[0]
  if (file) {
    dynamicFieldValues.value[fieldId] = file.name
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
    console.error('Dropdown verileri yükleme hatası:', err)
  }
}

const validateForm = () => {
  errors.value = {}
  if (form.website?.trim()) {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
    if (!urlPattern.test(form.website.trim())) {
      errors.value.website = t('customer_edit.errors.website_invalid', 'Geçerli bir web adresi giriniz (örn: https://www.example.com)')
    }
  }
  for (const field of dynamicFields.value) {
    if (field.is_required) {
      const value = dynamicFieldValues.value[field.id]
      if (!value || (typeof value === 'string' && !value.trim())) {
        submitError.value = tp('customer_edit.errors.field_required', { field: field.name }, '"{field}" alanı zorunludur')
        return false
      }
    }
  }
  return Object.keys(errors.value).length === 0
}

const saveCustomer = async () => {
  try {
    if (!validateForm()) { return }
    if (showReminderInputs.value) {
      if (!reminderDateTime.value || !reminderNote.value) {
        submitError.value = t('customer_edit.errors.reminder_required', 'Hatırlatma eklemek için tarih ve not alanları zorunludur.')
        return
      }
    }
    saving.value = true
    errors.value = {}
    submitError.value = ''
    successMessage.value = ''
    const customerId = route.params.id
    const dynamicFieldsData = []
    for (const field of dynamicFields.value) {
      const value = dynamicFieldValues.value[field.id]
      if (value !== undefined && value !== null && value !== '') {
        dynamicFieldsData.push({
          customer_dynamic_field: field.id,
          name: field.name,
          type: field.type,
          file: field.type === 'file' ? value : undefined,
          options_data: field.type === 'file' ? undefined : value,
          order: field.order
        })
      }
    }
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
      relatedTransaction: form.relatedTransaction?.trim() || null
    }
    if (dynamicFieldsData.length > 0) {
      updateData.dynamicFields = dynamicFieldsData
    }
    const api = useApi()
    if (selectedImage.value) {
      const formData = new FormData()
      formData.append('image', selectedImage.value)
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== null && updateData[key] !== undefined) {
          if (typeof updateData[key] === 'object') {
            formData.append(key, JSON.stringify(updateData[key]))
          } else {
            formData.append(key, updateData[key])
          }
        }
      })
      await api(`/customers/${customerId}`, { method: 'PATCH', body: formData })
    } else {
      await api(`/customers/${customerId}`, { method: 'PATCH', body: updateData })
    }
    if (showReminderInputs.value && reminderDateTime.value && reminderNote.value) {
      try {
        const formattedDateTime = new Date(reminderDateTime.value).toISOString()
        const noteData = {
          customer: parseInt(customerId),
          note: reminderNote.value.trim(),
          isReminding: true,
          remindingAt: formattedDateTime,
          noteType: selectedStatusName.value
        }
        await api('/customer-notes', { method: 'POST', body: noteData })
      } catch (noteError) {
        console.error('Customer note creation error:', noteError)
        const errorMessage = noteError.data?.message || noteError.data?.error || 'Bilinmeyen hata'
        submitError.value = tp('customer_edit.success.updated_note_failed', { error: errorMessage }, 'Müşteri bilgileri güncellendi ancak hatırlatma notu kaydedilemedi: {error}')
      }
    }
    successMessage.value = t('customer_edit.success.updated', 'Müşteri bilgileri başarıyla güncellendi!')
    setTimeout(() => { navigateTo(`/customers/show/${customerId}`) }, 2000)
  } catch (err) {
    console.error('Kayıt hatası:', err)
    submitError.value = t('customer_edit.errors.save_failed', 'Güncelleme sırasında bir hata oluştu.')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await loadDropdownData()
  await Promise.all([loadDynamicFields(), loadCustomer()])
})

useHead({
  title: 'Müşteri Düzenle - Valdori CRM'
})
</script>