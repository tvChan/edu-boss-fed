<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item prop="name" label="资源名称">
            <el-input v-model="form.name" placeholder="审批人"></el-input>
          </el-form-item>
          <el-form-item prop="url" label="资源路径">
            <el-input v-model="form.url" placeholder="审批人"></el-input>
          </el-form-item>
          <el-form-item prop="categoryId" label="资源分类">
            <el-select v-model="form.categoryId" placeholder="请选择资源分类" clearable>
              <el-option :label="item.name" :value="item.id"
                v-for="item in resourceCategories" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit"
              :disabled="isLoading">查询</el-button>
            <el-button
              type="info"
              @click="onReset"
              :disabled="isLoading">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button style="padding: 3px 0" type="text">添加</el-button>
        <el-button style="padding: 3px 0" type="text">资源分类</el-button>
      </div>
      <el-table
        :data="resources"
        style="width: 100%; margin-bottom: 20px"
        v-loading="isLoading">
        <el-table-column
          type="index"
          label="编号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="name"
          label="资源名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="url"
          label="资源地址">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述">
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="创建时间">
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageParams.current"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageParams.size"
        :disabled="isLoading"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </el-card>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { getResourcePages } from '@/services/resource'
import { getResourceCategories } from '@/services/resource-category'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'ResourceListIndex',
  data () {
    return {
      resources: [],
      form: {
        name: '',
        url: '',
        region: '',
        current: 1,
        size: 10
      },
      pageParams: {
        current: 1,
        size: 10
      },
      totalCount: 0,
      resourceCategories: [],
      isLoading: false
    }
  },
  created () {
    this.loadResources()
    this.loadResourceCategories()
  },
  methods: {
    onSubmit () {
      console.log('submit!')
      this.form.current = 1
      this.loadResources(this.form)
    },
    onReset () {
      (this.$refs.form as Form).resetFields()
    },
    async loadResources (params = { current: 1, size: 10 }) {
      this.isLoading = true
      const { data } = await getResourcePages(params)
      this.resources = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false
    },
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      console.log(data)
      this.resourceCategories = data.data
    },
    handleSizeChange (val: number) {
      this.pageParams.size = val
      const params = {
        ...this.form,
        ...this.pageParams
      }
      this.loadResources(params)
    },
    handleCurrentChange (val: number) {
      this.pageParams.current = val
      const params = {
        ...this.form,
        ...this.pageParams
      }
      this.loadResources(params)
    }
  }
})
</script>
<style lang="scss" scoped>

</style>
