<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="show" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      >
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div 
            v-if="show"
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <!-- Modal Header -->
            <div class="relative overflow-hidden flex-shrink-0">
              <div class="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
             <div
              class="absolute inset-0 opacity-30"
              style="background-image: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%3E%3Ccircle%20cx%3D%221%22%20cy%3D%221%22%20r%3D%221%22%20fill%3D%22white%22%20fill-opacity%3D%220.3%22%2F%3E%3C%2Fsvg%3E');"
            ></div>

              <div class="relative px-6 py-5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <ShoppingBagIcon class="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 class="text-xl font-bold text-white">Müşteri Hizmetleri</h2>
                      <p class="text-sm text-white/70">{{ customer?.name }} {{ customer?.surname }}</p>
                    </div>
                  </div>
                  <button 
                    @click="close"
                    class="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
                  >
                    <XMarkIcon class="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Sale Status Warning -->
            <div v-if="isSaleStatus" class="mx-6 mt-4">
              <div class="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                <div class="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                  <ExclamationTriangleIcon class="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p class="font-medium text-amber-800 dark:text-amber-200">Satış Durumu</p>
                  <p class="text-sm text-amber-600 dark:text-amber-400">
                    Müşterinin durumu satış durumunda olduğundan değiştirilemez
                  </p>
                </div>
              </div>
            </div>

            <!-- Modal Content -->
            <div class="flex-1 overflow-y-auto p-6 space-y-6">
              
              <!-- Existing Services Section -->
              <div v-if="existingServices.length > 0">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <div class="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <ClipboardDocumentListIcon class="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 class="font-semibold text-gray-900 dark:text-white">Mevcut Hizmetler</h3>
                    <span class="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                      {{ existingServices.length }}
                    </span>
                  </div>
                  <button 
                    v-if="!isSaleStatus"
                    @click="updateExistingServices" 
                    :disabled="updatingExisting"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all"
                  >
                    <ArrowPathIcon class="h-4 w-4" :class="{ 'animate-spin': updatingExisting }" />
                    {{ updatingExisting ? 'Güncelleniyor...' : 'Güncelle' }}
                  </button>
                </div>

                <div class="space-y-3">
                  <div 
                    v-for="(service, index) in existingServices" 
                    :key="service.id"
                    class="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                  >
                    <!-- Service Header -->
                    <div class="flex items-start justify-between mb-3">
                      <div class="flex items-center gap-3">
                        <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                          <span class="text-sm font-bold text-white">
                            {{ service.productName?.charAt(0)?.toUpperCase() || 'H' }}
                          </span>
                        </div>
                        <div>
                          <p class="font-medium text-gray-900 dark:text-white">{{ service.productName || 'Ürün' }}</p>
                          <p class="text-sm text-gray-500 dark:text-gray-400">
                            {{ formatPrice(service.offer) }} {{ service.product?.currency?.code || 'TL' }}
                          </p>
                        </div>
                      </div>

                      <!-- Payment Status Badge -->
                      <div class="flex items-center gap-2">
                        <span 
                          :class="[
                            'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium',
                            service.isPayCompleted 
                              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                              : parseFloat(service.paidAmount) > 0
                                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          ]"
                        >
                          <CheckCircleIcon v-if="service.isPayCompleted" class="h-3.5 w-3.5" />
                          <ClockIcon v-else-if="parseFloat(service.paidAmount) > 0" class="h-3.5 w-3.5" />
                          <XCircleIcon v-else class="h-3.5 w-3.5" />
                          {{ service.isPayCompleted ? 'Ödendi' : parseFloat(service.paidAmount) > 0 ? 'Kısmi' : 'Ödenmedi' }}
                        </span>
                        
                        <button 
                          @click="deleteExistingService(service.id)"
                          class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                        >
                          <TrashIcon class="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <!-- Service Fields -->
                    <div class="grid grid-cols-4 gap-3 mb-3">
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Fiyat</label>
                        <input 
                          v-model.number="service.price" 
                          type="number" 
                          :readonly="isSaleStatus" 
                          :disabled="isSaleStatus"
                          @input="calculateExistingOffer(index)"
                          class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 transition-all"
                        />
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Teklif</label>
                        <input 
                          v-model.number="service.offer" 
                          type="number"
                          :readonly="isSaleStatus" 
                          :disabled="isSaleStatus"
                          @input="calculateExistingRemaining(index)"
                          class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 transition-all"
                        />
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Alınan</label>
                        <input 
                          v-model.number="service.paidAmount" 
                          type="number" 
                          min="0"
                          :readonly="isSaleStatus || service.isPayCompleted" 
                          :disabled="isSaleStatus || service.isPayCompleted"
                          @input="calculateExistingRemaining(index)"
                          class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 transition-all"
                        />
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Kalan</label>
                        <input 
                          :value="calculateRemainingAmount(service)" 
                          type="number" 
                          readonly
                          class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                        />
                      </div>
                    </div>

                    <!-- Payment Action -->
                    <div class="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div v-if="service.note" class="text-sm text-gray-500 dark:text-gray-400">
                        <span class="font-medium">Not:</span> {{ service.note }}
                      </div>
                      <div v-else></div>
                      
                      <button 
                        v-if="!service.isPayCompleted"
                        @click="openPaymentCompleteConfirm(service, index)"
                        class="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-all"
                      >
                        <BanknotesIcon class="h-4 w-4" />
                        <span v-if="calculateRemainingAmount(service) > 0">
                          {{ formatPrice(calculateRemainingAmount(service)) }} {{ service.product?.currency?.code || 'TL' }} Al
                        </span>
                        <span v-else>Tamamla</span>
                      </button>
                      
                      <div v-else class="inline-flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
                        <CheckCircleIcon class="h-4 w-4" />
                        Ödeme tamamlandı
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Existing Services Summary -->
                <div class="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div class="grid grid-cols-3 gap-4">
                    <div class="text-center">
                      <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Toplam Teklif</p>
                      <p class="text-lg font-bold text-gray-900 dark:text-white">
                        {{ formatPrice(totalOfferExisting) }} {{ selectedCurrency?.code || 'TL' }}
                      </p>
                    </div>
                    <div class="text-center">
                      <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Toplam Alınan</p>
                      <p class="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {{ formatPrice(totalPaidExisting) }} {{ selectedCurrency?.code || 'TL' }}
                      </p>
                    </div>
                    <div class="text-center">
                      <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Toplam Kalan</p>
                      <p 
                        class="text-lg font-bold"
                        :class="totalRemainingExisting > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'"
                      >
                        {{ formatPrice(totalRemainingExisting) }} {{ selectedCurrency?.code || 'TL' }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Add New Service Section -->
              <div v-if="!isSaleStatus" class="border border-gray-200 dark:border-gray-700 rounded-xl">
                <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <div class="flex items-center gap-2">
                    <div class="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <PlusIcon class="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 class="font-semibold text-gray-900 dark:text-white">Yeni Hizmet Ekle</h3>
                  </div>
                </div>

                <div class="p-4 space-y-4">
                  <!-- Currency Selection -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Para Birimi</label>
                    <select 
                      v-model="selectedCurrency" 
                      :disabled="existingServices.length > 0"
                      class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 transition-all appearance-none cursor-pointer"
                    >
                      <option v-for="currency in currencies" :key="currency.id" :value="currency">
                        {{ currency.name }} ({{ currency.code }})
                      </option>
                    </select>
                    <p v-if="existingServices.length > 0" class="mt-1 text-xs text-amber-600 dark:text-amber-400">
                      Mevcut hizmet varken para birimi değiştirilemez
                    </p>
                  </div>

                  <!-- Product Search -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ürün Seç</label>
                    <div class="relative">
                      <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input 
                        v-model="productSearch" 
                        :disabled="!selectedCurrency"
                        @input="searchProducts"
                        @focus="showProductDropdown = true"
                        type="text" 
                        class="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 transition-all"
                        placeholder="Ürün ara..."
                      />

                      <!-- Product Dropdown -->
                      <div 
                        v-if="showProductDropdown && filteredProducts.length > 0"
                        class="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto"
                      >
                        <div 
                          v-for="product in filteredProducts" 
                          :key="product.id"
                          @click="selectProduct(product)"
                          class="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                        >
                          <div class="flex items-center gap-3">
                            <div class="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                              <span class="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                {{ product.name?.charAt(0)?.toUpperCase() }}
                              </span>
                            </div>
                            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ product.name }}</span>
                          </div>
                          <span class="text-sm text-gray-500 dark:text-gray-400">
                            {{ formatPrice(product.price) }} {{ product.currency?.code || 'TL' }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Selected Product Form -->
                  <div v-if="selectedProduct" class="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center gap-3">
                        <div class="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                          <span class="text-sm font-bold text-white">
                            {{ selectedProduct.name?.charAt(0)?.toUpperCase() }}
                          </span>
                        </div>
                        <div>
                          <p class="font-medium text-gray-900 dark:text-white">{{ selectedProduct.name }}</p>
                          <p class="text-sm text-emerald-600 dark:text-emerald-400">
                            {{ formatPrice(selectedProduct.price) }} {{ selectedProduct.currency?.code || 'TL' }}
                          </p>
                        </div>
                      </div>
                      <button 
                        @click="cancelProductSelection"
                        class="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-all"
                      >
                        <XMarkIcon class="h-5 w-5" />
                      </button>
                    </div>

                    <div class="grid grid-cols-4 gap-3 mb-3">
                      <div>
                        <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Fiyat</label>
                        <input 
                          v-model.number="newService.price" 
                          type="number"
                          @input="calculateOffer"
                          class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Teklif</label>
                        <input 
                          v-model.number="newService.offer" 
                          type="number"
                          @input="calculateRemaining"
                          class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Alınan</label>
                        <input 
                          v-model.number="newService.paidAmount" 
                          type="number" 
                          min="0"
                          @input="calculateRemaining"
                          class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Kalan</label>
                        <input 
                          :value="newService.remainingAmount" 
                          type="number" 
                          readonly
                          class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                        />
                      </div>
                    </div>

                    <div class="mb-3">
                      <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Not (Opsiyonel)</label>
                      <input 
                        v-model="newService.note" 
                        type="text"
                        class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        placeholder="Hizmet notu..."
                      />
                    </div>

                    <button 
                      @click="addService"
                      class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all"
                    >
                      Hizmeti Ekle
                    </button>
                  </div>
                </div>
              </div>

              <!-- Pending Services List -->
              <div v-if="services.length > 0">
                <div class="flex items-center gap-2 mb-4">
                  <div class="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <ClockIcon class="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">Eklenecek Hizmetler</h3>
                  <span class="px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full">
                    {{ services.length }}
                  </span>
                </div>

                <div class="space-y-2">
                  <div 
                    v-for="(service, index) in services" 
                    :key="index"
                    class="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl"
                  >
                    <div class="flex items-center gap-3">
                      <div class="h-9 w-9 rounded-lg bg-amber-500 flex items-center justify-center">
                        <span class="text-xs font-bold text-white">
                          {{ service.productName?.charAt(0)?.toUpperCase() }}
                        </span>
                      </div>
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">{{ service.productName }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          Teklif: {{ formatPrice(service.offer) }} | Alınan: {{ formatPrice(service.paidAmount) }} | Kalan: {{ formatPrice(service.offer - service.paidAmount) }}
                        </p>
                      </div>
                    </div>
                    <button 
                      @click="removeService(index)"
                      class="p-1.5 text-amber-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                    >
                      <XMarkIcon class="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <!-- Pending Services Summary -->
                <div class="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                  <div class="grid grid-cols-3 gap-4">
                    <div class="text-center">
                      <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Toplam Teklif</p>
                      <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatPrice(totalOffer) }}</p>
                    </div>
                    <div class="text-center">
                      <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Toplam Alınan</p>
                      <p class="text-lg font-bold text-emerald-600 dark:text-emerald-400">{{ formatPrice(totalPaid) }}</p>
                    </div>
                    <div class="text-center">
                      <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Toplam Kalan</p>
                      <p class="text-lg font-bold" :class="totalRemaining > 0 ? 'text-red-600' : 'text-emerald-600'">
                        {{ formatPrice(totalRemaining) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex-shrink-0 px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-end gap-3">
                <button 
                  @click="close"
                  class="px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
                >
                  İptal
                </button>
                <button 
                  v-if="!isSaleStatus"
                  @click="saveServices" 
                  :disabled="services.length === 0 || saving"
                  class="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {{ saving ? 'Kaydediliyor...' : 'Kaydet' }}
                </button>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Payment Complete Confirmation Modal -->
        <Transition
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-150"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div 
            v-if="showPaymentConfirm"
            class="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div class="absolute inset-0 bg-black/30" @click="closePaymentConfirm"></div>
            <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div class="text-center mb-6">
                <div class="mx-auto w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                  <BanknotesIcon class="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ödeme Tamamla</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  <strong class="text-gray-700 dark:text-gray-300">{{ pendingPaymentService?.productName }}</strong> için ödemeyi tamamlamak istediğinize emin misiniz?
                </p>
              </div>

              <!-- Payment Summary -->
              <div class="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 mb-6 space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500 dark:text-gray-400">Toplam Teklif:</span>
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ formatPrice(pendingPaymentService?.offer) }} {{ pendingPaymentService?.product?.currency?.code || 'TL' }}
                  </span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500 dark:text-gray-400">Önceki Alınan:</span>
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ formatPrice(pendingPaymentService?.paidAmount) }} {{ pendingPaymentService?.product?.currency?.code || 'TL' }}
                  </span>
                </div>
                <div class="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span class="text-gray-500 dark:text-gray-400">Şimdi Alınan:</span>
                  <span class="font-bold text-emerald-600 dark:text-emerald-400">
                    {{ formatPrice(calculateRemainingAmount(pendingPaymentService)) }} {{ pendingPaymentService?.product?.currency?.code || 'TL' }}
                  </span>
                </div>
              </div>

              <div class="flex gap-3">
                <button 
                  @click="closePaymentConfirm"
                  class="flex-1 py-2.5 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  İptal
                </button>
                <button 
                  @click="confirmPaymentComplete"
                  :disabled="completingPayment"
                  class="flex-1 py-2.5 px-4 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-all"
                >
                  {{ completingPayment ? 'İşleniyor...' : 'Tamamla' }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { 
  XMarkIcon, 
  TrashIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon, 
  BanknotesIcon,
  ShoppingBagIcon,
  PlusIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentListIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  show: { type: Boolean, default: false },
  customer: { type: Object, default: null }
})

const emit = defineEmits(['close', 'saved'])

const api = useApi()
const authStore = useAuthStore()

// State
const products = ref([])
const productSearch = ref('')
const showProductDropdown = ref(false)
const selectedProduct = ref(null)
const services = ref([])
const saving = ref(false)
const existingServices = ref([])
const updatingExisting = ref(false)
const customerStatus = ref(null)
const isSaleStatus = ref(false)
const currencies = ref([])
const selectedCurrency = ref(null)

// Payment State
const showPaymentConfirm = ref(false)
const pendingPaymentService = ref(null)
const pendingPaymentIndex = ref(null)
const completingPayment = ref(false)

const newService = ref({
  price: 0,
  paidAmount: 0,
  offer: 0,
  remainingAmount: 0,
  note: ''
})

// Computed
const filteredProducts = computed(() => {
  if (!productSearch.value) return products.value.slice(0, 5)
  const search = productSearch.value.toLowerCase()
  return products.value.filter(p => p.name.toLowerCase().includes(search))
})

const totalOffer = computed(() => services.value.reduce((sum, s) => sum + (parseFloat(s.offer) || 0), 0))
const totalPaid = computed(() => services.value.reduce((sum, s) => sum + (parseFloat(s.paidAmount) || 0), 0))
const totalRemaining = computed(() => totalOffer.value - totalPaid.value)

const totalOfferExisting = computed(() => existingServices.value.reduce((sum, s) => sum + (parseFloat(s.offer) || 0), 0))
const totalPaidExisting = computed(() => existingServices.value.reduce((sum, s) => sum + (parseFloat(s.paidAmount) || 0), 0))
const totalRemainingExisting = computed(() => totalOfferExisting.value - totalPaidExisting.value)

// Methods
const fetchCurrencies = async () => {
  try {
    const response = await api('/currencies')
    currencies.value = response || []
  } catch (error) {
    console.error('Para birimleri alınamadı:', error)
  }
}

const searchProducts = async () => {
  try {
    if (!selectedCurrency.value) {
      products.value = []
      return
    }
    showProductDropdown.value = true
    const response = await api('/products?limit=50&currencyId=' + selectedCurrency.value.id)
    products.value = Array.isArray(response) ? response : response.data || []
  } catch (error) {
    console.error('Error loading products:', error)
  }
}

const selectProduct = (product) => {
  selectedProduct.value = product
  productSearch.value = product.name
  showProductDropdown.value = false
  newService.value.price = product.price || 0
  newService.value.offer = product.price || 0
  newService.value.paidAmount = 0
  calculateRemaining()
}

const calculateOffer = () => {
  if (newService.value.offer < newService.value.price) {
    newService.value.offer = newService.value.price
  }
  calculateRemaining()
}

const calculateRemaining = () => {
  const offer = newService.value.offer || 0
  const paidAmount = newService.value.paidAmount || 0
  newService.value.remainingAmount = Math.max(0, offer - paidAmount)
}

const calculateRemainingAmount = (service) => {
  if (!service) return 0
  const offer = parseFloat(service.offer) || 0
  const paidAmount = parseFloat(service.paidAmount) || 0
  return Math.max(0, offer - paidAmount)
}

const addService = () => {
  if (!selectedProduct.value) return
  const paidAmount = newService.value.paidAmount || 0
  const offer = newService.value.offer || 0
  const isPayCompleted = paidAmount >= offer && offer > 0

  services.value.push({
    product: selectedProduct.value.id,
    currency: selectedProduct.value.currency,
    productName: selectedProduct.value.name,
    price: newService.value.price,
    paidAmount: paidAmount,
    offer: offer,
    isPayCompleted: isPayCompleted,
    note: newService.value.note
  })

  cancelProductSelection()
}

const removeService = (index) => {
  services.value.splice(index, 1)
}

const cancelProductSelection = () => {
  selectedProduct.value = null
  productSearch.value = ''
  newService.value = { price: 0, paidAmount: 0, offer: 0, remainingAmount: 0, note: '' }
}

const saveServices = async () => {
  if (services.value.length === 0 || !props.customer) return
  saving.value = true
  try {
    const payload = {
      items: services.value.map(service => ({
        product: service.product,
        customer: props.customer.id,
        price: service.price,
        paidAmount: service.paidAmount,
        offer: service.offer,
        isPayCompleted: service.isPayCompleted,
        note: service.note || undefined,
        user: authStore.user?.id,
      }))
    }
    await api('/customer2product/bulk', { method: 'POST', body: payload })
    emit('saved')
    close()
  } catch (error) {
    console.error('Error saving services:', error)
    alert('Hizmetler kaydedilirken bir hata oluştu.')
  } finally {
    saving.value = false
  }
}

const close = () => {
  services.value = []
  existingServices.value = []
  selectedProduct.value = null
  productSearch.value = ''
  newService.value = { price: 0, paidAmount: 0, offer: 0, remainingAmount: 0, note: '' }
  emit('close')
}

const checkCustomerStatus = async () => {
  const statusId = props.customer?.status || props.customer?.statusId
  if (!props.customer || !statusId) {
    isSaleStatus.value = false
    return
  }
  try {
    const status = await api(`/statuses/${statusId}`)
    customerStatus.value = status
    isSaleStatus.value = status?.isSale === true
  } catch (error) {
    console.error('Error fetching customer status:', error)
    isSaleStatus.value = false
  }
}

const loadExistingServices = async () => {
  if (!props.customer?.id) {
    existingServices.value = []
    return
  }
  try {
    const response = await api(`/customer2product/customer/${props.customer.id}`)
    const customerServices = Array.isArray(response) ? response : response.data || []

    existingServices.value = await Promise.all(customerServices.map(async (service) => {
      selectedCurrency.value = service.product?.currency || null
      if (service.product && typeof service.product === 'object') {
        return {
          ...service,
          productId: service.product.id,
          productName: service.product.name || 'Ürün',
          paidAmount: service.paidAmount || 0,
          isPayCompleted: service.isPayCompleted || false
        }
      }
      const productId = service.productId || service.product
      if (productId) {
        try {
          const productResponse = await api(`/products/${productId}`)
          return {
            ...service,
            productId: productId,
            productName: productResponse.name || 'Ürün',
            paidAmount: service.paidAmount || 0,
            isPayCompleted: service.isPayCompleted || false
          }
        } catch {
          return { ...service, productId, productName: 'Ürün', paidAmount: service.paidAmount || 0, isPayCompleted: service.isPayCompleted || false }
        }
      }
      return { ...service, productName: 'Ürün', paidAmount: service.paidAmount || 0, isPayCompleted: service.isPayCompleted || false }
    }))
  } catch (error) {
    console.error('Error loading existing services:', error)
    existingServices.value = []
  }
}

const calculateExistingOffer = (index) => {
  const service = existingServices.value[index]
  if (service && service.offer < service.price) {
    service.offer = service.price
  }
}

const calculateExistingRemaining = (index) => {
  const service = existingServices.value[index]
  if (service && !service.isPayCompleted && service.paidAmount >= service.offer && service.offer > 0) {
    service.isPayCompleted = true
  }
}

const openPaymentCompleteConfirm = (service, index) => {
  pendingPaymentService.value = service
  pendingPaymentIndex.value = index
  showPaymentConfirm.value = true
}

const closePaymentConfirm = () => {
  showPaymentConfirm.value = false
  pendingPaymentService.value = null
  pendingPaymentIndex.value = null
}

const confirmPaymentComplete = async () => {
  if (!pendingPaymentService.value) return
  completingPayment.value = true
  try {
    const service = pendingPaymentService.value
    const offer = parseFloat(service.offer) || 0
    await api(`/customer2product/${service.id}`, {
      method: 'PUT',
      body: {
        product: service.productId || service.product?.id || service.product,
        customer: props.customer.id,
        price: parseFloat(service.price) || 0,
        paidAmount: offer,
        offer: offer,
        isPayCompleted: true,
        note: service.note || undefined
      }
    })
    service.paidAmount = offer
    service.isPayCompleted = true
    closePaymentConfirm()
    alert('Ödeme başarıyla tamamlandı!')
  } catch (error) {
    console.error('Error completing payment:', error)
    alert('Ödeme tamamlanırken bir hata oluştu.')
  } finally {
    completingPayment.value = false
  }
}

const updateExistingServices = async () => {
  if (existingServices.value.length === 0 || !props.customer) return
  updatingExisting.value = true
  try {
    const updatePromises = existingServices.value.map(service =>
      api(`/customer2product/${service.id}`, {
        method: 'PUT',
        body: {
          product: service.productId || service.product?.id || service.product,
          customer: props.customer.id,
          price: service.price || 0,
          paidAmount: service.paidAmount || 0,
          offer: service.offer || 0,
          isPayCompleted: service.isPayCompleted || false,
          note: service.note || undefined
        }
      })
    )
    await Promise.all(updatePromises)
    alert('Hizmetler başarıyla güncellendi!')
  } catch (error) {
    console.error('Error updating services:', error)
    alert('Hizmetler güncellenirken bir hata oluştu.')
  } finally {
    updatingExisting.value = false
  }
}

const deleteExistingService = async (serviceId) => {
  if (!confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) return
  try {
    await api(`/customer2product/${serviceId}`, { method: 'DELETE' })
    existingServices.value = existingServices.value.filter(s => s.id !== serviceId)
  } catch (error) {
    console.error('Error deleting service:', error)
    alert('Hizmet silinirken bir hata oluştu.')
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price || 0)
}

// Lifecycle
onMounted(() => {
  searchProducts()
  fetchCurrencies()
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showProductDropdown.value = false
    }
  })
})

watch(() => props.customer, async (newCustomer, oldCustomer) => {
  if (newCustomer?.id !== oldCustomer?.id) {
    existingServices.value = []
    isSaleStatus.value = false
    customerStatus.value = null
  }
  if (newCustomer && props.show) {
    await checkCustomerStatus()
    await loadExistingServices()
  }
}, { deep: true })

watch(() => props.show, async (isOpen) => {
  if (isOpen && props.customer) {
    services.value = []
    existingServices.value = []
    await checkCustomerStatus()
    await loadExistingServices()
  }
})

watch(selectedCurrency, async (newCurrency, oldCurrency) => {
  if (newCurrency?.id === oldCurrency?.id) return
  cancelProductSelection()
  searchProducts()
})
</script>