<template>
  <div :style="{height}">
    <slot />
    <div v-if="isPage" class="pagination" :style="{'text-align':align}">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :total="total"
        :page-size="pageSize"
        :layout="layout"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PagedTable',
  components: {},
  props: {
    align: {
      type: String,
      default: 'center'
    },
    isPage: {
      type: Boolean,
      default: true
    },
    height: {
      type: String,
      default: '100%'
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 0
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    pageSizes: {
      type: Array,
      default: () => {
        return [10, 50, 100, 200]
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    handleSizeChange(size) {
      this.$emit('size-change', size)
    },
    handleCurrentChange(cur) {
      this.$emit('current-change', cur)
    }
  }
}
</script>

<style scoped lang="less">
.pagination {
  padding-top: 8px;
}
</style>
