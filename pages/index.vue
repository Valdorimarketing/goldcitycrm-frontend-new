<script setup>
// Redirect to dashboard
await navigateTo('/dashboard')
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-4">Valdori CRM</h1>
      <p class="text-gray-600 mb-4">Yönlendiriliyor...</p>
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto"></div>
    </div>
  </div>
</template> 