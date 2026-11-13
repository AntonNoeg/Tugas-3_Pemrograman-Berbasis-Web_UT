<template>
  <nav class="navbar navbar-expand-lg navbar-dark navbar-ut shadow-sm sticky-top">
    <div class="container-fluid px-4">
      <router-link to="/" class="navbar-brand d-flex align-items-center gap-2 fw-bold text-decoration-none">
        <img src="/img/logo-ut.png" alt="Logo UT" style="height: 35px; width: auto; background: white; padding: 2px; border-radius: 4px;" onerror="this.style.display='none'">
        <span class="text-white">SITTA - UT</span>
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto gap-1">
          <li class="nav-item">
            <router-link to="/" class="nav-link btn text-start px-3">
              <i class="bi bi-speedometer2 me-1"></i> Dashboard
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/stock" class="nav-link btn text-start px-3">
              <i class="bi bi-box-seam me-1"></i> Stok Bahan Ajar
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/order" class="nav-link btn text-start px-3">
              <i class="bi bi-cart-plus me-1"></i> Pemesanan
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/tracking" class="nav-link btn text-start px-3">
              <i class="bi bi-truck me-1"></i> Tracking Pengiriman
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
