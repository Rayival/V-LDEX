<template>
  <div class="flex gap-2 mt-4">
    <button
      v-for="m in modes"
      :key="m"
      @click="$emit('change', m)"
      :class="[
        'flex-1 py-2 rounded-lg text-sm font-semibold',
        m === mode ? 'bg-black text-white' : 'bg-gray-200'
      ]"
    >
      {{ m }}x
    </button>
  </div>
</template>

<script setup>
defineProps({ mode: Number })
defineEmits(['change'])

const modes = [1, 3, 4, 6]
</script>
