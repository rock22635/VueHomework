<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="text-right mt-4">
      <Button class="btn btn-primary" @click.prevent="OpenModal(true)"
        >建立新優惠碼</Button
      >
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">優惠卷名稱</th>
          <th>優惠碼</th>
          <th width="100">折扣數</th>
          <th width="120">使用期限</th>
          <th width="100">是否啟用</th>
          <th width="140">管理</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in coupons" :key="item.id">
          <td>{{ item.title }}</td>
          <td>{{ item.code }}</td>
          <td class="text-right">{{ item.percent }}%</td>
          <td>{{ formattimspantodate(item.due_date) }}</td>

          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <button
              class="btn btn-outline-primary btn-sm"
              @click.prevent="OpenModal(false, item)"
            >
              編輯
            </button>
            <button
              class="btn btn-outline-danger btn-sm"
              @click.prevent="OpenRemove(item)"
            >
              刪除
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <page :pages="pagination" v-on:chgpage="getcoupons" />

    <div
      class="modal fade"
      id="ProductModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog " role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增優惠碼</span>
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
            <div class="row">
              <div class="container modal-coupon">
                <div class="col-sm-12">
                  <div class="form-group">
                    <label for="title">標題</label>
                    <input
                      type="text"
                      class="form-control"
                      id="title"
                      placeholder="請輸入標題"
                      v-model="tempcoupon.title"
                    />
                  </div>
                  <div class="form-row">
                    <div class="form-group col-md-6">
                      <label for="origin_price">優惠碼</label>
                      <input
                        type="text"
                        class="form-control"
                        id="origin_price"
                        placeholder="請輸入優惠碼"
                        v-model="tempcoupon.code"
                      />
                    </div>
                    <div class="form-group col-md-6">
                      <label for="category">折扣</label>
                      <input
                        type="text"
                        class="form-control"
                        id="category"
                        placeholder="請輸入折扣"
                        v-model="tempcoupon.percent"
                      />
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="title">到期日</label>
                    <input
                      type="text"
                      class="form-control"
                      id="title"
                      placeholder="請輸入到期日"
                      v-model="tempcoupon.due_date"
                    />
                  </div>
                  <div class="form-group">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="is_enabled"
                        v-model="tempcoupon.is_enabled"
                        :true-value="1"
                        :false-value="0"
                      />
                      <label class="form-check-label" for="is_enabled">
                        是否啟用
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-secondary"
              data-dismiss="modal"
            >
              取消
            </button>
            <button type="button" class="btn btn-primary" @click="updatecoupon">
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="delcouponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除優惠卷</span>
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
            是否刪除
            <strong class="text-danger"></strong>
            優惠卷(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-secondary"
              data-dismiss="modal"
            >
              取消
            </button>
            <button type="button" class="btn btn-danger" @click="Removecoupon">
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import page from "./Pagination";
export default {
  data() {
    return {
      coupons: [],
      pagination: {},
      tempcoupon: {},
      delcoupon: {},
      isNews: false,
      isLoading: false,
      status: {
        fileupload: false
      }
    };
  },
  components: {
    page
  },
  methods: {
    getcoupons(page = 1) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons?page=${page}`;
      const vm = this;
      console.log(process.env.APIPATH, process.env.CUSTOMPATH);
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        console.log(response.data);
        vm.isLoading = false;
        vm.coupons = response.data.coupons;
        vm.pagination = response.data.pagination;
        console.log(vm.pagination);
      });
    },
    OpenRemove(item) {
      const vm = this;
      console.log(item);
      vm.delcoupon = item;
      $("#delcouponModal").modal("show");
    },
    Removecoupon() {
      const vm = this;
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.delcoupon.id}`;
      this.$http.delete(api).then(response => {
        console.log(response.data);
        if (response.data.success) {
          $("#delcouponModal").modal("hide");
          vm.getcoupons();
        } else {
          $("#delcouponModal").modal("hide");
          vm.getcoupons();
          console.log("刪除失敗!!");
        }
      });
      $("#delcouponModal").modal("hide");
    },
    OpenModal(isNew, item) {
      const vm = this;
      if (isNew) {
        vm.tempcoupon = {};
        vm.isNews = isNew;
      } else {
        vm.tempcoupon = Object.assign({}, item);
        vm.isNews = isNew;
      }
      $("#ProductModal").modal("show");
    },
    updatecoupon() {
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
      let httpmethod = "post";
      const vm = this;
      const timestamp = new Date(vm.tempcoupon.due_date).getTime(); //Date 內無值的話為當前時間
      vm.tempcoupon.due_date = Math.floor(timestamp / 1000);
      console.log("due_date", vm.tempcoupon.due_date);
      if (!vm.isNews) {
        api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempcoupon.id}`;
        httpmethod = "put";
      }
      console.log("api", api, "httpmethod", httpmethod);
      this.$http[httpmethod](api, { data: vm.tempcoupon }).then(response => {
        console.log(response.data);
        if (response.data.success) {
          $("#ProductModal").modal("hide");
          vm.getcoupons();
        } else {
          $("#ProductModal").modal("hide");
          vm.getcoupons();
          console.log("新增失敗!!");
        }
      });
    },
    uploadfile() {
      console.log(this);
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/upload`;
      const uploadedfile = this.$refs.files.files[0];
      const formdata = new FormData();
      vm.status.fileupload = true;
      formdata.append("file-to-upload", uploadedfile);
      this.$http
        .post(api, formdata, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(response => {
          if (response.data.success) {
            vm.$set(vm.tempcoupon, "image", response.data.imageUrl);
            vm.status.fileupload = false;
          } else {
            this.$bus.$emit("messsage:push", response.data.message, "danger");
            vm.status.fileupload = false;
          }
        });
      //  this.$http.post()
    },
    formattimspantodate(timespan) {
      var date = new Date(timespan * 1000);
      var dataValues = date.toISOString().split("T");
      var dataValues2 = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      ];
      console.log(dataValues, dataValues[0]);
      return dataValues[0];
    }
  },
  created() {
    this.getcoupons();
  }
};
</script>
