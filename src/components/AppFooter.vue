<template>
  <footer class="border-t border-white/10 bg-slate-950/80">
    <div
      class="max-w-7xl mx-auto px-6 py-6
             flex flex-col md:flex-row
             items-center justify-between gap-4"
    >
      <p class="text-sm text-slate-400">
        © {{ year }} VΛLDEX
      </p>

      <p class="text-xs text-slate-500">
        Crafted by
        <a
          href="https://rayival.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          class="text-slate-300 hover:text-white transition-colors underline underline-offset-4"
        >
          Rayival Dede Saputra
        </a>
      </p>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>
