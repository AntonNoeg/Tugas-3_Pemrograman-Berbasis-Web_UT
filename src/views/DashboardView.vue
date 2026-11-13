<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h4 class="fw-bold text-dark m-0">Dashboard SITTA</h4>
            <p class="text-muted small m-0">Pengelolaan Tiras & Distribusi Bahan Ajar Universitas Terbuka</p>
        </div>
        <span class="badge bg-primary px-3 py-2 fs-6"><i class="bi bi-calendar3 me-1"></i> Tahun Ajar 2026</span>
    </div>

    <div class="row g-3 mb-4">
        <div class="col-12 col-sm-6 col-xl-3">
            <SummaryCard title="Jenis Bahan Ajar" :value="totalJenisBahanAjar" icon="bi-book" textColor="text-dark" bgColor="bg-primary" />
        </div>
        <div class="col-12 col-sm-6 col-xl-3">
            <SummaryCard title="Total Stok Fisik" :value="totalStokFisik" icon="bi-layers-half" textColor="text-success" bgColor="bg-success" />
        </div>
        <div class="col-12 col-sm-6 col-xl-3">
            <SummaryCard title="Jumlah Paket Ajar" :value="dataJSON.paket.length" icon="bi-collection" textColor="text-warning" bgColor="bg-warning" />
        </div>
        <div class="col-12 col-sm-6 col-xl-3">
            <SummaryCard title="Pengiriman Aktif (DO)" :value="dataJSON.tracking.length" icon="bi-truck" textColor="text-info" bgColor="bg-info" />
        </div>
    </div>

    <div class="row g-4">
        <div class="col-12 col-lg-7">
            <div class="card border-0 shadow-sm rounded-3 h-100">
                <div class="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                    <h6 class="fw-bold m-0 text-danger"><i class="bi bi-exclamation-triangle-fill me-2"></i>Peringatan Stok Menipis / Kosong</h6>
                    <router-link to="/stock" class="btn btn-sm btn-outline-primary">Lihat Semua</router-link>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th>Kode</th>
                                    <th>Judul Bahan Ajar</th>
                                    <th>UPBJJ</th>
                                    <th>Sisa Stok</th>
                                    <th>Safety Stock</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in stokRendahList" :key="item.kode">
                                    <td class="fw-bold">{{ item.kode }}</td>
                                    <td>{{ item.judul }}</td>
                                    <td>{{ item.upbjj }}</td>
                                    <td class="fw-bold text-danger">{{ item.qty }} buah</td>
                                    <td>{{ item.safety }} buah</td>
                                    <td>
                                        <span v-if="item.qty === 0" class="badge bg-danger">Kosong</span>
                                        <span v-else class="badge bg-warning text-dark">Menipis</span>
                                    </td>
                                </tr>
                                <tr v-if="stokRendahList.length === 0">
                                    <td colspan="6" class="text-center py-3 text-muted">Semua stok bahan ajar dalam kondisi aman.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-12 col-lg-5">
            <div class="card border-0 shadow-sm rounded-3 h-100">
                <div class="card-header bg-white py-3 border-0">
                    <h6 class="fw-bold m-0 text-dark"><i class="bi bi-clock-history me-2 text-primary"></i>Ringkasan Pengiriman Terbaru</h6>
                </div>
                <div class="card-body">
                    <div class="list-group list-group-flush">
                        <div v-for="(item, index) in dataJSON.tracking.slice(0, 3)" :key="index" class="list-group-item px-0 py-3">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <span class="fw-bold text-primary">{{ item.do_number }}</span>
                                <span class="badge bg-info text-dark">{{ item.status }}</span>
                            </div>
                            <div class="small text-dark fw-medium">{{ item.nama }} (NIM: {{ item.nim }})</div>
                            <div class="small text-muted"><i class="bi bi-box me-1"></i>{{ item.paket }} | <i class="bi bi-send me-1"></i>{{ item.ekspedisi }}</div>
                        </div>
                    </div>
                    <router-link to="/tracking" class="btn btn-primary w-100 mt-3">
                        Pelacakan Pengiriman Lengkap <i class="bi bi-arrow-right ms-1"></i>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'
import SummaryCard from '@/components/dashboard/SummaryCard.vue'

const dataJSON = inject('dataJSON')

const totalJenisBahanAjar = computed(() => dataJSON.value.stok.length)
const totalStokFisik = computed(() => dataJSON.value.stok.reduce((acc, curr) => acc + curr.qty, 0))
const stokRendahList = computed(() => dataJSON.value.stok.filter(item => item.qty < item.safety || item.qty === 0))
</script>
