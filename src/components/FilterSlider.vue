<template>
  <div class="space-y-1">
    <label class="text-sm font-medium text-gray-700">
      {{ label }}
    </label>

    <input
      type="range"
      min="50"
      max="150"
      :value="modelValue"
      @input="$emit('update:modelValue', +$event.target.value)"
      class="w-full accent-blue-600"
    />
  </div>
</template>

<script setup>
defineProps({
  label: String,
  modelValue: Number
})

defineEmits(["update:modelValue"])
</script>
