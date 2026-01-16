<template>
  <div class="min-h-screen bg-[var(--bg-main)]">
    <AppHeader />

    <main
      class="max-w-6xl mx-auto px-6 py-10
             grid grid-cols-1 md:grid-cols-[1fr_360px] gap-10"
    >
      <!-- ================= CAMERA PANEL ================= -->
      <section class="bg-[var(--panel)] rounded-3xl p-6 shadow-xl">
        <!-- PREVIEW -->
        <div class="relative rounded-2xl overflow-hidden bg-black aspect-[4/3]">
          <!-- FLASH -->
          <div
            v-if="flash"
            class="absolute inset-0 bg-white z-30 animate-flash"
          />

          <!-- LOGO -->
          <div class="absolute bottom-3 right-4 z-20 text-white text-xs tracking-widest">
            VΛLDEX
          </div>

          <!-- PREVIEW CANVAS (SOURCE OF TRUTH) -->
          <canvas
            ref="previewCanvas"
            class="absolute inset-0 w-full h-full"
          />

          <CountdownOverlay v-if="countdown > 0" :value="countdown" />
        </div>

        <!-- CONTROLS -->
        <div class="flex gap-2 mt-4">
          <button
            @click="mirror = !mirror"
            class="flex-1 py-2 rounded-xl text-sm font-semibold
                   bg-slate-700 text-white"
          >
            {{ mirror ? 'Mirror ON' : 'Mirror OFF' }}
          </button>

          <button
            @click="showSafe = !showSafe"
            class="flex-1 py-2 rounded-xl text-sm font-semibold
                   bg-slate-700 text-white"
          >
            Safe Area {{ showSafe ? 'ON' : 'OFF' }}
          </button>
        </div>

        <ModeCard :mode="mode" @change="mode = $event" />
        <FilterSlider />
        <ColorPicker v-model="frameColor" />

        <div class="mt-3">
      <label class="text-xs text-slate-300 block mb-1">
        Filter
      </label>
      <select
        v-model="filter"
        class="w-full px-3 py-2 rounded-xl bg-slate-800 text-white text-sm"
      >
        <option value="normal">Normal</option>
        <option value="bw">B&W</option>
        <option value="warm">Warm</option>
        <option value="cool">Cool</option>
        <option value="vintage">Vintage</option>
      </select>
    </div>
    <div class="mt-3 space-y-2">
      <label class="text-xs text-slate-300">
        Brightness ({{ brightness }}%)
      </label>
      <input
        type="range"
        min="50"
        max="150"
        v-model="brightness"
        class="w-full"
      />

      <label class="text-xs text-slate-300">
        Contrast ({{ contrast }}%)
      </label>
      <input
        type="range"
        min="50"
        max="150"
        v-model="contrast"
        class="w-full"
      />
    </div>

        <button
          @click="startCapture"
          class="mt-4 w-full py-3 rounded-xl font-semibold text-white
                 bg-[var(--primary)]"
        >
          Capture
        </button>
      </section>

      <!-- ================= COLLAGE ================= -->
      <section class="bg-[var(--panel)] rounded-3xl p-5 shadow-xl">
        <h3 class="text-center font-semibold mb-3">
          Collage Preview
        </h3>

        <div
          class="rounded-2xl p-3"
          :class="isSixMode ? 'grid grid-cols-2 gap-2' : 'flex flex-col gap-2'"
          :style="{ background: frameColor }"
        >
          <div
            v-for="(img, i) in photos"
            :key="i"
            class="relative rounded-xl overflow-hidden aspect-[4/3] bg-white"
          >
            <img :src="img" class="w-full h-full object-cover" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 mt-4">
          <!-- STRIP SELALU ADA JIKA FOTO >= 1 -->
          <button
            v-if="canExportStrip"
            @click="exportStrip"
            class="py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600"
          >
            Export Strip
          </button>

          <!-- GRID MUNCUL HANYA JIKA FOTO >= 4 -->
          <button
            v-if="canExportGrid"
            @click="exportGrid"
            class="py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600"
          >
            Export Grid
          </button>
        </div>
        <button
          v-if="photos.length"
          @click="clearPhotos"
          class="mt-2 w-full py-2 rounded-xl text-sm font-semibold
                bg-rose-600 text-white"
        >
          Clear Photos
        </button>

      </section>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import ModeCard from '@/components/ModeCard.vue'
import CountdownOverlay from '@/components/CountdownOverlay.vue'
import FilterSlider from '@/components/FilterSlider.vue'
import ColorPicker from '@/components/ColorPicker.vue'

/* ================= STATE ================= */
const previewCanvas = ref(null)
const video = document.createElement('video')
const filter = ref('normal')
const brightness = ref(100)
const contrast = ref(100)


const photos = ref([])
const countdown = ref(0)
const mode = ref(3)
const mirror = ref(false)
const flash = ref(false)
const frameColor = ref('#ffffff')
const showSafe = ref(true)

const isSixMode = computed(() => mode.value === 6)
const canExportGrid = computed(() => photos.value.length >= 4)
const canExportStrip = computed(() => photos.value.length > 0)


let ctx

/* ================= CAMERA ================= */
onMounted(async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: 1280, height: 960 }
  })
  video.srcObject = stream
  await video.play()

  ctx = previewCanvas.value.getContext('2d')
  drawPreview()
})

/* ================= PREVIEW LOOP ================= */
const drawPreview = () => {
  const canvas = previewCanvas.value
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()

  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const vw = video.videoWidth
  const vh = video.videoHeight
  if (!vw || !vh) {
    requestAnimationFrame(drawPreview)
    return
  }

  const vr = vw / vh
  const cr = rect.width / rect.height

  let sx = 0, sy = 0, sw = vw, sh = vh
  if (vr > cr) {
    sw = vh * cr
    sx = (vw - sw) / 2
  } else {
    sh = vw / cr
    sy = (vh - sh) / 2
  }

  ctx.clearRect(0, 0, rect.width, rect.height)

  if (mirror.value) {
    ctx.save()
    ctx.translate(rect.width, 0)
    ctx.scale(-1, 1)
  }

  ctx.filter = filterCSS.value
  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, rect.width, rect.height)
  ctx.filter = 'none'


  if (mirror.value) ctx.restore()

  /* SAFE AREA */
  if (showSafe.value) {
    const m = rect.width * 0.12
    ctx.setLineDash([12, 8])
    ctx.lineWidth = 2
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'
    ctx.strokeRect(m, m, rect.width - m * 2, rect.height - m * 2)
    ctx.setLineDash([])
  }

  requestAnimationFrame(drawPreview)
}

const filterCSS = computed(() => {
  const base = {
    normal: '',
    bw: 'grayscale(100%)',
    warm: 'sepia(35%) saturate(120%)',
    cool: 'hue-rotate(180deg)',
    vintage: 'sepia(40%) contrast(110%)'
  }

  return `
    ${base[filter.value]}
    brightness(${brightness.value}%)
    contrast(${contrast.value}%)
  `
})

/* ================= CAPTURE ================= */
const startCapture = async () => {
  photos.value = []
  for (let i = 0; i < mode.value; i++) {
    await runCountdown()
    capture()
  }
}

const runCountdown = () =>
  new Promise(res => {
    countdown.value = 3
    const t = setInterval(() => {
      countdown.value--
      if (!countdown.value) {
        clearInterval(t)
        res()
      }
    }, 1000)
  })

const capture = () => {
  flash.value = true
  setTimeout(() => (flash.value = false), 120)

  const src = previewCanvas.value
  const c = document.createElement('canvas')
  c.width = src.width
  c.height = src.height

  const cctx = c.getContext('2d')
  cctx.filter = filterCSS.value
  cctx.drawImage(src, 0, 0)
  cctx.filter = 'none'


  // FRAME
  cctx.lineWidth = 40
  cctx.strokeStyle = '#fff'
  cctx.strokeRect(0, 0, c.width, c.height)

  // LOGO
  cctx.font = '24px serif'
  cctx.fillStyle = '#fff'
  cctx.fillText('VΛLDEX', c.width - 140, c.height - 30)

  photos.value.push(c.toDataURL('image/png'))
}

/* ================= EXPORT ================= */
const exportStrip = () => exportCanvas('strip')
const exportGrid = () => exportCanvas('grid')

const clearPhotos = () => {
  photos.value = []
}


const exportCanvas = async type => {
  const GAP = 40
  const COLS = type === 'grid' ? 2 : 1
  const ROWS = type === 'grid'
    ? Math.ceil(photos.value.length / 2)
    : photos.value.length

  const w = previewCanvas.value.width
  const h = previewCanvas.value.height

  const canvas = document.createElement('canvas')
  canvas.width = COLS * w + GAP * (COLS + 1)
  canvas.height = ROWS * h + GAP * (ROWS + 1)

  const ctx = canvas.getContext('2d')
  ctx.fillStyle = frameColor.value
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  for (let i = 0; i < photos.value.length; i++) {
    const img = new Image()
    img.src = photos.value[i]
    await img.decode()

    const col = type === 'grid' ? i % 2 : 0
    const row = type === 'grid' ? Math.floor(i / 2) : i

    const x = GAP + col * (w + GAP)
    const y = GAP + row * (h + GAP)

    ctx.drawImage(img, x, y, w, h)
  }

  const a = document.createElement('a')
  a.download = `valdex-${type}.png`
  a.href = canvas.toDataURL('image/png')
  a.click()
}
</script>

<style>
@keyframes flash {
  from { opacity: 1 }
  to { opacity: 0 }
}
.animate-flash {
  animation: flash .12s ease-out;
}
</style>