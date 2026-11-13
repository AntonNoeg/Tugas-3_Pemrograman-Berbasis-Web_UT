<template>
  <div class="card card-stat shadow-sm h-100 p-3">
    <div class="d-flex align-items-center justify-content-between">
      <div>
        <div class="text-muted small fw-semibold">{{ title }}</div>
        <div class="fs-3 fw-bold mt-1" :class="textColor">{{ value }}</div>
      </div>
      <div class="icon-box bg-opacity-10" :class="[bgColor, textColor]">
        <i class="bi" :class="icon"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
  icon: String,
  textColor: {
    type: String,
    default: 'text-dark'
  },
  bgColor: {
    type: String,
    default: 'bg-primary'
  }
})
</script>
