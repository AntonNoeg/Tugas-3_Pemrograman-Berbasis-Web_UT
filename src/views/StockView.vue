<template>
  <div class="card border-0 shadow-sm rounded-3">
      <div class="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
          <h5 class="fw-bold m-0"><i class="bi bi-box-seam me-2 text-primary"></i>Daftar Stok Bahan Ajar</h5>
          <button class="btn btn-sm btn-primary" @click="bukaFormTambah">
              <i class="bi bi-plus-circle me-1"></i> Tambah Bahan Ajar Baru
          </button>
      </div>
      <div class="card-body">

          <!-- Formulir Tambah / Edit Data (Vertikal Layout) -->
          <div v-if="tampilForm" class="card border mb-4">
              <div class="card-body">
                  <h5 class="fw-bold text-dark-blue mb-4">
                      {{ modeEdit ? 'Form Edit Bahan Ajar' : 'Form Tambah Bahan Ajar Baru' }}
                  </h5>
                  
                  <div class="mb-3">
                      <label class="form-label fw-semibold mb-1">Kode Buku</label>
                      <input type="text" class="form-control" v-model="form.kode" placeholder="Cth: EKMA1234" :disabled="modeEdit" @keyup.enter="simpanData">
                  </div>
                  
                  <div class="mb-3">
                      <label class="form-label fw-semibold mb-1">Judul Buku</label>
                      <input type="text" class="form-control" v-model="form.judul" placeholder="Masukkan judul buku" @keyup.enter="simpanData">
                  </div>
                  
                  <div class="mb-3">
                      <label class="form-label fw-semibold mb-1">Kategori</label>
                      <select class="form-select" v-model="form.kategori" @keyup.enter="simpanData">
                          <option v-for="k in dataJSON.kategoriList" :key="k" :value="k">{{ k }}</option>
                      </select>
                  </div>
                  
                  <div class="mb-3">
                      <label class="form-label fw-semibold mb-1">UT Daerah</label>
                      <select class="form-select" v-model="form.upbjj" @keyup.enter="simpanData">
                          <option v-for="u in dataJSON.upbjjList" :key="u" :value="u">{{ u }}</option>
                      </select>
                  </div>
                  
                  <div class="mb-3">
                      <label class="form-label fw-semibold mb-1">Lokasi Rak</label>
                      <input type="text" class="form-control" v-model="form.lokasiRak" placeholder="Cth: R1-A3" @keyup.enter="simpanData">
                  </div>
                  
                  <div class="mb-3">
                      <label class="form-label fw-semibold mb-1">Harga (Rp)</label>
                      <input type="number" class="form-control" v-model.number="form.harga" placeholder="0" @keyup.enter="simpanData">
                  </div>
                  
                  <div class="mb-3">
                      <label class="form-label fw-semibold mb-1">Jumlah Stok</label>
                      <input type="number" class="form-control" v-model.number="form.qty" placeholder="0" @keyup.enter="simpanData">
                  </div>

                  <div class="mb-3">
                      <label class="form-label fw-semibold mb-1">Minimum Stok</label>
                      <input type="number" class="form-control" v-model.number="form.safety" placeholder="0" @keyup.enter="simpanData">
                  </div>
                  
                  <div class="mb-4">
                      <label class="form-label fw-semibold mb-1">Catatan</label>
                      <input type="text" class="form-control" v-model="form.catatanHTML" placeholder="Opsional, cth: <em>Edisi baru</em>" @keyup.enter="simpanData">
                  </div>
                  
                  <div class="d-flex gap-2">
                      <button class="btn btn-success px-4 fw-semibold d-flex align-items-center gap-2" @click="simpanData">
                          <i class="bi bi-floppy"></i> Simpan Data
                      </button>
                      <button class="btn btn-blue px-4 fw-semibold d-flex align-items-center gap-2 text-white" @click="tampilForm = false">
                          <i class="bi bi-x-lg"></i> Batal
                      </button>
                  </div>
              </div>
          </div>

          <!-- Controls -->
          <div class="row g-3 mb-3 align-items-center">
              <div class="col-12 col-md-3">
                  <div class="input-group">
                      <span class="input-group-text bg-light"><i class="bi bi-search"></i></span>
                      <input type="text" class="form-control" v-model="stokSearch" placeholder="Cari Kode / Judul Buku">
                  </div>
              </div>
              <div class="col-6 col-md-2">
                  <select class="form-select" v-model="filterUpbjj">
                      <option value="">UT-Daerah</option>
                      <option v-for="u in dataJSON.upbjjList" :key="u" :value="u">{{ u }}</option>
                  </select>
              </div>
              <div class="col-6 col-md-2" v-if="filterUpbjj !== ''">
                  <select class="form-select" v-model="filterKategori">
                      <option value="">Semua Kategori</option>
                      <option v-for="k in dataJSON.kategoriList" :key="k" :value="k">{{ k }}</option>
                  </select>
              </div>
              <div class="col-6 col-md-2">
                  <div class="form-check mt-1">
                      <input class="form-check-input" type="checkbox" id="reorderCheck" v-model="filterReorder">
                      <label class="form-check-label small" for="reorderCheck"><strong>Stok Menipis/Kosong (Reminder Re-order)</strong></label>
                  </div>
              </div>
              <div class="col-6 col-md-2">
                  <select class="form-select" v-model="sortBy">
                      <option value="kode">Urut Berdasar: Default</option>
                      <option value="judul">Judul A-Z</option>
                      <option value="qty_asc">Stok Terkecil</option>
                      <option value="harga_asc">Harga Terendah</option>
                  </select>
              </div>
              <div class="col-6 col-md-1">
                  <button class="btn btn-outline-secondary w-100" @click="resetFilter" title="Reset Filter">
                      <i class="bi bi-arrow-counterclockwise"></i> Reset
                  </button>
              </div>
          </div>

          <!-- Data Table -->
          <div class="table-responsive">
              <table class="table table-hover align-middle">
                  <thead class="table-light">
                      <tr>
                          <th>Kode Buku</th>
                          <th>Judul Buku</th>
                          <th>Kategori</th>
                          <th>UT Daerah</th>
                          <th>Lokasi Rak</th>
                          <th>Harga</th>
                          <th>Jumlah Stok</th>
                          <th>Minimum Stok</th>
                          <th>Aksi</th>
                      </tr>
                  </thead>
                  <tbody>
                      <!-- Menggunakan template untuk merender 2 baris (Baris Data & Baris Edit) sekaligus -->
                      <template v-for="item in paginatedStok" :key="item.kode">
                          
                          <!-- BARIS 1: Data Utama -->
                          <tr>
                              <td class="fw-bold text-primary">{{ item.kode }}</td>
                              <td>{{ item.judul }}</td>
                              <td><span class="badge bg-secondary opacity-75">{{ item.kategori }}</span></td>
                              <td>{{ item.upbjj }}</td>
                              <td><code class="text-dark">{{ item.lokasiRak }}</code></td>
                              <td>{{ formatRupiah(item.harga) }}</td>
                              <td class="fw-bold">{{ item.qty }}</td>
                              
                              <td class="status-cell" style="cursor: help;">
                                  <span v-if="item.qty === 0" class="badge bg-danger">✖ Kosong</span>
                                  <span v-else-if="item.qty < item.safety" class="badge bg-warning text-dark">⚠ Menipis</span>
                                  <span v-else class="badge bg-success">✔ Aman</span>
                                  
                                  <div class="tooltip-preview shadow" v-if="item.catatanHTML">
                                      <span v-html="item.catatanHTML"></span>
                                  </div>
                              </td>
                              
                              <!-- Tombol Aksi Sesuai Gambar -->
                              <td>
                                  <div class="d-flex gap-1">
                                      <button class="btn btn-warning btn-sm fw-semibold d-flex align-items-center gap-1" style="font-size: 12px;" @click="siapkanEdit(item)">
                                          <i class="bi bi-pencil-fill"></i> Edit
                                      </button>
                                      <button class="btn btn-danger btn-sm fw-semibold d-flex align-items-center gap-1" style="font-size: 12px;" @click="konfirmasiHapus(item.kode)">
                                          <i class="bi bi-trash-fill"></i> Hapus
                                      </button>
                                  </div>
                              </td>
                          </tr>

                          <!-- BARIS 2: Formulir Inline Edit (Hanya Muncul Jika Diklik Edit) -->
                          <tr v-if="editingKode === item.kode" style="background-color: #fdf8e4;">
                              <td colspan="10" class="py-3 px-4" style="border-left: 4px solid #f0ad4e;">
                                  <div class="d-flex flex-wrap align-items-center gap-3">
                                      <span class="fw-bold text-dark me-2 border-start border-warning border-3 ps-2">
                                          Edit Stok: {{ item.judul }}
                                      </span>
                                      
                                      <div class="d-flex align-items-center gap-2">
                                          <label class="small mb-0 text-nowrap">Harga Baru:</label>
                                          <input type="number" class="form-control form-control-sm" style="width: 100px;" v-model.number="formEdit.harga" @keyup.enter="simpanEdit">
                                      </div>
                                      
                                      <div class="d-flex align-items-center gap-2">
                                          <label class="small mb-0 text-nowrap">Jumlah Stok Baru:</label>
                                          <input type="number" class="form-control form-control-sm" style="width: 80px;" v-model.number="formEdit.qty" @keyup.enter="simpanEdit">
                                      </div>
                                      
                                      <button class="btn btn-sm btn-success fw-semibold ms-2 d-flex align-items-center gap-1" @click="simpanEdit">
                                          <i class="bi bi-floppy-fill"></i> Simpan
                                      </button>
                                      <button class="btn btn-sm btn-secondary fw-semibold" @click="batalEdit">
                                          Batal
                                      </button>
                                  </div>
                                  
                                  <!-- Pesan Error Validasi -->
                                  <small v-if="errorEdit" class="text-danger fw-bold d-block mt-2">
                                      <i class="bi bi-exclamation-triangle-fill"></i> {{ errorEdit }}
                                  </small>
                              </td>
                          </tr>
                      </template>
                      
                      <tr v-if="paginatedStok.length === 0">
                          <td colspan="10" class="text-center py-4 text-muted">Bahan ajar tidak ditemukan.</td>
                      </tr>
                  </tbody>
              </table>
          </div>

          <div class="d-flex justify-content-between align-items-center mt-3">
              <span class="small text-muted">Menampilkan {{ paginatedStok.length }} dari {{ filteredAndSortedStok.length }} data</span>
              <nav v-if="totalPages > 1">
                  <ul class="pagination pagination-sm mb-0">
                      <li class="page-item" :class="{ disabled: currentPage === 1 }"><button class="page-link" @click="currentPage--">Sebelumnya</button></li>
                      <li v-for="p in totalPages" :key="p" class="page-item" :class="{ active: currentPage === p }"><button class="page-link" @click="currentPage = p">{{ p }}</button></li>
                      <li class="page-item" :class="{ disabled: currentPage === totalPages }"><button class="page-link" @click="currentPage++">Selanjutnya</button></li>
                  </ul>
              </nav>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue'
import { formatRupiah, stripHtmlTags } from '@/utils/formatter'
import Swal from 'sweetalert2'

const dataJSON = inject('dataJSON')

// --- STATE PENCARIAN & FILTER ---
const stokSearch = ref('')
const filterUpbjj = ref('')
const filterKategori = ref('')
const filterReorder = ref(false)
const sortBy = ref('kode')
const currentPage = ref(1)
const itemsPerPage = ref(5)

// Fungsi Watcher
watch(filterUpbjj, (newVal) => {
    if (newVal === '') {
        filterKategori.value = ''
    }
})

// --- STATE FORM TAMBAH BAHAN AJAR ---
const tampilForm = ref(false)
const form = ref({
    kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: null, qty: null, safety: null, catatanHTML: ''
})

// --- STATE INLINE EDIT ---
const editingKode = ref(null)
const formEdit = ref({})
const errorEdit = ref('')

// --- FUNGSI RESET & TAMBAH DATA ---
const resetFilter = () => {
    stokSearch.value = ''
    filterUpbjj.value = ''
    filterKategori.value = ''
    filterReorder.value = false
    sortBy.value = 'kode'
}

const bukaFormTambah = () => {
    batalEdit() // Tutup mode inline edit jika sedang terbuka
    form.value = { kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: null, qty: null, safety: null, catatanHTML: '' }
    tampilForm.value = true
}

// --- FUNGSI RESET & TAMBAH DATA ---
const simpanData = () => {
    if (!form.value.kode || !form.value.judul || form.value.harga === null || form.value.qty === null) {
        Swal.fire({
            title: 'Data Tidak Lengkap!',
            text: 'Mohon lengkapi data minimal Kode, Judul, Harga, dan Jumlah Stok.',
            icon: 'warning',
            confirmButtonColor: '#0d3b66'
        })
        return
    }

    const exist = dataJSON.value.stok.find(s => s.kode === form.value.kode)
    if (exist) {
        Swal.fire({
            title: 'Gagal Menyimpan!',
            text: 'Kode bahan ajar sudah terdaftar di sistem.',
            icon: 'error',
            confirmButtonColor: '#d33'
        })
        return
    }
    dataJSON.value.stok.push({ ...form.value })
    
    // Popup Sukses Animasi Menarik
    Swal.fire({
        title: 'Berhasil!',
        text: 'Data bahan ajar baru telah ditambahkan.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
    })
    tampilForm.value = false
}

const konfirmasiHapus = (kode) => {
    // Popup Konfirmasi dengan 2 Tombol Modern
    Swal.fire({
        title: 'Apakah Anda yakin?',
        text: `Data bahan ajar dengan kode ${kode} akan dihapus permanen!`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: '<i class="bi bi-trash"></i> Ya, Hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            const idx = dataJSON.value.stok.findIndex(s => s.kode === kode)
            if (idx !== -1) {
                dataJSON.value.stok.splice(idx, 1)
                Swal.fire({
                    title: 'Terhapus!',
                    text: 'Data berhasil dihapus dari sistem.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                })
            }
        }
    })
}

// --- FUNGSI INLINE EDIT ---
const siapkanEdit = (item) => {
    tampilForm.value = false 
    editingKode.value = item.kode
    formEdit.value = { ...item }
    errorEdit.value = ''
}

const batalEdit = () => {
    editingKode.value = null
    formEdit.value = {}
    errorEdit.value = ''
}

const simpanEdit = () => {
    if (formEdit.value.harga === '' || formEdit.value.harga < 0) {
        errorEdit.value = "Format Error: Harga tidak boleh kosong atau bernilai minus!"
        return
    }
    if (formEdit.value.qty === '' || formEdit.value.qty < 0) {
        errorEdit.value = "Format Error: Jumlah stok baru tidak valid!"
        return
    }

    const idx = dataJSON.value.stok.findIndex(s => s.kode === formEdit.value.kode)
    if (idx !== -1) {
        dataJSON.value.stok[idx] = { ...formEdit.value }
        editingKode.value = null
        errorEdit.value = ''
        
        // Popup Notifikasi Sukses Singkat (Toast-style)
        Swal.fire({
            title: 'Tersimpan!',
            text: 'Perubahan data berhasil disimpan.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            position: 'center',
            toast: true
        })
    }
}

// --- FUNGSI FILTER & SORTING (COMPUTED) ---
const filteredAndSortedStok = computed(() => {
    let result = dataJSON.value.stok.filter(item => {
        const matchSearch = item.kode.toLowerCase().includes(stokSearch.value.toLowerCase()) || 
                            item.judul.toLowerCase().includes(stokSearch.value.toLowerCase())
        const matchUpbjj = !filterUpbjj.value || item.upbjj === filterUpbjj.value
        const matchKat = !filterKategori.value || item.kategori === filterKategori.value
        const matchReorder = !filterReorder.value || item.qty < item.safety || item.qty === 0
        return matchSearch && matchUpbjj && matchKat && matchReorder
    })

    if (sortBy.value === 'judul') {
        result.sort((a, b) => a.judul.localeCompare(b.judul))
    } else if (sortBy.value === 'qty_asc') {
        result.sort((a, b) => a.qty - b.qty)
    } else if (sortBy.value === 'harga_asc') {
        result.sort((a, b) => a.harga - b.harga)
    } else {
        result.sort((a, b) => a.kode.localeCompare(b.kode))
    }
    return result
})

const totalPages = computed(() => Math.ceil(filteredAndSortedStok.value.length / itemsPerPage.value) || 1)

const paginatedStok = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    return filteredAndSortedStok.value.slice(start, start + itemsPerPage.value)
})
</script>

<style scoped>
/* Pengaturan sel tabel agar tooltip berada di tempat yang tepat */
.status-cell {
    position: relative;
}

/* Desain kotak Tooltip Preview */
.tooltip-preview {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    bottom: 100%;       /* Muncul tepat di atas teks status */
    left: 50%;
    transform: translateX(-50%);
    background-color: #2c3e50; /* Warna latar gelap elegan */
    color: #ffffff;
    padding: 8px 14px;
    border-radius: 6px;
    white-space: nowrap;
    z-index: 999;
    font-size: 13px;
    margin-bottom: 8px; /* Jarak antara tooltip dan teks status */
    pointer-events: none;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

/* Membuat segitiga kecil (panah) di bawah kotak tooltip */
.tooltip-preview::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -6px;
    border-width: 6px;
    border-style: solid;
    border-color: #2c3e50 transparent transparent transparent;
}

/* Event ketika mouse menyorot (hover) sel status */
.status-cell:hover .tooltip-preview {
    visibility: visible;
    opacity: 1;
}
</style>

<style scoped>
/* Pengaturan teks judul form */
.text-dark-blue {
    color: #0d3b66; 
}

/* Warna tombol Batal */
.btn-blue {
    background-color: #2b20bc;
    border-color: #2b20bc;
}
.btn-blue:hover {
    background-color: #1e158c;
    border-color: #1e158c;
}

/* (Tetap pertahankan CSS untuk status-cell dan tooltip-preview yang sudah ada sebelumnya) */
.status-cell {
    position: relative;
}
/* ... sisa css tooltip ... */
</style>