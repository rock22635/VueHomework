<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: !pages.has_pre }">
        <a
          class="page-link"
          href="#"
          aria-label="Previous"
          @click.prevent="gotoParent(pages.current_page - 1)"
        >
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li
        class="page-item"
        v-for="page in pages.total_pages"
        :key="page"
        :class="{ active: pages.current_page == page }"
      >
        <a class="page-link" href="#" @click.prevent="gotoParent(page)">{{
          page
        }}</a>
      </li>
      <li class="page-item" :class="{ disabled: !pages.has_next }">
        <a
          class="page-link"
          href="#"
          aria-label="Next"
          @click.prevent="gotoParent(pages.current_page + 1)"
        >
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>
<style scoped>
nav {
  display: table;
  margin: 0 auto;
}
</style>
<script>
export default {
  props: ["pages"],
  data() {
    return {
      pagination: {}
    };
  },
  methods: {
    gotoParent(item) {
      this.$emit("chgpage", item);
    }
  }
};
</script>
