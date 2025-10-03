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
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 backdrop-blur-sm transition-opacity" 
          @click="$emit('close')"
        ></div>
        
        <!-- Modal -->
        <div class="flex min-h-screen items-center justify-center p-4">
          <Transition
            enter-active-class="duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div v-if="show" class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all sm:w-full sm:max-w-4xl">
              <!-- Progress Bar -->
              <div class="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
                <div 
                  class="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                  :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
                ></div>
              </div>

              <!-- Header -->
              <div class="relative bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-white">
                <button
                  @click="$emit('close')"
                  class="absolute right-4 top-4 rounded-lg p-2 hover:bg-white/20 transition-colors"
                >
                  <XMarkIcon class="h-5 w-5" />
                </button>
                
                <div class="flex items-center space-x-4">
                  <div class="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                    <UserPlusIcon class="h-8 w-8" />
                  </div>
                  <div>
                    <h2 class="text-2xl font-bold">Yeni Müşteri Ekle</h2>
                    <p class="text-indigo-100">Adım {{ currentStep }} / {{ totalSteps }}</p>
                  </div>
                </div>

                <!-- Step Indicators -->
                <div class="mt-6 flex justify-between">
                  <div 
                    v-for="step in steps" 
                    :key="step.id"
                    class="flex flex-1 items-center"
                  >
                    <div class="flex flex-col items-center flex-1">
                      <div 
                        class="flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all"
                        :class="[
                          currentStep >= step.id 
                            ? 'bg-white text-indigo-600 border-white' 
                            : 'border-white/50 text-white/70'
                        ]"
                      >
                        <component 
                          v-if="currentStep > step.id" 
                          :is="CheckIcon" 
                          class="h-5 w-5"
                        />
                        <span v-else class="text-sm font-semibold">{{ step.id }}</span>
                      </div>
                      <span 
                        class="mt-2 text-xs font-medium"
                        :class="currentStep >= step.id ? 'text-white' : 'text-white/70'"
                      >
                        {{ step.title }}
                      </span>
                    </div>
                    <div 
                      v-if="step.id < totalSteps"
                      class="flex-1 h-0.5 mx-2 mt-[-20px]"
                      :class="currentStep > step.id ? 'bg-white' : 'bg-white/30'"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Form Content -->
              <form @submit.prevent="handleSubmit" class="p-6">
                <div class="min-h-[400px]">
                  <!-- Step 1: Temel Bilgiler -->
                  <Transition
                    enter-active-class="duration-300 ease-out"
                    enter-from-class="opacity-0 translate-x-4"
                    enter-to-class="opacity-100 translate-x-0"
                    leave-active-class="duration-200 ease-in"
                    leave-from-class="opacity-100 translate-x-0"
                    leave-to-class="opacity-0 -translate-x-4"
                  >
                    <div v-if="currentStep === 1" class="space-y-6">
                      <!-- Image Upload -->
                      <div class="flex justify-center">
                        <div class="w-full max-w-md">
                          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
                            Profil Fotoğrafı
                          </label>
                          <div class="flex flex-col items-center">
                            <!-- Image Preview -->
                            <div v-if="imagePreview" class="mb-4">
                              <img :src="imagePreview" alt="Preview" class="h-32 w-32 rounded-full object-cover border-4 border-indigo-200 dark:border-indigo-700" />
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
                              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900 dark:file:text-indigo-200"
                            />
                            <button
                              v-if="imagePreview"
                              type="button"
                              @click="removeImage"
                              class="mt-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400"
                            >
                              Fotoğrafı Kaldır
                            </button>
                          </div>
                        </div>
                      </div>

                      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <!-- Name -->
                        <div>
                          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <UserIcon class="inline h-4 w-4 mr-1" />
                            Ad <span class="text-red-500">*</span>
                          </label>
                          <input
                            id="name"
                            v-model="form.name"
                            type="text"
                            required
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 transition-all"
                            placeholder="Müşteri adı"
                          />
                          <p v-if="errors.name" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ errors.name }}</p>
                        </div>

                        <!-- Surname -->
                        <div>
                          <label for="surname" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <UserIcon class="inline h-4 w-4 mr-1" />
                            Soyad <span class="text-red-500">*</span>
                          </label>
                          <input
                            id="surname"
                            v-model="form.surname"
                            type="text"
                            required
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 transition-all"
                            placeholder="Müşteri soyadı"
                          />
                          <p v-if="errors.surname" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ errors.surname }}</p>
                        </div>

                        <!-- Email -->
                        <div>
                          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <EnvelopeIcon class="inline h-4 w-4 mr-1" />
                            E-posta <span class="text-red-500">*</span>
                          </label>
                          <input
                            id="email"
                            v-model="form.email"
                            type="email"
                            required
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 transition-all"
                            placeholder="ornek@email.com"
                          />
                          <p v-if="errors.email" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ errors.email }}</p>
                        </div>

                        <!-- Phone -->
                        <div>
                          <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <PhoneIcon class="inline h-4 w-4 mr-1" />
                            Telefon <span class="text-red-500">*</span>
                          </label>
                          <input
                            id="phone"
                            v-model="form.phone"
                            type="tel"
                            required
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 transition-all"
                            placeholder="(555) 123-4567"
                          />
                          <p v-if="errors.phone" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ errors.phone }}</p>
                        </div>

                        <!-- Gender -->
                        <div>
                          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <UserGroupIcon class="inline h-4 w-4 mr-1" />
                            Cinsiyet
                          </label>
                          <div class="flex space-x-4">
                            <label class="flex items-center">
                              <input
                                v-model="form.gender"
                                type="radio"
                                value="male"
                                class="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-600"
                              />
                              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Erkek</span>
                            </label>
                            <label class="flex items-center">
                              <input
                                v-model="form.gender"
                                type="radio"
                                value="female"
                                class="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-600"
                              />
                              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Kadın</span>
                            </label>
                            <label class="flex items-center">
                              <input
                                v-model="form.gender"
                                type="radio"
                                value="other"
                                class="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-600"
                              />
                              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Diğer</span>
                            </label>
                          </div>
                        </div>

                        <!-- Birth Date -->
                        <div>
                          <label for="birth_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <CalendarIcon class="inline h-4 w-4 mr-1" />
                            Doğum Tarihi
                          </label>
                          <input
                            id="birth_date"
                            v-model="form.birth_date"
                            type="date"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </Transition>

                  <!-- Step 2: İş Bilgileri -->
                  <Transition
                    enter-active-class="duration-300 ease-out"
                    enter-from-class="opacity-0 translate-x-4"
                    enter-to-class="opacity-100 translate-x-0"
                    leave-active-class="duration-200 ease-in"
                    leave-from-class="opacity-100 translate-x-0"
                    leave-to-class="opacity-0 -translate-x-4"
                  >
                    <div v-if="currentStep === 2" class="space-y-6">
                      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <!-- Title -->
                        <div>
                          <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <BriefcaseIcon class="inline h-4 w-4 mr-1" />
                            Ünvan
                          </label>
                          <input
                            id="title"
                            v-model="form.title"
                            type="text"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 transition-all"
                            placeholder="Genel Müdür, Müdür, vs."
                          />
                        </div>

                        <!-- Job -->
                        <div>
                          <label for="job" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <AcademicCapIcon class="inline h-4 w-4 mr-1" />
                            Meslek
                          </label>
                          <input
                            id="job"
                            v-model="form.job"
                            type="text"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 transition-all"
                            placeholder="Yazılım Geliştirici, Tasarımcı, vs."
                          />
                        </div>

                        <!-- Company -->
                        <div>
                          <label for="company" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <BuildingOfficeIcon class="inline h-4 w-4 mr-1" />
                            Şirket
                          </label>
                          <input
                            id="company"
                            v-model="form.company"
                            type="text"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 transition-all"
                            placeholder="ABC Teknoloji Ltd. Şti."
                          />
                        </div>

                        <!-- Website -->
                        <div>
                          <label for="website" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <GlobeAltIcon class="inline h-4 w-4 mr-1" />
                            Website
                          </label>
                          <input
                            id="website"
                            v-model="form.website"
                            type="url"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 transition-all"
                            placeholder="https://www.example.com"
                          />
                        </div>

                        <!-- Source -->
                        <div>
                          <label for="source" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <SparklesIcon class="inline h-4 w-4 mr-1" />
                            Müşteri Kaynağı
                          </label>
                          <select
                            id="source"
                            v-model="form.source_id"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 transition-all"
                          >
                            <option value="">Kaynak seçin</option>
                            <option v-for="source in sources" :key="source.id" :value="source.id">
                              {{ source.name }}
                            </option>
                          </select>
                        </div>

                        <!-- Status -->
                        <div>
                          <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <FlagIcon class="inline h-4 w-4 mr-1" />
                            Müşteri Durumu
                          </label>
                          <select
                            id="status"
                            v-model="form.status"
                            disabled
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 dark:bg-gray-700 transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
                          >
                            <option value="">Durum seçin</option>
                            <option v-for="status in statuses" :key="status.id" :value="status.id">
                              {{ status.name }}
                            </option>
                          </select>
                        </div>
                      </div>

                      <!-- Active Status -->
                      <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div>
                          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Müşteri Durumu</label>
                          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Müşteri ile aktif olarak çalışıyor musunuz?</p>
                        </div>
                        <button
                          type="button"
                          @click="form.isActive = !form.isActive"
                          :class="[
                            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                            form.isActive ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-600'
                          ]"
                        >
                          <span
                            :class="[
                              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                              form.isActive ? 'translate-x-6' : 'translate-x-1'
                            ]"
                          />
                        </button>
                      </div>
                    </div>
                  </Transition>

                  <!-- Step 3: Adres Bilgileri -->
                  <Transition
                    enter-active-class="duration-300 ease-out"
                    enter-from-class="opacity-0 translate-x-4"
                    enter-to-class="opacity-100 translate-x-0"
                    leave-active-class="duration-200 ease-in"
                    leave-from-class="opacity-100 translate-x-0"
                    leave-to-class="opacity-0 -translate-x-4"
                  >
                    <div v-if="currentStep === 3" class="space-y-6">
                      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <!-- Country -->
                        <div>
                          <label for="country" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <MapPinIcon class="inline h-4 w-4 mr-1" />
                            Ülke
                          </label>
                          <select
                            id="country"
                            v-model="form.country"
                            @change="onCountryChange"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 transition-all"
                            :disabled="loadingCountries"
                          >
                            <option value="">Ülke seçin</option>
                            <option v-for="country in countries" :key="country.id" :value="country.id">
                              {{ country.name }}
                            </option>
                          </select>
                        </div>

                        <!-- State -->
                        <div>
                          <label for="state" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <MapIcon class="inline h-4 w-4 mr-1" />
                            Eyalet/İl
                          </label>
                          <select
                            id="state"
                            v-model="form.state"
                            @change="onStateChange"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 transition-all"
                            :disabled="!form.country || loadingStates"
                          >
                            <option value="">{{ form.country ? 'Eyalet/İl seçin' : 'Önce ülke seçin' }}</option>
                            <option v-for="state in states" :key="state.id" :value="state.id">
                              {{ state.name }}
                            </option>
                          </select>
                        </div>

                        <!-- City -->
                        <div>
                          <label for="city" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <BuildingLibraryIcon class="inline h-4 w-4 mr-1" />
                            Şehir
                          </label>
                          <select
                            id="city"
                            v-model="form.city"
                            @change="onCityChange"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 transition-all"
                            :disabled="!form.state || loadingCities"
                          >
                            <option value="">{{ form.state ? 'Şehir seçin' : 'Önce eyalet/il seçin' }}</option>
                            <option v-for="city in cities" :key="city.id" :value="city.id">
                              {{ city.name }}
                            </option>
                          </select>
                        </div>

                        <!-- District -->
                        <div>
                          <label for="district" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <HomeIcon class="inline h-4 w-4 mr-1" />
                            İlçe
                          </label>
                          <input
                            id="district"
                            v-model="form.district"
                            type="text"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 transition-all"
                            placeholder="İlçe adını giriniz"
                          />
                        </div>

                        <!-- Postal Code -->
                        <div>
                          <label for="postal_code" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <HashtagIcon class="inline h-4 w-4 mr-1" />
                            Posta Kodu
                          </label>
                          <input
                            id="postal_code"
                            v-model="form.postal_code"
                            type="text"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 transition-all"
                            placeholder="34000"
                          />
                        </div>
                      </div>

                      <!-- Address -->
                      <div>
                        <label for="address" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <MapPinIcon class="inline h-4 w-4 mr-1" />
                          Adres
                        </label>
                        <textarea
                          id="address"
                          v-model="form.address"
                          rows="3"
                          class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 transition-all"
                          placeholder="Detaylı adres bilgisi..."
                        ></textarea>
                      </div>

                      <!-- Description -->
                      <div>
                        <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <DocumentTextIcon class="inline h-4 w-4 mr-1" />
                          Notlar
                        </label>
                        <textarea
                          id="description"
                          v-model="form.description"
                          rows="3"
                          class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 transition-all"
                          placeholder="Müşteri hakkında özel notlar..."
                        ></textarea>
                      </div>

                      <!-- Related Transaction -->
                      <div>
                        <label for="relatedTransaction" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <DocumentTextIcon class="inline h-4 w-4 mr-1" />
                          İlgili İşlem
                        </label>
                        <textarea
                          id="relatedTransaction"
                          v-model="form.relatedTransaction"
                          rows="3"
                          class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 transition-all"
                          placeholder="İlgili işlem bilgisi..."
                        ></textarea>
                      </div>
                    </div>
                  </Transition>

                  <!-- Step 4: Dinamik Alanlar -->
                  <Transition
                    enter-active-class="duration-300 ease-out"
                    enter-from-class="opacity-0 translate-x-4"
                    enter-to-class="opacity-100 translate-x-0"
                    leave-active-class="duration-200 ease-in"
                    leave-from-class="opacity-100 translate-x-0"
                    leave-to-class="opacity-0 -translate-x-4"
                  >
                    <div v-if="currentStep === 4" class="space-y-6">
                      <div v-if="loadingDynamicFields" class="text-center py-8">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p class="text-gray-600 dark:text-gray-400 mt-3">Dinamik alanlar yükleniyor...</p>
                      </div>
                      
                      <div v-else-if="dynamicFields.length === 0" class="text-center py-8">
                        <DocumentTextIcon class="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p class="text-gray-500 dark:text-gray-400">Henüz dinamik alan tanımlanmamış.</p>
                        <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Dinamik alan eklemek için sistem ayarlarına gidin.</p>
                      </div>
                      
                      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div v-for="field in sortedDynamicFields" :key="field.id">
                          <label :for="`dynamic-${field.id}`" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ field.name }}
                          </label>
                          
                          <!-- Text Input -->
                          <input
                            v-if="field.type === 'text'"
                            :id="`dynamic-${field.id}`"
                            v-model="dynamicFieldValues[field.id]"
                            type="text"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 transition-all"
                            :placeholder="`${field.name} giriniz`"
                          />
                          
                          <!-- Number Input -->
                          <input
                            v-else-if="field.type === 'number'"
                            :id="`dynamic-${field.id}`"
                            v-model.number="dynamicFieldValues[field.id]"
                            type="number"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 transition-all"
                            :placeholder="`${field.name} giriniz`"
                          />
                          
                          <!-- Email Input -->
                          <input
                            v-else-if="field.type === 'email'"
                            :id="`dynamic-${field.id}`"
                            v-model="dynamicFieldValues[field.id]"
                            type="email"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 transition-all"
                            :placeholder="`${field.name} giriniz`"
                          />
                          
                          <!-- Phone Input -->
                          <input
                            v-else-if="field.type === 'phone'"
                            :id="`dynamic-${field.id}`"
                            v-model="dynamicFieldValues[field.id]"
                            type="tel"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 transition-all"
                            :placeholder="`${field.name} giriniz`"
                          />
                          
                          <!-- URL Input -->
                          <input
                            v-else-if="field.type === 'url'"
                            :id="`dynamic-${field.id}`"
                            v-model="dynamicFieldValues[field.id]"
                            type="url"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 transition-all"
                            :placeholder="`${field.name} giriniz`"
                          />
                          
                          <!-- Date Input -->
                          <input
                            v-else-if="field.type === 'date'"
                            :id="`dynamic-${field.id}`"
                            v-model="dynamicFieldValues[field.id]"
                            type="date"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 transition-all"
                          />
                          
                          <!-- Select Dropdown -->
                          <select
                            v-else-if="field.type === 'select'"
                            :id="`dynamic-${field.id}`"
                            v-model="dynamicFieldValues[field.id]"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 transition-all"
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
                          
                          <!-- Textarea -->
                          <textarea
                            v-else-if="field.type === 'textarea'"
                            :id="`dynamic-${field.id}`"
                            v-model="dynamicFieldValues[field.id]"
                            rows="3"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 transition-all"
                            :placeholder="`${field.name} giriniz`"
                          ></textarea>
                          
                          <!-- File Input -->
                          <input
                            v-else-if="field.type === 'file'"
                            :id="`dynamic-${field.id}`"
                            type="file"
                            @change="handleFileUpload($event, field.id)"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </Transition>
                </div>

                <!-- Error/Success Messages -->
                <div v-if="errorMessage" class="mt-4 rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
                  <div class="flex">
                    <XCircleIcon class="h-5 w-5 text-red-400" />
                    <div class="ml-3">
                      <p class="text-sm text-red-700 dark:text-red-300">{{ errorMessage }}</p>
                    </div>
                  </div>
                </div>

                <div v-if="successMessage" class="mt-4 rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
                  <div class="flex">
                    <CheckCircleIcon class="h-5 w-5 text-green-400" />
                    <div class="ml-3">
                      <p class="text-sm text-green-700 dark:text-green-300">{{ successMessage }}</p>
                    </div>
                  </div>
                </div>

                <!-- Footer Actions -->
                <div class="mt-8 flex items-center justify-between border-t dark:border-gray-700 pt-6">
                  <button
                    v-if="currentStep > 1"
                    type="button"
                    @click="prevStep"
                    class="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ArrowLeftIcon class="mr-2 h-4 w-4" />
                    Geri
                  </button>
                  <div v-else></div>

                  <div class="flex items-center space-x-3">
                    <button
                      type="button"
                      @click="$emit('close')"
                      class="inline-flex items-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      İptal
                    </button>
                    
                    <button
                      v-if="currentStep < totalSteps"
                      type="button"
                      @click="nextStep"
                      class="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                    >
                      İleri
                      <ArrowRightIcon class="ml-2 h-4 w-4" />
                    </button>
                    
                    <button
                      v-else
                      type="submit"
                      :disabled="loading"
                      class="inline-flex items-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2 text-sm font-medium text-white hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <CheckIcon v-if="!loading" class="mr-2 h-4 w-4" />
                      <svg v-else class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {{ loading ? 'Kaydediliyor...' : 'Müşteri Oluştur' }}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { 
  XMarkIcon, 
  UserPlusIcon,
  CheckIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserGroupIcon,
  CalendarIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  SparklesIcon,
  FlagIcon,
  MapPinIcon,
  MapIcon,
  BuildingLibraryIcon,
  HomeIcon,
  HashtagIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  XCircleIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'
import { computed, reactive, ref, watch } from 'vue'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close', 'created'])

// Use dynamic fields composable
const { getDynamicFields, parseOptionsData, createDynamicFieldValue, createBulkDynamicFieldValues } = useCustomerDynamicFields()

// Step management
const currentStep = ref(1)
const totalSteps = 4

const steps = [
  { id: 1, title: 'Temel Bilgiler' },
  { id: 2, title: 'İş Bilgileri' },
  { id: 3, title: 'Adres ve Notlar' },
  { id: 4, title: 'Dinamik Alanlar' }
]

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// Form data
const form = reactive({
  name: '',
  surname: '',
  email: '',
  phone: '',
  gender: '',
  birth_date: '',
  title: '',
  job: '',
  company: '',
  website: '',
  source_id: null,
  status: null,
  country: null,
  state: null,
  city: null,
  district: null,
  postal_code: '',
  address: '',
  description: '',
  relatedTransaction: '',
  isActive: true
})

// Image upload
const selectedImage = ref(null)
const imagePreview = ref(null)

// Dynamic fields data
const dynamicFields = ref([])
const dynamicFieldValues = ref({})
const loadingDynamicFields = ref(false)

// Computed properties
const sortedDynamicFields = computed(() => {
  return dynamicFields.value.sort((a, b) => a.order - b.order)
})

// Location data
const countries = ref([])
const states = ref([])
const cities = ref([])
const districts = ref([])
const sources = ref([])
const statuses = ref([])

const loadingCountries = ref(false)
const loadingStates = ref(false)
const loadingCities = ref(false)
const loadingDistricts = ref(false)

// Form state
const loading = ref(false)
const errors = ref({})
const errorMessage = ref('')
const successMessage = ref('')

// Load initial data
const loadInitialData = async () => {
  const api = useApi()
  
  // Load each resource separately to avoid failures
  // Load countries
  try {
    loadingCountries.value = true
    const response = await api('/countries')
    countries.value = response.data || response || []
    loadingCountries.value = false
  } catch (error) {
    console.error('Error loading countries:', error)
    loadingCountries.value = false
  }
  
  // Load sources
  try {
    console.log('Loading sources...')
    const response = await api('/sources')
    console.log('Sources response:', response)
    sources.value = response.data || response || []
    console.log('Sources loaded:', sources.value)
  } catch (error) {
    console.error('Error loading sources:', error)
    sources.value = []
  }
  
  // Load statuses
  try {
    const response = await api('/statuses')
    statuses.value = response.data || response || []
    // "Yeni" durumunu bul ve form'a ata
    const newStatus = statuses.value.find(s => 
      s.name === 'Yeni' || 
      s.name === 'yeni' || 
      s.name === 'New' ||
      s.name === 'new' ||
      s.name.toLowerCase() === 'yeni'
    )
    if (newStatus) {
      form.status = newStatus.id
      console.log('Yeni status set:', newStatus.id, newStatus.name)
    } else {
      console.log('Available statuses:', statuses.value)
      // Eğer "Yeni" bulunamazsa, ilk status'u seç
      if (statuses.value.length > 0) {
        form.status = statuses.value[0].id
      }
    }
  } catch (error) {
    console.error('Error loading statuses:', error)
    statuses.value = []
  }
  
  // Load dynamic fields - this should always run
  console.log('Loading dynamic fields...')
  await loadDynamicFields()
  console.log('Dynamic fields after load:', dynamicFields.value)
}

// Load dynamic fields
const loadDynamicFields = async () => {
  try {
    loadingDynamicFields.value = true
    console.log('Calling getDynamicFields...')
    const fields = await getDynamicFields()
    console.log('Received fields:', fields)
    dynamicFields.value = fields.sort((a, b) => a.order - b.order)
  } catch (error) {
    console.error('Error loading dynamic fields:', error)
    dynamicFields.value = []
  } finally {
    loadingDynamicFields.value = false
  }
}

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
  // Reset file input
  const fileInput = document.getElementById('image')
  if (fileInput) {
    fileInput.value = ''
  }
}

// Handle file upload for dynamic fields
const handleFileUpload = (event, fieldId) => {
  const file = event.target.files[0]
  if (file) {
    dynamicFieldValues.value[fieldId] = file
  }
}

// Location change handlers
const onCountryChange = async () => {
  form.state = null
  form.city = null
  form.district = null
  states.value = []
  cities.value = []
  districts.value = []
  
  if (form.country) {
    try {
      loadingStates.value = true
      const api = useApi()
      const response = await api('/states')
      const allStates = response.data || response || []
      states.value = allStates.filter(s => s.country === form.country)
    } catch (error) {
      console.error('Error loading states:', error)
    } finally {
      loadingStates.value = false
    }
  }
}

const onStateChange = async () => {
  form.city = null
  form.district = null
  cities.value = []
  districts.value = []
  
  if (form.state) {
    try {
      loadingCities.value = true
      const api = useApi()
      const response = await api('/cities')
      const allCities = response.data || response || []
      cities.value = allCities.filter(c => c.state === form.state)
    } catch (error) {
      console.error('Error loading cities:', error)
    } finally {
      loadingCities.value = false
    }
  }
}

const onCityChange = async () => {
  form.district = null
  districts.value = []
  
  if (form.city) {
    try {
      loadingDistricts.value = true
      const api = useApi()
      const response = await api('/districts')
      const allDistricts = response.data || response || []
      districts.value = allDistricts.filter(d => d.city === form.city)
    } catch (error) {
      console.error('Error loading districts:', error)
    } finally {
      loadingDistricts.value = false
    }
  }
}

// Validate form
const validateForm = () => {
  errors.value = {}
  
  if (!form.name?.trim()) {
    errors.value.name = 'Ad gereklidir'
  }
  
  if (!form.surname?.trim()) {
    errors.value.surname = 'Soyad gereklidir'
  }
  
  if (!form.email?.trim()) {
    errors.value.email = 'E-posta gereklidir'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.value.email = 'Geçerli bir e-posta adresi giriniz'
  }
  
  if (!form.phone?.trim()) {
    errors.value.phone = 'Telefon numarası gereklidir'
  }
  
  return Object.keys(errors.value).length === 0
}

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) {
    currentStep.value = 1 // Go back to first step if validation fails
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  const customerData = {
    name: form.name.trim(),
    surname: form.surname.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    isActive: form.isActive
  }

  // Add optional fields
  if (form.gender) customerData.gender = form.gender
  if (form.birth_date) customerData.birth_date = form.birth_date
  if (form.title?.trim()) customerData.title = form.title.trim()
  if (form.job?.trim()) customerData.job = form.job.trim()
  if (form.company?.trim()) customerData.company = form.company.trim()
  if (form.website?.trim()) customerData.website = form.website.trim()
  if (form.source_id) customerData.source_id = form.source_id
  if (form.status) customerData.status = form.status
  if (form.country) customerData.country = form.country
  if (form.state) customerData.state = form.state
  if (form.city) customerData.city = form.city
  if (form.district) customerData.district = form.district
  if (form.postal_code?.trim()) customerData.postal_code = form.postal_code.trim()
  if (form.address?.trim()) customerData.address = form.address.trim()
  if (form.description?.trim()) customerData.description = form.description.trim()
  if (form.relatedTransaction?.trim()) customerData.relatedTransaction = form.relatedTransaction.trim()

  try {
    const api = useApi()
    let response

    // Use FormData if image is selected
    if (selectedImage.value) {
      const formData = new FormData()
      formData.append('image', selectedImage.value)

      // Append all customer data to FormData
      Object.keys(customerData).forEach(key => {
        if (customerData[key] !== null && customerData[key] !== undefined) {
          formData.append(key, customerData[key])
        }
      })

      response = await api('/customers', {
        method: 'POST',
        body: formData
      })
    } else {
      response = await api('/customers', {
        method: 'POST',
        body: customerData
      })
    }
    
    // Save dynamic field values if any
    const dynamicFieldsData = []
    for (const [index, field] of dynamicFields.value.entries()) {
      const value = dynamicFieldValues.value[field.id]
      if (value !== undefined && value !== null && value !== '') {
        dynamicFieldsData.push({
          customer: response.id,  // Backend expects 'customer' not 'customer_id'
          customer_dynamic_field: field.id,
          name: field.name,
          type: field.type,
          file: field.type === 'file' ? value : null,
          options_data: field.type === 'file' ? null : String(value),
          order: index + 1
        })
      }
    }
    
    if (dynamicFieldsData.length > 0) {
      await createBulkDynamicFieldValues(dynamicFieldsData)
    }
    
    successMessage.value = 'Müşteri başarıyla oluşturuldu!'
    emit('created', response)
    
    // Close modal after short delay
    setTimeout(() => {
      emit('close')
      resetForm()
    }, 1500)
    
  } catch (error) {
    console.error('Error creating customer:', error)
    errorMessage.value = error.data?.message || 'Müşteri oluşturulurken bir hata oluştu'
  } finally {
    loading.value = false
  }
}

// Reset form
const resetForm = () => {
  // Status'u sakla
  const savedStatus = form.status

  Object.keys(form).forEach(key => {
    if (key === 'isActive') {
      form[key] = true
    } else if (key === 'status') {
      // Status'u koru
      form[key] = savedStatus
    } else {
      form[key] = ''
    }
  })
  dynamicFieldValues.value = {}
  errors.value = {}
  errorMessage.value = ''
  successMessage.value = ''
  currentStep.value = 1

  // Reset image
  selectedImage.value = null
  imagePreview.value = null
  const fileInput = document.getElementById('image')
  if (fileInput) {
    fileInput.value = ''
  }
}

// Watch for modal open/close
watch(() => props.show, (newValue) => {
  if (newValue) {
    loadInitialData()
  } else {
    resetForm()
  }
})
</script>