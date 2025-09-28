<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// Light mode'u varsayılan olarak ayarla
onMounted(() => {
  // localStorage'da theme yoksa light yap
  const theme = localStorage.getItem('theme')
  if (!theme) {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  } else if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    // theme === 'light'
    document.documentElement.classList.remove('dark')
  }
})
</script>