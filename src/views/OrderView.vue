<template>
  <div class="row g-4 justify-content-center">
      <div class="col-12 col-lg-8">
          <div class="card border-0 shadow-sm rounded-3">
              <div class="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                  <h5 class="fw-bold m-0"><i class="bi bi-cart-plus me-2 text-primary"></i>Formulir Pemesanan Bahan Ajar</h5>
                  <div class="btn-group btn-group-sm" role="group">
                      <button type="button" class="btn" :class="orderMode === 'satuan' ? 'btn-primary' : 'btn-outline-primary'" @click="orderMode = 'satuan'">Pemesanan Satuan</button>
                      <button type="button" class="btn" :class="orderMode === 'paket' ? 'btn-primary' : 'btn-outline-primary'" @click="orderMode = 'paket'">Pemesanan Paket</button>
                  </div>
              </div>
              <div class="card-body">
                  <form @submit.prevent="submitOrder">
                      <h6 class="fw-bold text-secondary mb-3"><i class="bi bi-person me-1"></i> Data Pemesan</h6>
                      <div class="row g-3 mb-4">
                          <div class="col-md-6">
                              <label class="form-label small fw-semibold">NIM Mahasiswa *</label>
                              <input type="text" class="form-control" v-model="orderForm.nim" placeholder="Contoh: 041234567" required>
                          </div>
                          <div class="col-md-6">
                              <label class="form-label small fw-semibold">Nama Lengkap *</label>
                              <input type="text" class="form-control" v-model="orderForm.nama" placeholder="Nama Mahasiswa" required>
                          </div>
                          <div class="col-md-6">
                              <label class="form-label small fw-semibold">UPBJJ Tujuan *</label>
                              <select class="form-select" v-model="orderForm.upbjj" required>
                                  <option value="">-- Pilih UPBJJ --</option>
                                  <option v-for="u in dataJSON.upbjjList" :key="u" :value="u">{{ u }}</option>
                              </select>
                          </div>
                          <div class="col-md-6">
                              <label class="form-label small fw-semibold">Jasa Pengiriman *</label>
                              <select class="form-select" v-model="orderForm.ekspedisi" required>
                                  <option value="">-- Pilih Pengiriman --</option>
                                  <option v-for="p in dataJSON.pengirimanList" :key="p.kode" :value="p.nama">{{ p.nama }}</option>
                              </select>
                          </div>
                          <div class="col-md-4">
                              <label class="form-label small fw-semibold">Tanggal Kirim *</label>
                              <input type="date" class="form-control" v-model="orderForm.tanggalKirim" required>
                          </div>
                      </div>

                      <h6 class="fw-bold text-secondary mb-3"><i class="bi bi-box me-1"></i> Pilih Bahan Ajar</h6>
                      
                      <div v-if="orderMode === 'satuan'" class="mb-4">
                          <div class="row g-2 mb-2">
                              <div class="col-md-8">
                                  <select class="form-select" v-model="selectedSatuanKode">
                                      <option value="">-- Pilih Buku --</option>
                                      <option v-for="buku in dataJSON.stok" :key="buku.kode" :value="buku.kode">
                                          {{ buku.kode }} - {{ buku.judul }} ({{ formatRupiah(buku.harga) }})
                                      </option>
                                  </select>
                              </div>
                              <div class="col-md-4">
                                  <button type="button" class="btn btn-outline-primary w-100" @click="tambahItemSatuan" :disabled="!selectedSatuanKode">
                                      <i class="bi bi-plus-lg me-1"></i> Tambah Buku
                                  </button>
                              </div>
                          </div>

                          <ul class="list-group mb-3" v-if="orderForm.itemsSatuan.length > 0">
                              <li v-for="(item, idx) in orderForm.itemsSatuan" :key="idx" class="list-group-item d-flex justify-content-between align-items-center">
                                  <div>
                                      <div class="fw-bold">{{ item.kode }} - {{ item.judul }}</div>
                                      <div class="small text-muted">{{ formatRupiah(item.harga) }} / eksemplar</div>
                                  </div>
                                  <div class="d-flex align-items-center gap-2">
                                      <input type="number" min="1" class="form-control form-control-sm" style="width:70px" v-model.number="item.qty">
                                      <button type="button" class="btn btn-sm btn-outline-danger" @click="orderForm.itemsSatuan.splice(idx, 1)"><i class="bi bi-trash"></i></button>
                                  </div>
                              </li>
                          </ul>
                      </div>

                      <div v-if="orderMode === 'paket'" class="mb-4">
                          <label class="form-label small fw-semibold">Pilih Paket Bahan Ajar *</label>
                          <select class="form-select" v-model="orderForm.paketKode">
                              <option value="">-- Pilih Paket --</option>
                              <option v-for="pkt in dataJSON.paket" :key="pkt.kode" :value="pkt.kode">
                                  {{ pkt.nama }} ({{ formatRupiah(pkt.harga) }})
                              </option>
                          </select>
                          
                          <div v-if="selectedPaketDetail" class="alert alert-info mt-3 py-2 small">
                              <strong>Rincian Isi Paket:</strong> {{ selectedPaketDetail.isi.join(', ') }}
                          </div>
                      </div>

                      <div class="card bg-light border-0 p-3 mb-4">
                          <div class="d-flex justify-content-between mb-2">
                              <span>Subtotal Bahan Ajar</span>
                              <span class="fw-bold">{{ formatRupiah(kalkulasiOrder.subtotal) }}</span>
                          </div>
                          <div class="d-flex justify-content-between mb-2">
                              <span>Ongkos Kirim</span>
                              <span class="fw-bold">{{ formatRupiah(kalkulasiOrder.ongkir) }}</span>
                          </div>
                          <hr class="my-2">
                          <div class="d-flex justify-content-between fs-5 fw-bold text-primary">
                              <span>Total Bayar</span>
                              <span>{{ formatRupiah(kalkulasiOrder.total) }}</span>
                          </div>
                      </div>

                      <button type="submit" class="btn btn-success w-100 py-2 fw-bold" :disabled="!isOrderValid">
                          <i class="bi bi-check-circle-fill me-1"></i> Proses Pemesanan
                      </button>
                  </form>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { formatRupiah } from '@/utils/formatter'

const dataJSON = inject('dataJSON')
const router = useRouter()

const orderMode = ref('satuan')
const selectedSatuanKode = ref('')
const todayISO = new Date().toISOString().split('T')[0]
const orderForm = ref({
    nim: '', nama: '', upbjj: '', ekspedisi: '', tanggalKirim: todayISO, itemsSatuan: [], paketKode: ''
})
    watch(orderMode, (newMode) => {    // --> fungsi watcher
        if (newMode === 'satuan') {
           orderForm.value.paketKode = ''
            } else {
            orderForm.value.itemsSatuan = []
            selectedSatuanKode.value = ''
        }
})

const formatTanggalIndo = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

const selectedPaketDetail = computed(() => {
    return dataJSON.value.paket.find(p => p.kode === orderForm.value.paketKode)
})

const tambahItemSatuan = () => {
    const buku = dataJSON.value.stok.find(b => b.kode === selectedSatuanKode.value)
    if (buku) {
        const existing = orderForm.value.itemsSatuan.find(i => i.kode === buku.kode)
        if (existing) {
            existing.qty += 1
        } else {
            orderForm.value.itemsSatuan.push({ kode: buku.kode, judul: buku.judul, harga: buku.harga, qty: 1 })
        }
    }
    selectedSatuanKode.value = ''
}

const kalkulasiOrder = computed(() => {
    let subtotal = 0
    if (orderMode.value === 'satuan') {
        subtotal = orderForm.value.itemsSatuan.reduce((acc, item) => acc + (item.harga * item.qty), 0)
    } else {
        if (selectedPaketDetail.value) {
            subtotal = selectedPaketDetail.value.harga
        }
    }
    const ongkir = orderForm.value.ekspedisi.includes('Ekspres') ? 30000 : (orderForm.value.ekspedisi ? 15000 : 0)
    return { subtotal, ongkir, total: subtotal + ongkir }
})

const isOrderValid = computed(() => {
    const basicValid = orderForm.value.nim && orderForm.value.nama && orderForm.value.upbjj && orderForm.value.ekspedisi
    if (orderMode.value === 'satuan') {
        return basicValid && orderForm.value.itemsSatuan.length > 0
    } else {
        return basicValid && orderForm.value.paketKode
    }
})

const submitOrder = () => {
    if (!isOrderValid.value) return

    const today = new Date().toISOString().split('T')[0]
    const nowStr = new Date().toLocaleString('id-ID')
    const newDONumber = `DO2025-${String(dataJSON.value.tracking.length + 1).padStart(4, '0')}`

    let itemLabel = ''
    if (orderMode.value === 'satuan') {
        itemLabel = orderForm.value.itemsSatuan.map(i => `${i.kode} (x${i.qty})`).join(', ')
    } else {
        itemLabel = selectedPaketDetail.value.nama
    }

    if (orderMode.value === 'satuan') {
        orderForm.value.itemsSatuan.forEach(orderedItem => {
            const targetStok = dataJSON.value.stok.find(s => s.kode === orderedItem.kode)
            if (targetStok) targetStok.qty = Math.max(0, targetStok.qty - orderedItem.qty)
        })
    } else if (selectedPaketDetail.value) {
        selectedPaketDetail.value.isi.forEach(bukuKode => {
            const targetStok = dataJSON.value.stok.find(s => s.kode === bukuKode)
            if (targetStok) targetStok.qty = Math.max(0, targetStok.qty - 1)
        })
    }

    dataJSON.value.tracking.unshift({
        do_number: newDONumber,
        nim: orderForm.value.nim,
        nama: orderForm.value.nama,
        status: "Dalam Perjalanan",
        ekspedisi: orderForm.value.ekspedisi,
        tanggalKirim: today,
        paket: itemLabel,
        total: kalkulasiOrder.value.total,
        perjalanan: [
            { waktu: nowStr, keterangan: `Pesanan diterima & diproses di UPBJJ ${orderForm.value.upbjj}` }
        ]
    })

    // Menampilkan Popup Modern dengan Rincian Pesanan
    Swal.fire({
        title: 'Pemesanan Berhasil!',
        icon: 'success',
        html: `
            <div class="text-start mt-3" style="font-size: 0.95rem;">
                <table class="table table-sm table-borderless">
                    <tr><td class="text-muted" style="width: 120px;">No. DO</td><td class="fw-bold text-primary">: ${newDONumber}</td></tr>
                    <tr><td class="text-muted">Pemesan</td><td class="fw-bold">: ${orderForm.value.nama} (${orderForm.value.nim})</td></tr>
                    <tr><td class="text-muted">Tujuan</td><td class="fw-bold">: UPBJJ ${orderForm.value.upbjj}</td></tr>
                    <tr><td class="text-muted">Item</td><td class="fw-bold text-success">: ${itemLabel}</td></tr>
                    <tr><td class="text-muted">Total Bayar</td><td class="fw-bold">: ${formatRupiah(kalkulasiOrder.value.total)}</td></tr>
                </table>
                <hr>
                <div class="text-center small text-muted">
                    Stok telah diperbarui secara otomatis.
                </div>
            </div>
        `,
        confirmButtonColor: '#0056b3',
        confirmButtonText: '<i class="bi bi-truck"></i> Lanjut ke Tracking',
        allowOutsideClick: false // Mencegah popup tertutup tidak sengaja saat klik di luar
    }).then((result) => {
        if (result.isConfirmed) {
            // Reset form dan pindah halaman hanya SETELAH user menekan tombol OK
            orderForm.value = { nim: '', nama: '', upbjj: '', ekspedisi: '', itemsSatuan: [], paketKode: '' }
            router.push('/tracking')
        }
    })
}
</script>
