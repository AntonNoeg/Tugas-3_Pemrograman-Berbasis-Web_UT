<template>
  <div class="card border-0 shadow-sm rounded-3">
      <div class="card-header bg-white py-3 border-0">
          <h5 class="fw-bold m-0"><i class="bi bi-truck me-2 text-primary"></i>Pelacakan Pengiriman (Delivery Order)</h5>
      </div>
      <div class="card-body">
          <div class="row mb-4">
              <div class="col-12 col-md-8 mx-auto">
                  <div class="input-group input-group-lg shadow-sm">
                      <span class="input-group-text bg-white border-end-0"><i class="bi bi-search text-muted"></i></span>
                      <input type="text" class="form-control border-start-0" 
                             v-model="trackingSearch" 
                             @keyup.esc="trackingSearch = ''" 
                             @keyup.enter="$event.target.blur()"
                             placeholder="Cari berdasarkan No. DO, Nama, atau NIM (Tekan Esc untuk reset)">
                  </div>
              </div>
          </div>

          <div class="row g-4">
              <div v-for="item in filteredTracking" :key="item.do_number" class="col-12 col-lg-6">
                  <div class="card border-0 shadow-sm rounded-3 h-100">
                      <div class="card-header bg-light py-3 d-flex justify-content-between align-items-center">
                          <span class="fw-bold text-primary fs-6">{{ item.do_number }}</span>
                          <span class="badge bg-success badge-status">{{ item.status }}</span>
                      </div>
                      <div class="card-body">
                          <div class="row mb-3">
                              <div class="col-6">
                                  <div class="small text-muted">Penerima</div>
                                  <div class="fw-bold text-dark">{{ item.nama }}</div>
                                  <div class="small text-muted">NIM: {{ item.nim }}</div>
                              </div>
                              <div class="col-6 text-end">
                                  <div class="small text-muted">Tgl Kirim & Ekspedisi</div>
                                  <div class="fw-bold">{{ formatTanggal(item.tanggalKirim) }}</div>
                                  <span class="badge bg-secondary opacity-75">{{ item.ekspedisi }}</span>
                              </div>
                          </div>
                          <div class="small bg-light p-2 rounded mb-3">
                              <strong>Paket/Item:</strong> {{ item.paket }} | Total: {{ formatRupiah(item.total) }}
                          </div>

                          <h6 class="fw-bold small text-secondary mb-3"><i class="bi bi-clock-history me-1"></i> Timeline Perjalanan</h6>
                          <div class="timeline">
                              <div v-for="(log, lIdx) in item.perjalanan" :key="lIdx" class="timeline-item">
                                  <div class="fw-bold small text-dark">{{ log.waktu }}</div>
                                  <div class="small text-muted">{{ log.keterangan }}</div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              <div v-if="filteredTracking.length === 0" class="col-12 text-center py-5 text-muted">
                  <i class="bi bi-search fs-1 d-block mb-2 text-secondary"></i>
                  Data pengiriman tidak ditemukan.
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { formatRupiah } from '@/utils/formatter'

const dataJSON = inject('dataJSON')
const trackingSearch = ref('')

// Fungsi untuk memastikan tanggal selalu tampil DD/MM/YYYY di layar Tracking
const formatTanggal = (dateStr) => {
    if (!dateStr) return ''
    
    // Jika data sudah berformat DD/MM/YYYY (dari pesanan baru), langsung tampilkan
    if (dateStr.includes('/')) return dateStr 
    
    // Jika data masih berformat YYYY-MM-DD (dari data lama), ubah urutannya
    const parts = dateStr.split('-')
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`
    }
    return dateStr
}

const filteredTracking = computed(() => {
    return dataJSON.value.tracking.filter(item => {
        const s = trackingSearch.value.toLowerCase()
        return item.do_number.toLowerCase().includes(s) ||
               item.nama.toLowerCase().includes(s) ||
               item.nim.includes(s)
    })
})
</script>
