<template>
  <header
    class="fixed top-0 inset-x-0 z-50 backdrop-blur-md
           bg-slate-950/70 border-b border-white/10"
  >
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      
      <!-- BRAND -->
      <RouterLink
        to="/"
        class="flex items-center gap-2 text-slate-100 font-semibold tracking-wide"
      >
        <span class="text-xl font-serif">VΛLDEX</span>
        <span class="text-xs text-slate-400 hidden sm:block">
          Digital Photo Booth
        </span>
      </RouterLink>

      <!-- ACTION -->
      <RouterLink
        to="/studio"
        class="px-4 py-2 rounded-xl
               bg-indigo-600 hover:bg-indigo-500
               text-white text-sm font-medium transition"
      >
        Start Session
      </RouterLink>

    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
