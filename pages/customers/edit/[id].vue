<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-6xl mx-auto py-6 px-4">
      
      <!-- Başlık -->
      <div class="mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Müşteri Düzenle</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2">Müşteri bilgilerini güncelleyin</p>
          </div>
 
          <!-- İşlemler Butonları -->
          <div class="flex space-x-2">
            <button
              @click="showHistory"
              class="relative group inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              title="Geçmiş"
            >
              <ClockIcon class="h-5 w-5" />
              <span class="ml-1 hidden sm:inline">Geçmiş</span>
            </button>
            <button
              @click="showNotes"
              class="relative group inline-flex items-center rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500"
              title="Notlar"
            >
              <DocumentTextIcon class="h-5 w-5" />
              <span class="ml-1 hidden sm:inline">Notlar</span>
            </button>
            <button
              @click="showDoctorAssignment"
              class="relative group inline-flex items-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500"
              title="Doktor Görüşüne Gönder"
            >
              <UserIcon class="h-5 w-5" />
              <span class="ml-1 hidden sm:inline">Doktor</span>
            </button>
            <button
              @click="showServices"
              class="relative group inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
              title="Hizmetler"
            >
              <ShoppingBagIcon class="h-5 w-5" />
              <span class="ml-1 hidden sm:inline">Hizmetler</span>
            </button>
            <button
              @click="showFiles"
              class="relative group inline-flex items-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500"
              title="Müşteri Dosyaları"
            >
              <FolderIcon class="h-5 w-5" />
              <span class="ml-1 hidden sm:inline">Dosyalar</span>
            </button>
            <NuxtLink
              :to="`/customers/show/${$route.params.id}`"
              class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              title="Görüntüle"
            >
              <EyeIcon class="h-5 w-5 mr-1" />
              Görüntüle
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Yükleniyor mesajı -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-400">Müşteri bilgileri yükleniyor...</span>
      </div>

      <!-- Hata mesajı -->
      <div v-if="error" class="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
        {{ error }}
      </div>

      <!-- Form -->
      <div v-if="!loading && !error" class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <form @submit.prevent="saveCustomer" class="space-y-8">
          
          <!-- Temel Bilgiler -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Temel Bilgiler</h3>

            <!-- Image Upload -->
            <div class="flex justify-center mb-6">
              <div class="w-full max-w-md">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
                  Profil Fotoğrafı
                </label>
                <div class="flex flex-col items-center">
                  <!-- Image Preview -->
                  <div v-if="imagePreview || form.imageUrl" class="mb-4">
                    <img :src="imagePreview || form.imageUrl" alt="Profile" class="h-32 w-32 rounded-full object-cover border-4 border-blue-200 dark:border-blue-700" />
                  </div>
                  <div v-else class="mb-4">
                    <div class="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <UserIcon class="h-16 w-16 text-gray-400" />
                    </div>
                  </div>
                  <!-- File Input -->
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    @change="handleImageUpload"
                    class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200"
                  />
                  <button
                    v-if="imagePreview || form.imageUrl"
                    type="button"
                    @click="removeImage"
                    class="mt-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400"
                  >
                    Fotoğrafı Kaldır
                  </button>
                </div>
              </div>
            </div>

            <!-- Ad Soyad -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ad *
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Müşteri adı"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Soyad *
                </label>
                <input
                  v-model="form.surname"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Müşteri soyadı"
                />
              </div>
            </div>

            <!-- Ünvan ve Cinsiyet -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ünvan
                </label>
                <input
                  v-model="form.title"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ünvan"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cinsiyet
                </label>
                <select
                  v-model="form.gender"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seçiniz</option>
                  <option value="male">Erkek</option>
                  <option value="female">Kadın</option>
                  <option value="other">Diğer</option>
                </select>
              </div>
            </div>

            <!-- Doğum Tarihi ve Kimlik No -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Doğum Tarihi
                </label>
                <input
                  v-model="form.birth_date"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kimlik Numarası
                </label>
                <input
                  v-model="form.identity_number"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="11 haneli kimlik numarası"
                />
              </div>
            </div>
          </div>

          <!-- İletişim Bilgileri -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">İletişim Bilgileri</h3>
            
            <!-- Email Telefon -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  E-posta *
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ornek@email.com"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Telefon
                </label>
                <input
                  v-model="form.phone"
                  type="tel"
                  @input="formatPhoneNumber"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{ 'border-red-300 dark:border-red-500': errors.phone }"
                  placeholder="(5xx) xxx xx xx"
                  maxlength="16"
                />
                <p v-if="errors.phone" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.phone }}</p>
              </div>
            </div>

            <!-- Website ve Dil -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website
                </label>
                <input
                  v-model="form.website"
                  type="url"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{ 'border-red-300 dark:border-red-500': errors.website }"
                  placeholder="https://www.example.com"
                />
                <p v-if="errors.website" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.website }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dil
                </label>
                <input
                  v-model="form.language"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Türkçe, İngilizce, vb."
                />
              </div>
            </div>
          </div>

          <!-- İş Bilgileri -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">İş ve Kaynak Bilgileri</h3>
            
            <!-- Meslek ve Kaynak -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meslek
                </label>
                <input
                  v-model="form.job"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Meslek"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kaynak
                </label>
                <select
                  v-model="form.sourceId"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Kaynak seçiniz</option>
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
                  Referans Müşteri
                </label>
                <select
                  v-model="form.referance_customer"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Referans müşteri seçiniz</option>
                  <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                    {{ customer.name }} {{ customer.surname }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sorumlu Kullanıcı
                </label>
                <select
                  v-model="form.relevant_user"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Kullanıcı seçiniz</option>
                  <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Dinamik Alanlar -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Dinamik Alanlar</h3>
            
            <div v-if="loadingDynamicFields" class="text-center py-4">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p class="text-gray-600 dark:text-gray-400 mt-2">Dinamik alanlar yükleniyor...</p>
            </div>
            
            <div v-else-if="dynamicFields.length === 0" class="text-center py-4">
              <p class="text-gray-500 dark:text-gray-400">Henüz dinamik alan tanımlanmamış.</p>
            </div>
            
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="field in sortedDynamicFields" :key="field.id">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ field.name }}
                  <span v-if="field.is_required" class="text-red-500">*</span>
                </label>
                
                <!-- Text Input -->
                <input
                  v-if="field.type === 'text'"
                  v-model="dynamicFieldValues[field.id]"
                  type="text"
                  :required="field.is_required"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="`${field.name} giriniz`"
                />

                <!-- Number Input -->
                <input
                  v-else-if="field.type === 'number'"
                  v-model.number="dynamicFieldValues[field.id]"
                  type="number"
                  :required="field.is_required"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="`${field.name} giriniz`"
                />

                <!-- Email Input -->
                <input
                  v-else-if="field.type === 'email'"
                  v-model="dynamicFieldValues[field.id]"
                  type="email"
                  :required="field.is_required"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="`${field.name} giriniz`"
                />

                <!-- Phone Input -->
                <input
                  v-else-if="field.type === 'phone'"
                  v-model="dynamicFieldValues[field.id]"
                  type="tel"
                  :required="field.is_required"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="`${field.name} giriniz`"
                />

                <!-- URL Input -->
                <input
                  v-else-if="field.type === 'url'"
                  v-model="dynamicFieldValues[field.id]"
                  type="url"
                  :required="field.is_required"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="`${field.name} giriniz`"
                />

                <!-- Date Input -->
                <input
                  v-else-if="field.type === 'date'"
                  v-model="dynamicFieldValues[field.id]"
                  type="date"
                  :required="field.is_required"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <!-- Select Dropdown -->
                <select
                  v-else-if="field.type === 'select'"
                  v-model="dynamicFieldValues[field.id]"
                  :required="field.is_required"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seçiniz</option>
                  <option
                    v-for="option in parseOptionsData(field.options_data)"
                    :key="option"
                    :value="option"
                  >
                    {{ option }}
                  </option>
                </select>

                <!-- Checkbox -->
                <div v-else-if="field.type === 'checkbox'" class="flex items-center">
                  <input
                    v-model="dynamicFieldValues[field.id]"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ field.name }}</label>
                </div>

                <!-- Textarea -->
                <textarea
                  v-else-if="field.type === 'textarea'"
                  v-model="dynamicFieldValues[field.id]"
                  rows="3"
                  :required="field.is_required"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="`${field.name} giriniz`"
                ></textarea>

                <!-- File Input -->
                <input
                  v-else-if="field.type === 'file'"
                  type="file"
                  :required="field.is_required"
                  @change="handleFileUpload($event, field.id)"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <!-- Konum Bilgileri -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Konum Bilgileri</h3>
            
            <!-- Ülke ve İl -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ülke
                </label>
                <select
                  v-model="form.country"
                  @change="onCountryChange"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Ülke seçiniz</option>
                  <option v-for="country in countries" :key="country.id" :value="country.id">
                    {{ country.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  İl
                </label>
                <select
                  v-model="form.state"
                  @change="onStateChange"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :disabled="!form.country"
                >
                  <option value="">İl seçiniz</option>
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
                  İlçe
                </label>
                <select
                  v-model="form.city"
                  @change="onCityChange"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :disabled="!form.state"
                >
                  <option value="">İlçe seçiniz</option>
                  <option v-for="city in filteredCities" :key="city.id" :value="city.id">
                    {{ city.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mahalle
                </label>
                <input
                  v-model="form.district"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mahalle adı giriniz"
                />
              </div>
            </div>

            <!-- Posta Kodu ve Adres -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Posta Kodu
                </label>
                <input
                  v-model="form.postalCode"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="12345"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Açık Adres
                </label>
                <textarea
                  v-model="form.address"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Detaylı adres bilgisi..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Durum ve Açıklama -->
          <div class="pb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Durum ve Açıklamalar</h3>
            
            <!-- Durum ve Aktiflik -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Durum
                </label>
                <select
                  v-model="form.status"
                  @change="onStatusChange"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Durum seçiniz</option>
                  <option v-for="status in statuses" :key="status.id" :value="status.id">
                    {{ status.name }}
                  </option>
                </select>
              </div>
              <div class="flex items-center">
                <label class="flex items-center">
                  <input
                    v-model="form.isActive"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Aktif müşteri</span>
                </label>
              </div>
            </div>

            <!-- Hatırlatma Alanları -->
            <div v-if="showReminderFields" class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Hatırlatma Bilgisi</h4>

              <!-- Reminding Day Info -->
              <div class="mb-4">
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  <span class="font-semibold">{{ selectedReminderDays }} gün sonra aranacak</span>
                </p>
              </div>

              <!-- Add Reminder Button -->
              <div v-if="!showReminderInputs" class="mb-4">
                <button
                  type="button"
                  @click="showReminderInputs = true"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Hatırlatma da ekle
                </button>
              </div>

              <!-- Reminder Input Fields -->
              <div v-if="showReminderInputs">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hatırlatma Tarihi ve Saati *
                    </label>
                    <input
                      v-model="reminderDateTime"
                      type="datetime-local"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Not Tipi
                    </label>
                    <input
                      v-model="selectedStatusName"
                      type="text"
                      readonly
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hatırlatma Notu *
                  </label>
                  <textarea
                    v-model="reminderNote"
                    rows="3"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Hatırlatma için not giriniz..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Açıklama -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Açıklama
              </label>
              <textarea
                v-model="form.description"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Müşteri hakkında notlar..."
              ></textarea>
            </div>

            <!-- İlgili İşlem -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                İlgili İşlem
              </label>
              <textarea
                v-model="form.relatedTransaction"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="İlgili işlem bilgisi..."
              ></textarea>
            </div>
          </div>

          <!-- Başarı mesajı -->
          <div v-if="successMessage" class="bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded mb-6">
            {{ successMessage }}
          </div>

          <!-- Submit hatası -->
          <div v-if="submitError" class="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
            {{ submitError }}
          </div>

          <!-- Butonlar -->
          <div class="flex justify-end space-x-4">
            <NuxtLink
              :to="`/customers/show/${$route.params.id}`"
              class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              İptal
            </NuxtLink>
            <button
              type="submit"
              :disabled="saving"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ saving ? 'Kaydediliyor...' : 'Kaydet' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Customer History Modal -->
    <CustomerHistoryModal
      :show="showHistoryModal"
      :customer="customerData"
      @close="showHistoryModal = false"
    />

    <!-- Customer Notes Modal -->
    <CustomerNotesModal
      :show="showNotesModal"
      :customer="customerData"
      @close="showNotesModal = false"
      @customer-updated="loadCustomer"
    />

    <!-- Doctor Assignment Modal -->
    <DoctorAssignmentModal
      :show="showDoctorModal"
      :customer="customerData"
      @close="showDoctorModal = false"
      @assigned="handleDoctorAssigned"
    />

    <!-- Customer Services Modal -->
    <CustomerServicesModal
      :show="showServicesModal"
      :customer="customerData"
      @close="showServicesModal = false"
      @saved="handleServicesSaved"
    />

    <!-- Customer Files Modal -->
    <CustomerFilesModal
      :show="showFilesModal"
      :customer="customerData"
      @close="showFilesModal = false"
    />
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

const route = useRoute()

// Permissions
const { canAccessCustomer } = usePermissions()

// Use dynamic fields composable
const { getDynamicFields, parseOptionsData } = useCustomerDynamicFields()

const loading = ref(true)
const saving = ref(false)
const error = ref('')
const errors = ref({})
const successMessage = ref('')
const submitError = ref('')

// Data sources
const countries = ref([])
const states = ref([])
const cities = ref([])
const sources = ref([])
const statuses = ref([])
const users = ref([])
const customers = ref([])

// Customer data for modals
const customerData = ref(null)

// Modal states
const showHistoryModal = ref(false)
const showNotesModal = ref(false)
const showDoctorModal = ref(false)
const showServicesModal = ref(false)
const showFilesModal = ref(false)

// Dynamic fields data
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
  imageUrl: ''
})

// Image upload
const selectedImage = ref(null)
const imagePreview = ref(null)

// Reminder fields
const showReminderFields = ref(false)
const showReminderInputs = ref(false)
const selectedReminderDays = ref(0)
const reminderDateTime = ref('')
const reminderNote = ref('')
const selectedStatusName = ref('')

// Filtered location arrays
const filteredStates = computed(() => {
  return form.country ? states.value.filter(s => s.country === parseInt(form.country)) : []
})

const filteredCities = computed(() => {
  return form.state ? cities.value.filter(c => c.state === parseInt(form.state)) : []
})

// Location change handlers
const onCountryChange = () => {
  form.state = ''
  form.city = ''
  form.district = ''
}

const onStateChange = () => {
  form.city = ''
  form.district = ''
}

const onCityChange = () => {
  // District is now a text field, no need to reset
}

// Check if selected status is remindable
const onStatusChange = () => {
  console.log('Status changed to:', form.status)
  console.log('All statuses:', statuses.value)

  const selectedStatus = statuses.value.find(s => s.id === parseInt(form.status))
  console.log('Selected status:', selectedStatus)

  if (selectedStatus) {
    // Check both is_remindable and isRemindable (different API response formats)
    const isRemindable = selectedStatus.is_remindable || selectedStatus.isRemindable || false
    console.log('Is remindable:', isRemindable)

    showReminderFields.value = isRemindable
    selectedStatusName.value = selectedStatus.name

    if (isRemindable) {
      // Get reminding day from status
      const remindingDay = selectedStatus.remindingDay || selectedStatus.reminding_day || 0
      selectedReminderDays.value = remindingDay
      // Reset input fields when status changes
      showReminderInputs.value = false
      reminderDateTime.value = ''
      reminderNote.value = ''
    } else {
      // Reset all reminder fields if not remindable
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

    // Check if user has permission to access this customer
    if (!canAccessCustomer(response)) {
      error.value = 'Bu müşteriye erişim yetkiniz bulunmamaktadır.'
      loading.value = false
      return
    }

    // Store customer data for modals
    customerData.value = response

    // Form verilerini set et
    Object.assign(form, {
      name: response.name || '',
      surname: response.surname || '',
      title: response.title || '',
      email: response.email || '',
      gender: response.gender || '',
      birth_date: response.birthDate || response.birth_date || '',
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
      imageUrl: response.image || response.imageUrl || ''
    })

    // Check if loaded status is remindable
    // Note: loadDropdownData is already called in onMounted, no need to call again
    if (form.status && statuses.value.length > 0) {
      const selectedStatus = statuses.value.find(s => s.id === parseInt(form.status))
      console.log('Customer current status:', selectedStatus)

      if (selectedStatus) {
        // Check both is_remindable and isRemindable (different API response formats)
        const isRemindable = selectedStatus.is_remindable || selectedStatus.isRemindable || false
        if (isRemindable) {
          showReminderFields.value = true
          selectedStatusName.value = selectedStatus.name
          // Get reminding day from status
          const remindingDay = selectedStatus.remindingDay || selectedStatus.reminding_day || 0
          selectedReminderDays.value = remindingDay
        }
      }
    }

    // Load customer dynamic fields from response
    if (response.dynamicFieldValues && response.dynamicFieldValues.length > 0) {
      // Reset dynamic field values
      dynamicFieldValues.value = {}

      // Set values from customer's dynamic fields
      response.dynamicFieldValues.forEach(field => {
        if (field.customer_dynamic_field) {
          dynamicFieldValues.value[field.customer_dynamic_field] = field.options_data || field.file || ''
        }
      })
    }

  } catch (err) {
    console.error('Müşteri yükleme hatası:', err)
    error.value = 'Müşteri bilgileri yüklenemedi.'
  } finally {
    loading.value = false
  }
}

// Modal functions
const showHistory = () => {
  showHistoryModal.value = true
}

const showNotes = () => {
  showNotesModal.value = true
}

const showDoctorAssignment = () => {
  showDoctorModal.value = true
}

const handleDoctorAssigned = (assignment) => {
  console.log('Doctor assigned:', assignment)
  // Optionally refresh customer data or show success message
}

const showServices = () => {
  showServicesModal.value = true
}

const handleServicesSaved = () => {
  console.log('Services saved successfully')
  showServicesModal.value = false
}

const showFiles = () => {
  showFilesModal.value = true
}

// Load dynamic fields
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


// Computed properties
const sortedDynamicFields = computed(() => {
  return dynamicFields.value.sort((a, b) => a.order - b.order)
})

// Handle image upload
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedImage.value = file
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Remove image
const removeImage = () => {
  selectedImage.value = null
  imagePreview.value = null
  form.imageUrl = ''
  // Reset file input
  const fileInput = document.getElementById('image')
  if (fileInput) {
    fileInput.value = ''
  }
}

// Handle file upload
const handleFileUpload = (event, fieldId) => {
  const file = event.target.files[0]
  if (file) {
    // For now, just store the file name
    // In a real implementation, you'd upload the file to the server
    dynamicFieldValues.value[fieldId] = file.name
  }
}

const loadDropdownData = async () => {
  try {
    const api = useApi()
    // Paralel API çağrıları yap
    const [
      countriesRes,
      statesRes,
      citiesRes,
      sourcesRes,
      statusesRes,
      usersRes,
      customersRes
    ] = await Promise.all([
      api('/countries').catch(() => []),
      api('/states').catch(() => []),
      api('/cities').catch(() => []),
      api('/sources').catch(() => []),
      api('/statuses').catch((err) => {
        console.error('Status API error:', err)
        // Fallback to static data if API fails
        return [
          { id: 1, name: 'Yeni', is_remindable: false },
          { id: 2, name: 'Potansiyel', is_remindable: true },
          { id: 3, name: 'Müşteri', is_remindable: false },
          { id: 4, name: 'VIP', is_remindable: false },
          { id: 5, name: 'Eski Müşteri', is_remindable: true },
          { id: 6, name: 'İptal', is_remindable: false }
        ]
      }),
      api('/users').catch(() => []),
      api('/customers').catch(() => [])
    ])

    countries.value = countriesRes
    states.value = statesRes
    cities.value = citiesRes
    sources.value = sourcesRes.data || sourcesRes || []
    statuses.value = statusesRes.data || statusesRes || []
    console.log('Loaded statuses:', statuses.value)
    users.value = usersRes.data || usersRes
    customers.value = customersRes.data || customersRes
    
  } catch (err) {
    console.error('Dropdown verileri yükleme hatası:', err)
  }
}

// Format phone number to (5xx) xxx xx xx
const formatPhoneNumber = (event) => {
  let value = event.target.value.replace(/\D/g, '')

  if (value.length > 0) {
    if (value.length <= 3) {
      value = `(${value}`
    } else if (value.length <= 6) {
      value = `(${value.slice(0, 3)}) ${value.slice(3)}`
    } else if (value.length <= 8) {
      value = `(${value.slice(0, 3)}) ${value.slice(3, 6)} ${value.slice(6)}`
    } else {
      value = `(${value.slice(0, 3)}) ${value.slice(3, 6)} ${value.slice(6, 8)} ${value.slice(8, 10)}`
    }
  }

  form.phone = value
}

// Validate form
const validateForm = () => {
  errors.value = {}

  if (form.phone?.trim()) {
    const phoneDigits = form.phone.replace(/\D/g, '')
    if (phoneDigits.length !== 10 || !phoneDigits.startsWith('5')) {
      errors.value.phone = 'Telefon numarası (5xx) xxx xx xx formatında olmalıdır'
    }
  }

  if (form.website?.trim()) {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
    if (!urlPattern.test(form.website.trim())) {
      errors.value.website = 'Geçerli bir web adresi giriniz (örn: https://www.example.com)'
    }
  }

  // Validate required dynamic fields
  for (const field of dynamicFields.value) {
    if (field.is_required) {
      const value = dynamicFieldValues.value[field.id]
      if (!value || (typeof value === 'string' && !value.trim())) {
        submitError.value = `"${field.name}" alanı zorunludur`
        return false
      }
    }
  }

  return Object.keys(errors.value).length === 0
}

const saveCustomer = async () => {
  try {
    // Validate form
    if (!validateForm()) {
      return
    }

    // Validate reminder fields if status is remindable and user wants to add reminder
    if (showReminderInputs.value) {
      if (!reminderDateTime.value || !reminderNote.value) {
        submitError.value = 'Hatırlatma eklemek için tarih ve not alanları zorunludur.'
        return
      }
    }

    saving.value = true
    errors.value = {}
    submitError.value = ''
    successMessage.value = ''
    
    const customerId = route.params.id
    // Add dynamic fields if any have values
    const dynamicFieldsData = []
    for (const field of dynamicFields.value) {
      const value = dynamicFieldValues.value[field.id]
      if (value !== undefined && value !== null && value !== '') {
        dynamicFieldsData.push({
          customer_dynamic_field: field.id,
          name: field.name,
          type: field.type,
          file: field.type === 'file' ? value : undefined,
          options_data: field.type === 'file' ? undefined : value, // Use value for non-file fields
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

    // Add dynamic fields to update data
    if (dynamicFieldsData.length > 0) {
      updateData.dynamicFields = dynamicFieldsData
    }

    const api = useApi()

    // Use FormData if image is selected
    if (selectedImage.value) {
      const formData = new FormData()
      formData.append('image', selectedImage.value)

      // Append all update data to FormData
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== null && updateData[key] !== undefined) {
          // For arrays and objects, stringify them
          if (typeof updateData[key] === 'object') {
            formData.append(key, JSON.stringify(updateData[key]))
          } else {
            formData.append(key, updateData[key])
          }
        }
      })

      await api(`/customers/${customerId}`, {
        method: 'PATCH',
        body: formData
      })
    } else {
      await api(`/customers/${customerId}`, {
        method: 'PATCH',
        body: updateData
      })
    }
    
    // Create customer note only if user clicked "Add Reminder" button and filled the fields
    if (showReminderInputs.value && reminderDateTime.value && reminderNote.value) {
      try {
        // Format the datetime to ISO string format
        const formattedDateTime = new Date(reminderDateTime.value).toISOString()

        const noteData = {
          customer: parseInt(customerId),
          note: reminderNote.value.trim(),
          isReminding: true,
          remindingAt: formattedDateTime,
          noteType: selectedStatusName.value
        }

        console.log('Sending customer note data:', noteData)

        await api('/customer-notes', {
          method: 'POST',
          body: noteData
        })

        console.log('Customer note created successfully')
      } catch (noteError) {
        console.error('Customer note creation error:', noteError)
        console.error('Error response data:', noteError.data)
        console.error('Error response status:', noteError.status)
        console.error('Full error object:', noteError)

        // Check if there's a specific error message from the API
        const errorMessage = noteError.data?.message || noteError.data?.error || 'Bilinmeyen hata'

        // Don't block the main save operation if note creation fails
        // But show a warning to the user with specific error
        submitError.value = `Müşteri bilgileri güncellendi ancak hatırlatma notu kaydedilemedi: ${errorMessage}`
      }
    }
    
    successMessage.value = 'Müşteri bilgileri başarıyla güncellendi!'
    
    // 2 saniye sonra detay sayfasına yönlendir
    setTimeout(() => {
      navigateTo(`/customers/show/${customerId}`)
    }, 2000)
    
  } catch (err) {
    console.error('Kayıt hatası:', err)
    submitError.value = 'Güncelleme sırasında bir hata oluştu.'
  } finally {
    saving.value = false
  }
}

// Sayfa yüklendiğinde verileri getir
onMounted(async () => {
  // First load dropdown data (including statuses)
  await loadDropdownData()
  // Then load dynamic fields and customer data in parallel
  await Promise.all([
    loadDynamicFields(),
    loadCustomer()
  ])
})

useHead({
  title: 'Müşteri Düzenle - Valdori CRM'
})
</script> 