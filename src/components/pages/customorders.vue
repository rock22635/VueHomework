<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm">
          <div
            style="height: 150px; background-size: cover; background-position: center"
            :style="{ backgroundImage: `url(${item.image})` }"
          ></div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{
              item.category
            }}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{ item.title }}</a>
            </h5>
            <p class="card-text">{{ item.content }}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h5" v-if="!item.price">
                {{ item.origin_price }} 元
              </div>
              <del class="h6" v-if="item.price"
                >原價 {{ item.origin_price }} 元</del
              >
              <div class="h5" v-if="item.price">
                現在只要 {{ item.price }} 元
              </div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm"
              @click.prevent="getoneproduct(item.id)"
            >
              <i
                class="fas fa-spinner fa-spin"
                v-if="status.itemid === item.id"
              ></i>
              查看更多
            </button>
            <button
              type="button"
              class="btn btn-outline-danger btn-sm ml-auto"
              @click.prevent="addtoCart(item.id)"
            >
              <i
                class="fas fa-spinner fa-spin"
                v-if="status.addcartid === item.id"
              ></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>

      <div
        class="modal fade"
        id="productModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                {{ oneproduct.title }}
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <img :src="oneproduct.image" class="img-fluid" alt="" />
              <blockquote class="blockquote mt-3">
                <p class="mb-0">{{ oneproduct.content }}</p>
                <footer class="blockquote-footer text-right">
                  {{ oneproduct.description }}
                </footer>
              </blockquote>
              <div class="d-flex justify-content-between align-items-baseline">
                <div class="h4" v-if="!oneproduct.price">
                  {{ oneproduct.origin_price }} 元
                </div>
                <del class="h6" v-if="oneproduct.price"
                  >原價 {{ oneproduct.origin_price }} 元</del
                >
                <div class="h4" v-if="oneproduct.price">
                  現在只要 {{ oneproduct.price }} 元
                </div>
              </div>
              <select
                name=""
                class="form-control mt-3"
                v-model="oneproduct.num"
              >
                <option :value="num" v-for="num in 10" :key="num">
                  選購 {{ num }} {{ oneproduct.unit }}
                </option>
              </select>
            </div>
            <div class="modal-footer">
              <div class="text-muted text-nowrap mr-3">
                小計 <strong>{{ oneproduct.num * oneproduct.price }}</strong> 元
              </div>
              <button
                type="button"
                class="btn btn-primary"
                @click.prevent="addtoCart(oneproduct.id, oneproduct.num)"
              >
                <i
                  class="fas fa-spinner fa-spin"
                  v-if="status.addcartid === oneproduct.id"
                ></i>
                加到購物車
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="container">
        <div class="my-5 row justify-content-center">
          <table class="table">
            <thead>
              <th></th>
              <th>品名</th>
              <th>數量</th>
              <th>單價</th>
            </thead>
            <tbody>
              <tr v-for="item in cart.carts">
                <td class="align-middle">
                  <button
                    type="button"
                    class="btn btn-outline-danger btn-sm"
                    @click.prevent="delcart(item.id)"
                  >
                    <i class="far fa-trash-alt"></i>
                  </button>
                </td>
                <td class="align-middle">
                  {{ item.product.title }}
                  <!-- <div class="text-success" v-if="item.coupon">
          已套用優惠券
        </div> -->
                </td>
                <td class="align-middle">
                  {{ item.qty }}/{{ item.product.unit }}
                </td>
                <td class="align-middle text-right">{{ item.final_total }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="text-right">總計</td>
                <td class="text-right">{{ cart.total }}</td>
              </tr>
              <tr v-if="cart.final_total != cart.total">
                <td colspan="3" class="text-right text-success">折扣價</td>
                <td class="text-right text-success">{{ cart.final_total }}</td>
              </tr>
            </tfoot>
          </table>
          <div class="input-group mb-3 input-group-sm">
            <input
              type="text"
              class="form-control"
              placeholder="請輸入優惠碼"
              v-model="couponcode"
            />
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="button" @click.prevent="addcoupon_code">
                套用優惠碼
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import page from "./Pagination";
import $ from "jquery";

export default {
  data() {
    return {
      products: [],
      oneproduct: {},
      status: {
        itemid: "",
        addcartid: ""
      },
      couponcode: "",
      cart: {},
      pagination: {},
      tempProduct: {},
      delProduct: {},
      isNews: false,
      isLoading: false
    };
  },
  components: {
    page
  },
  methods: {
    getproducts(page = 1) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products?page=${page}`;
      const vm = this;
      console.log(process.env.APIPATH, process.env.CUSTOMPATH);
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        console.log(response.data);
        vm.isLoading = false;
        vm.products = response.data.products;
        vm.pagination = response.data.pagination;
        console.log(vm.pagination);
      });
    },
    getoneproduct(id) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`;
      const vm = this;
      vm.isLoading = true;
      vm.status.itemid = id;
      this.$http.get(api).then(response => {
        response.data.product.num = 1;
        vm.isLoading = false;
        vm.oneproduct = response.data.product;
      });

      $("#productModal").modal("show");
      vm.status.itemid = "";
      vm.isLoading = false;
    },
    addtoCart(id, qty = 1) {
      const parameter = { data: { product_id: id, qty: qty } };
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      const vm = this;
      vm.status.addcartid = id;
      this.$http.post(api, parameter).then(response => {
        console.log(response.data);
        if (response.data.success) {
          vm.status.addcartid = "";
          vm.getcart();
        }
      });
      $("#productModal").modal("hide");
    },
    getcart() {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        vm.isLoading = false;
        vm.cart = response.data.data;
        console.log(response.data);
      });
    },
    delcart(id) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
      const vm = this;
      this.$http.delete(api).then(response => {
        if (response.data.success) {
          vm.getcart();
        }
      });
    },
    addcoupon_code() {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
      const vm = this;
      const parameter = {
        code: vm.couponcode
      };
      vm.isLoading = true;
      this.$http.post(api, { data: parameter }).then(response => {
        vm.isLoading = false;
        console.log(response.data);
      });
    }
  },

  created() {
    this.getproducts();
    this.getcart();
  }
};
</script>
