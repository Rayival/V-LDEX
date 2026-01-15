<template>
  <div class="absolute inset-0 flex items-center justify-center bg-black/40">
    <span
      class="text-white text-7xl font-bold animate-count"
    >
      {{ value }}
    </span>
  </div>
</template>

<script setup>
defineProps({ value: Number })
</script>

<style scoped>
@keyframes pop {
  0% { transform: scale(.5); opacity: 0 }
  50% { transform: scale(1.2); opacity: 1 }
  100% { transform: scale(1); opacity: 1 }
}
.animate-count {
  animation: pop .9s ease;
}
</style>
