<template>
  <nav class="col-md-2 d-none d-md-block bg-light sidebar">
    <div class="sidebar-sticky">
      <h6
        class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
      >
        <span>管理員</span>
        <a
          class="d-flex align-items-center text-muted"
          href="#"
          aria-label="Add a new report"
        >
        </a>
      </h6>
      <ul class="nav flex-column mb-2">
        <li class="nav-item">
          <router-link class="nav-link" to="/admin/Productlist">
            <i class="fas fa-box-open"></i>
            產品列表
          </router-link>
          <router-link class="nav-link" to="/admin/Orderlist">
           <i class="far fa-list-alt"></i> 
            訂單列表
          </router-link>
          <router-link class="nav-link" to="/admin/Voucher">
           <i class="fas fa-ticket-alt"></i> 
            優惠卷
          </router-link>
        </li>
      </ul>
      <h6
        class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
      >
        <span>模擬功能</span>
        <a
          class="d-flex align-items-center text-muted"
          href="#"
          aria-label="Add a new report"
        >
          
        </a>
      </h6>
      <ul class="nav flex-column mb-2">
        <li class="nav-item">
          <router-link class="nav-link" to="/customorder">
           <i class="fas fa-shopping-cart"></i> 
            模擬訂單          
            </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>
