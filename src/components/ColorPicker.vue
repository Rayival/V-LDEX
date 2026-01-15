<template>
  <div class="flex gap-2 mt-4">
    <button
      v-for="c in colors"
      :key="c"
      @click="$emit('update:modelValue', c)"
      :style="{ background: c }"
      class="w-6 h-6 rounded-full border-2 border-white shadow"
    />
  </div>
</template>

<script setup>
defineProps({ modelValue: String })
defineEmits(['update:modelValue'])

const colors = ['#facc15', '#f472b6', '#60a5fa', '#34d399', '#111827']
</script>
