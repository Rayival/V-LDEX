<template>
  <div class="min-h-screen bg-[var(--bg-main)] flex flex-col overflow-hidden">
    <!-- HEADER -->
    <AppHeader />

    <!-- HERO -->
    <main class="flex-1 flex items-center">
      <div class="max-w-7xl mx-auto px-6 w-full">
        <div class="max-w-3xl">

          <!-- BRAND -->
          <h1
            class="text-6xl md:text-7xl font-semibold tracking-tight
                   text-slate-100 mb-6"
          >
            V<span class="opacity-80">Λ</span>LDEX
          </h1>

          <!-- TAGLINE -->
          <h2
            class="text-2xl md:text-3xl font-light
                   text-slate-300 mb-8 leading-relaxed"
          >
            Capture. Compose. Export.
          </h2>

          <!-- DESCRIPTION -->
          <p class="text-slate-400 max-w-xl mb-12">
            A modern digital photo booth system designed for real-time capture,
            smart composition, and instant export — built for events and experiences.
          </p>

          <!-- CTA -->
          <router-link
            to="/studio"
            class="inline-flex items-center gap-3
                   px-8 py-4 rounded-2xl
                   bg-indigo-600 text-white font-medium
                   hover:bg-indigo-500
                   hover:scale-[1.02]
                   transition-all duration-300
                   shadow-lg shadow-indigo-900/30"
          >
            <!-- ICON -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 7h3l2-3h8l2 3h3v13H3V7z"
              />
              <circle cx="12" cy="13" r="3" />
            </svg>

            Launch Booth
          </router-link>

        </div>
      </div>
    </main>

    <!-- FOOTER -->
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>
