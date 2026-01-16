<template>
  <Teleport to="body">
    <Transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 backdrop-blur-sm transition-opacity"
          @click="$emit('close')"></div>

        <!-- Modal -->
        <div class="flex min-h-screen items-center justify-center p-4">
          <Transition enter-active-class="duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <div v-if="show"
              class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all sm:w-full sm:max-w-4xl">
              <!-- Progress Bar -->
              <div class="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
                <div class="h-full bg-gradient-to-r to-rose-500 to-rose-500 transition-all duration-500"
                  :style="{ width: `${(currentStep / totalSteps) * 100}%` }"></div>
              </div>

              <!-- Header -->
              <div class="relative bg-gradient-to-r to-rose-400 to-rose-500 px-6 py-8 text-white">
                <button @click="$emit('close')"
                  class="absolute right-4 top-4 rounded-lg p-2 hover:bg-white/20 transition-colors">
                  <XMarkIcon class="h-5 w-5" />
                </button>

                <div class="flex items-center space-x-4">
                  <div class="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                    <UserPlusIcon class="h-8 w-8" />
                  </div>
                  <div>
                    <h2 class="text-2xl font-bold">Yeni Müşteri Ekle</h2>
                    <p class="text-rose-100">Adım {{ currentStep }} / {{ totalSteps }}</p>
                  </div>
                </div>

                <!-- Step Indicators -->
                <div class="mt-6 flex justify-between">
                  <div v-for="step in steps" :key="step.id" class="flex flex-1 items-center">
                    <div class="flex flex-col items-center flex-1">
                      <div class="flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all"
                        :class="[
                          currentStep >= step.id
                            ? 'bg-white text-rose-600 border-white'
                            : 'border-white/50 text-white/70'
                        ]">
                        <component v-if="currentStep > step.id" :is="CheckIcon" class="h-5 w-5" />
                        <span v-else class="text-sm font-semibold">{{ step.id }}</span>
                      </div>
                      <span class="mt-2 text-xs font-medium"
                        :class="currentStep >= step.id ? 'text-white' : 'text-white/70'">
                        {{ step.title }}
                      </span>
                    </div>
                    <div v-if="step.id < totalSteps" class="flex-1 h-0.5 mx-2 mt-[-20px]"
                      :class="currentStep > step.id ? 'bg-white' : 'bg-white/30'"></div>
                  </div>
                </div>
              </div>

              <!-- Form Content -->
              <form @submit.prevent="handleSubmit" class="p-6">
                <div class="min-h-[400px]">
                  <!-- Step 1: Temel Bilgiler -->
                  <Transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0 translate-x-4"
                    enter-to-class="opacity-100 translate-x-0" leave-active-class="duration-200 ease-in"
                    leave-from-class="opacity-100 translate-x-0" leave-to-class="opacity-0 -translate-x-4">
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
                              <img :src="imagePreview" alt="Preview"
                                class="h-32 w-32 rounded-full object-cover border-4 border-rose-200 dark:border-rose-700" />
                            </div>
                            <div v-else class="mb-4">
                              <div
                                class="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <UserIcon class="h-16 w-16 text-gray-400" />
                              </div>
                            </div>
                            <!-- File Input -->
                            <input id="image" type="file" accept="image/*" @change="handleImageUpload"
                              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 dark:file:bg-rose-900 dark:file:text-rose-200" />
                            <button v-if="imagePreview" type="button" @click="removeImage"
                              class="mt-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400">
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
                          <input id="name" v-model="form.name" type="text" required
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-gray-700 transition-all"
                            placeholder="Müşteri adı" />
                          <p v-if="errors.name" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ errors.name }}
                          </p>
                        </div>

                        <!-- Surname -->
                        <div>
                          <label for="surname" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <UserIcon class="inline h-4 w-4 mr-1" />
                            Soyad <span class="text-red-500">*</span>
                          </label>
                          <input id="surname" v-model="form.surname" type="text" required
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-gray-700 transition-all"
                            placeholder="Müşteri soyadı" />
                          <p v-if="errors.surname" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ errors.surname
                          }}</p>
                        </div>

                        <!-- Email -->
                        <div>
                          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <EnvelopeIcon class="inline h-4 w-4 mr-1" />
                            E-posta <span class="text-red-500">*</span>
                          </label>
                          <input id="email" v-model="form.email" type="email" required
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-gray-700 transition-all"
                            placeholder="ornek@email.com" />
                          <p v-if="errors.email" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ errors.email }}
                          </p>
                        </div>


                        <!-- Phone Input Section -->
                        <div>
                          <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <PhoneIcon class="inline h-4 w-4 mr-1" />
                            Telefon <span class="text-red-500">*</span>
                          </label>

                          <div class="relative">
                            <input id="phone" v-model="form.phone" type="tel" required @input="handlePhoneInput"
                              :disabled="checkingPhone" :class="[
                                'block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                                phoneStatus.exists && phoneStatus.exactMatch
                                  ? 'ring-red-500 dark:ring-red-600'
                                  : phoneStatus.exists && phoneStatus.similarMatches.length > 0
                                    ? 'ring-yellow-500 dark:ring-yellow-600'
                                    : 'ring-gray-300 dark:ring-gray-600',
                                'focus:ring-2 focus:ring-rose-500 focus:border-transparent'
                              ]" placeholder="Mobil telefon numarası" maxlength="16" />

                            <!-- Loading Spinner -->
                            <div v-if="checkingPhone" class="absolute inset-y-0 right-0 flex items-center pr-3">
                              <svg class="animate-spin h-5 w-5 text-rose-600" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                  stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                              </svg>
                            </div>

                            <!-- Status Icons -->
                            <div v-else-if="form.phone.length >= 10"
                              class="absolute inset-y-0 right-0 flex items-center pr-3">
                              <!-- Exact Match - Red X -->
                              <svg v-if="phoneStatus.exists && phoneStatus.exactMatch" class="h-5 w-5 text-red-500"
                                fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clip-rule="evenodd" />
                              </svg>
                              <!-- Similar Match - Yellow Warning -->
                              <svg v-else-if="phoneStatus.exists && phoneStatus.similarMatches.length > 0"
                                class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                  clip-rule="evenodd" />
                              </svg>
                              <!-- Valid - Green Check -->
                              <svg v-else class="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clip-rule="evenodd" />
                              </svg>
                            </div>
                          </div>

                          <!-- Error/Warning Messages -->
                          <p v-if="errors.phone" class="mt-2 text-sm text-red-600 dark:text-red-400">
                            {{ errors.phone }}
                          </p>

                          <!-- Exact Match Alert -->
                          <div v-if="phoneStatus.exists && phoneStatus.exactMatch"
                            class="mt-2 rounded-lg bg-red-50 dark:bg-red-900/20 p-3 border border-red-200 dark:border-red-800">
                            <div class="flex items-start">
                              <svg class="h-5 w-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clip-rule="evenodd" />
                              </svg>
                              <div class="ml-3 flex-1">
                                <p class="text-sm font-medium text-red-800 dark:text-red-300">
                                  Bu telefon numarası zaten kayıtlı!
                                </p>
                                <p class="mt-1 text-sm text-red-700 dark:text-red-400">
                                  <strong>{{ phoneStatus.exactMatch.name }} {{ phoneStatus.exactMatch.surname
                                    }}</strong>
                                  ({{ phoneStatus.exactMatch.phone }})
                                </p>
                              </div>
                            </div>
                          </div>

                          <!-- Similar Matches Alert -->
                          <div v-else-if="phoneStatus.exists && phoneStatus.similarMatches.length > 0"
                            class="mt-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-3 border border-yellow-200 dark:border-yellow-800">
                            <div class="flex items-start">
                              <svg class="h-5 w-5 text-yellow-400 flex-shrink-0" fill="currentColor"
                                viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                  clip-rule="evenodd" />
                              </svg>
                              <div class="ml-3 flex-1">
                                <p class="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                                  Benzer telefon numaraları bulundu ({{ phoneStatus.similarMatches.length }})
                                </p>
                                <ul class="mt-2 space-y-1">
                                  <li v-for="match in phoneStatus.similarMatches.slice(0, 3)" :key="match.id"
                                    class="text-sm text-yellow-700 dark:text-yellow-400">
                                    <strong>{{ match.name }} {{ match.surname }}</strong> - {{ match.phone }}
                                  </li>
                                  <li v-if="phoneStatus.similarMatches.length > 3"
                                    class="text-xs text-yellow-600 dark:text-yellow-500">
                                    +{{ phoneStatus.similarMatches.length - 3 }} daha...
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>














                        <div>
                          <label for="patient" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <CalendarIcon class="inline h-4 w-4 mr-1" />
                            Hastalık
                          </label>
                          <input id="patient" v-model="form.patient" type="text"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-gray-700 transition-all" />
                        </div>

                        <!-- Birth Date -->
                        <div>
                          <label for="birth_date"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <CalendarIcon class="inline h-4 w-4 mr-1" />
                            Doğum Tarihi
                          </label>
                          <input id="birth_date" v-model="form.birth_date" type="date"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-gray-700 transition-all" />
                        </div>

                        <!-- Gender -->
                        <div>
                          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <UserGroupIcon class="inline h-4 w-4 mr-1" />
                            Cinsiyet
                          </label>
                          <div class="flex space-x-4">
                            <label class="flex items-center">
                              <input v-model="form.gender" type="radio" value="male"
                                class="h-4 w-4 text-rose-600 border-gray-300 focus:ring-rose-600" />
                              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Erkek</span>
                            </label>
                            <label class="flex items-center">
                              <input v-model="form.gender" type="radio" value="female"
                                class="h-4 w-4 text-rose-600 border-gray-300 focus:ring-rose-600" />
                              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Kadın</span>
                            </label>
                            <label class="flex items-center">
                              <input v-model="form.gender" type="radio" value="other"
                                class="h-4 w-4 text-rose-600 border-gray-300 focus:ring-rose-600" />
                              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Diğer</span>
                            </label>
                          </div>
                        </div>




                      </div>
                    </div>
                  </Transition>

                  <!-- Step 2: İş Bilgileri -->
                  <Transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0 translate-x-4"
                    enter-to-class="opacity-100 translate-x-0" leave-active-class="duration-200 ease-in"
                    leave-from-class="opacity-100 translate-x-0" leave-to-class="opacity-0 -translate-x-4">
                    <div v-if="currentStep === 2" class="space-y-6">
                      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <!-- Title -->
                        <div>
                          <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <BriefcaseIcon class="inline h-4 w-4 mr-1" />
                            Ünvan
                          </label>
                          <input id="title" v-model="form.title" type="text"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-gray-700 transition-all"
                            placeholder="Genel Müdür, Müdür, vs." />
                        </div>

                        <!-- Job -->
                        <div>
                          <label for="job" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <AcademicCapIcon class="inline h-4 w-4 mr-1" />
                            Meslek
                          </label>
                          <input id="job" v-model="form.job" type="text"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-gray-700 transition-all"
                            placeholder="Yazılım Geliştirici, Tasarımcı, vs." />
                        </div>

                        <!-- Company -->
                        <div>
                          <label for="company" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <BuildingOfficeIcon class="inline h-4 w-4 mr-1" />
                            Şirket
                          </label>
                          <input id="company" v-model="form.company" type="text"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-gray-700 transition-all"
                            placeholder="ABC Teknoloji Ltd. Şti." />
                        </div>

                        <!-- Website -->
                        <div>
                          <label for="website" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <GlobeAltIcon class="inline h-4 w-4 mr-1" />
                            Website
                          </label>
                          <input id="website" v-model="form.website" type="url"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-gray-700 transition-all"
                            placeholder="https://www.example.com" />
                          <p v-if="errors.website" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ errors.website
                          }}</p>
                        </div>

                        <!-- Source -->
                        <div>
                          <label for="source" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <SparklesIcon class="inline h-4 w-4 mr-1" />
                            Müşteri Kaynağı
                          </label>
                          <select id="source" v-model="form.sourceId"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-gray-700 transition-all">
                            <option value="">Kaynak seçin</option>
                            <option v-for="source in sources" :key="source.id" :value="source.id">
                              {{ source.name }}
                            </option>
                          </select>
                        </div>

                        <!-- Referans -->

                        <div class="relative">
                          <label for="referanceCustomer"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <FlagIcon class="inline h-4 w-4 mr-1" />
                            Referans
                          </label>

                          <div class="relative">
                            <input id="referanceCustomer" type="text" v-model="searchQuery" @input="searchReferences"
                              :disabled="loadingReferanceCustomer" placeholder="Referans müşteriyi yazın..."
                              class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 dark:bg-gray-700 transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed dark:disabled:bg-gray-800 dark:disabled:text-gray-400" />

                            <!-- Loading Spinner -->
                            <div v-if="loadingReferanceCustomer" class="absolute right-3 top-3">
                              <svg class="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                  stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z">
                                </path>
                              </svg>
                            </div>

                            <!-- Dropdown -->
                            <ul v-if="filteredReferances.length && showDropdown"
                              class="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
                              <li v-for="reference in filteredReferances" :key="reference.id"
                                @click="selectReference(reference)"
                                class="px-4 py-2 cursor-pointer hover:bg-rose-100 dark:hover:bg-gray-700">
                                {{ reference.name }}
                              </li>
                            </ul>
                          </div>
                        </div>


                      </div>

                      <!-- Active Status -->
                      <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div>
                          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Müşteri Durumu</label>
                          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Müşteri ile aktif olarak çalışıyor
                            musunuz?</p>
                        </div>
                        <button type="button" @click="form.isActive = !form.isActive" :class="[
                          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                          form.isActive ? 'bg-rose-600' : 'bg-gray-200 dark:bg-gray-600'
                        ]">
                          <span :class="[
                            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                            form.isActive ? 'translate-x-6' : 'translate-x-1'
                          ]" />
                        </button>
                      </div>
                    </div>
                  </Transition>

                  <!-- Step 3: Adres Bilgileri -->
                  <Transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0 translate-x-4"
                    enter-to-class="opacity-100 translate-x-0" leave-active-class="duration-200 ease-in"
                    leave-from-class="opacity-100 translate-x-0" leave-to-class="opacity-0 -translate-x-4">
                    <div v-if="currentStep === 3" class="space-y-6">
                      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <!-- Country -->
                        <div>
                          <label for="country" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <MapPinIcon class="inline h-4 w-4 mr-1" />
                            Ülke
                          </label>
                          <select id="country" v-model="form.country" @change="onCountryChange"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-gray-700 transition-all"
                            :disabled="loadingCountries">
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
                          <select id="state" v-model="form.state" @change="onStateChange"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-gray-700 transition-all"
                            :disabled="!form.country || loadingStates">
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
                          <select id="city" v-model="form.city" @change="onCityChange"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-gray-700 transition-all"
                            :disabled="!form.state || loadingCities">
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
                          <input id="district" v-model="form.district" type="text"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-gray-700 transition-all"
                            placeholder="İlçe adını giriniz" />
                        </div>

                        <!-- Postal Code -->
                        <div>
                          <label for="postal_code"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <HashtagIcon class="inline h-4 w-4 mr-1" />
                            Posta Kodu
                          </label>
                          <input id="postal_code" v-model="form.postalCode" type="text"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-gray-700 transition-all"
                            placeholder="34000" />
                        </div>
                      </div>

                      <!-- Address -->
                      <div>
                        <label for="address" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <MapPinIcon class="inline h-4 w-4 mr-1" />
                          Adres
                        </label>
                        <textarea id="address" v-model="form.address" rows="3"
                          class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-gray-700 transition-all"
                          placeholder="Detaylı adres bilgisi..."></textarea>
                      </div>

                      <!-- Description -->
                      <div>
                        <label for="description"
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <DocumentTextIcon class="inline h-4 w-4 mr-1" />
                          Notlar
                        </label>
                        <textarea id="description" v-model="form.description" rows="3"
                          class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-gray-700 transition-all"
                          placeholder="Müşteri hakkında özel notlar..."></textarea>
                      </div>

                      <!-- Related Transaction -->
                      <div>
                        <label for="relatedTransaction"
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <DocumentTextIcon class="inline h-4 w-4 mr-1" />
                          İlgili İşlem
                        </label>
                        <textarea id="relatedTransaction" v-model="form.relatedTransaction" rows="3"
                          class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-gray-700 transition-all"
                          placeholder="İlgili işlem bilgisi..."></textarea>
                      </div>
                    </div>
                  </Transition>

                  <!-- Step 4: Dinamik Alanlar -->
                  <Transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0 translate-x-4"
                    enter-to-class="opacity-100 translate-x-0" leave-active-class="duration-200 ease-in"
                    leave-from-class="opacity-100 translate-x-0" leave-to-class="opacity-0 -translate-x-4">
                    <div v-if="currentStep === 4" class="space-y-6">
                      <div v-if="loadingDynamicFields" class="text-center py-8">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
                        <p class="text-gray-600 dark:text-gray-400 mt-3">Dinamik alanlar yükleniyor...</p>
                      </div>

                      <div v-else-if="dynamicFields.length === 0" class="text-center py-8">
                        <DocumentTextIcon class="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p class="text-gray-500 dark:text-gray-400">Henüz dinamik alan tanımlanmamış.</p>
                        <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Dinamik alan eklemek için sistem
                          ayarlarına gidin.</p>
                      </div>

                      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div v-for="field in sortedDynamicFields" :key="field.id">
                          <label :for="`dynamic-${field.id}`"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ field.name }}
                            <span v-if="field.is_required" class="text-red-500">*</span>
                          </label>

                          <!-- Text Input -->
                          <input v-if="field.type === 'text'" :id="`dynamic-${field.id}`"
                            v-model="dynamicFieldValues[field.id]" type="text" :required="field.is_required"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-gray-700 transition-all"
                            :placeholder="`${field.name} giriniz`" />

                          <!-- Number Input -->
                          <input v-else-if="field.type === 'number'" :id="`dynamic-${field.id}`"
                            v-model.number="dynamicFieldValues[field.id]" type="number" :required="field.is_required"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-gray-700 transition-all"
                            :placeholder="`${field.name} giriniz`" />

                          <!-- Email Input -->
                          <input v-else-if="field.type === 'email'" :id="`dynamic-${field.id}`"
                            v-model="dynamicFieldValues[field.id]" type="email" :required="field.is_required"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-gray-700 transition-all"
                            :placeholder="`${field.name} giriniz`" />

                          <!-- Phone Input -->
                          <input v-else-if="field.type === 'phone'" :id="`dynamic-${field.id}`"
                            v-model="dynamicFieldValues[field.id]" type="tel" :required="field.is_required"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-gray-700 transition-all"
                            :placeholder="`${field.name} giriniz`" />

                          <!-- URL Input -->
                          <input v-else-if="field.type === 'url'" :id="`dynamic-${field.id}`"
                            v-model="dynamicFieldValues[field.id]" type="url" :required="field.is_required"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-gray-700 transition-all"
                            :placeholder="`${field.name} giriniz`" />

                          <!-- Date Input -->
                          <input v-else-if="field.type === 'date'" :id="`dynamic-${field.id}`"
                            v-model="dynamicFieldValues[field.id]" type="date" :required="field.is_required"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-gray-700 transition-all" />

                          <!-- Select Dropdown -->
                          <select v-else-if="field.type === 'select'" :id="`dynamic-${field.id}`"
                            v-model="dynamicFieldValues[field.id]" :required="field.is_required"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-gray-700 transition-all">
                            <option value="">Seçiniz</option>
                            <option v-for="option in parseOptionsData(field.options_data)" :key="option"
                              :value="option">
                              {{ option }}
                            </option>
                          </select>

                          <!-- Textarea -->
                          <textarea v-else-if="field.type === 'textarea'" :id="`dynamic-${field.id}`"
                            v-model="dynamicFieldValues[field.id]" rows="3" :required="field.is_required"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-gray-700 transition-all"
                            :placeholder="`${field.name} giriniz`"></textarea>

                          <!-- File Input -->
                          <input v-else-if="field.type === 'file'" :id="`dynamic-${field.id}`" type="file"
                            :required="field.is_required" @change="handleFileUpload($event, field.id)"
                            class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 transition-all" />
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
                  <button v-if="currentStep > 1" type="button" @click="prevStep"
                    class="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <ArrowLeftIcon class="mr-2 h-4 w-4" />
                    Geri
                  </button>
                  <div v-else></div>

                  <div class="flex items-center space-x-3">
                    <button type="button" @click="$emit('close')"
                      class="inline-flex items-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                      İptal
                    </button>

                    <button v-if="currentStep < totalSteps" type="button" @click="nextStep"
                      class="inline-flex items-center rounded-lg bg-rose-600 px-6 py-2 text-sm font-medium text-white hover:bg-rose-700 transition-colors">
                      İleri
                      <ArrowRightIcon class="ml-2 h-4 w-4" />
                    </button>

                    <button v-else type="submit" :disabled="loading"
                      class="inline-flex items-center rounded-lg bg-gradient-to-r to-rose-400 to-rose-500 px-6 py-2 text-sm font-medium text-white hover:from-rose-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                      <CheckIcon v-if="!loading" class="mr-2 h-4 w-4" />
                      <svg v-else class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
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
import { computed, reactive, ref, watch, onUnmounted } from 'vue' // ✅ onUnmounted eklendi

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
  patient: '',
  title: '',
  job: '',
  company: '',
  website: '',
  sourceId: null,
  status: null,
  referance_customer: null,
  country: null,
  state: null,
  city: null,
  district: null,
  postalCode: '',
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
const sources = ref([])
const statuses = ref([])

// Referance Customer
const referances = ref([])
const filteredReferances = ref([])
const searchQuery = ref('')
const loadingReferanceCustomer = ref(false)
const showDropdown = ref(false)

let searchTimeout = null

const loadingCountries = ref(false)
const loadingStates = ref(false)
const loadingCities = ref(false)

// Form state
const loading = ref(false)
const checkingPhone = ref(false)
const errors = ref({})
const errorMessage = ref('')
const successMessage = ref('')

// ✅ Phone check state
const phoneStatus = ref({
  exists: false,
  exactMatch: null,
  similarMatches: []
})

let phoneCheckTimeout = null

// Load initial data
const loadInitialData = async () => {
  const api = useApi()

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
      if (statuses.value.length > 0) {
        form.status = statuses.value[0].id
      }
    }
  } catch (error) {
    console.error('Error loading statuses:', error)
    statuses.value = []
  }

  // Load dynamic fields
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

// Search references
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

// Location change handlers
const onCountryChange = async () => {
  form.state = null
  form.city = null
  form.district = null
  states.value = []
  cities.value = []

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
  // District is now a text field, no need to reset or load districts
}

// ✅ Phone check functions
/**
 * Handle phone input with debounced API check
 */
const handlePhoneInput = () => {
  // Clear previous error
  if (errors.value.phone === 'Bu telefon numarası zaten kayıtlı') {
    errors.value.phone = ''
  }

  // Reset phone status
  phoneStatus.value = {
    exists: false,
    exactMatch: null,
    similarMatches: []
  }

  // Clear previous timeout
  if (phoneCheckTimeout) {
    clearTimeout(phoneCheckTimeout)
  }

  // Don't check if phone is too short
  if (!form.phone || form.phone.length < 10) {
    return
  }

  // Debounce: wait 500ms after user stops typing
  phoneCheckTimeout = setTimeout(async () => {
    await checkPhoneUniqueness()
  }, 500)
}

/**
 * Check phone uniqueness and find similar matches
 */
const checkPhoneUniqueness = async () => {
  if (!form.phone?.trim() || form.phone.length < 10) {
    return true
  }

  try {
    checkingPhone.value = true
    const api = useApi()
    const response = await api(`/customers/check-phone?phone=${encodeURIComponent(form.phone)}`)

    phoneStatus.value = {
      exists: response.exists,
      exactMatch: response.exactMatch,
      similarMatches: response.similarMatches || []
    }

    // If exact match, set error and prevent submission
    if (response.exactMatch) {
      errors.value.phone = 'Bu telefon numarası zaten kayıtlı'
      return false
    }

    return true
  } catch (error) {
    console.error('Error checking phone uniqueness:', error)
    // Don't block submission on API error
    return true
  } finally {
    checkingPhone.value = false
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
        errorMessage.value = `"${field.name}" alanı zorunludur`
        currentStep.value = 4
        return false
      }
    }
  }

  return Object.keys(errors.value).length === 0
}

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) {
    currentStep.value = 1
    return
  }
  
  // ✅ Block submission if exact match found
  if (phoneStatus.value.exactMatch) {
    currentStep.value = 1
    errors.value.phone = 'Bu telefon numarası zaten kayıtlı. Lütfen farklı bir numara girin.'
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  // Remove phone mask - send only digits
  const phoneDigits = form.phone.replace(/\D/g, '')

  const customerData = {
    name: form.name.trim(),
    surname: form.surname.trim(),
    email: form.email.trim(),
    phone: phoneDigits,
    isActive: form.isActive
  }

  // Add optional fields
  if (form.gender) customerData.gender = form.gender
  if (form.birth_date) customerData.birthDate = String(form.birth_date)
  if (form.patient?.trim()) customerData.patient = form.patient.trim()
  if (form.title?.trim()) customerData.title = form.title.trim()
  if (form.job?.trim()) customerData.job = form.job.trim()
  if (form.company?.trim()) customerData.company = form.company.trim()
  if (form.website?.trim()) customerData.website = form.website.trim()
  if (form.sourceId) customerData.sourceId = form.sourceId
  if (form.status) customerData.status = form.status
  if (form.country) customerData.country = form.country
  if (form.state) customerData.state = form.state
  if (form.city) customerData.city = form.city
  if (form.district) customerData.district = form.district
  if (form.postalCode?.trim()) customerData.postalCode = form.postalCode.trim()
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
          customer: response.id,
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
  const savedStatus = form.status

  Object.keys(form).forEach(key => {
    if (key === 'isActive') {
      form[key] = true
    } else if (key === 'status') {
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

  // ✅ Reset phone status
  phoneStatus.value = {
    exists: false,
    exactMatch: null,
    similarMatches: []
  }

  // Reset image
  selectedImage.value = null
  imagePreview.value = null
  const fileInput = document.getElementById('image')
  if (fileInput) {
    fileInput.value = ''
  }
}

// ✅ Cleanup timeout on component unmount
onUnmounted(() => {
  if (phoneCheckTimeout) {
    clearTimeout(phoneCheckTimeout)
  }
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})

// Watch for modal open/close
watch(() => props.show, (newValue) => {
  if (newValue) {
    loadInitialData()
  } else {
    resetForm()
  }
})
</script>