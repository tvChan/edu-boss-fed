<template>
  <div class="role-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item prop="name" label="角色名称">
            <el-input v-model="form.name" placeholder="角色名称"></el-input>
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
        <el-button style="padding: 3px 0" type="text" @click="handleAdd">添加角色</el-button>
      </div>
      <el-table
        :data="roles"
        style="width: 100%; margin-bottom: 20px"
        v-loading="isLoading">
        <el-table-column
          type="index"
          label="编号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="name"
          label="角色名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述">
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="添加时间">
        </el-table-column>
        <el-table-column
          label="操作"
          >
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
            <!-- <el-button @click="handleDelete(scope.$index, scope.row)" type="text" size="small">删除</el-button> -->
          </template>
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
    <el-dialog
      :title="`${isEdit ? '编辑': '添加'}角色`"
      :visible.sync="dialogVisible"
      width="30%"
      >
      <CreateOrEditRole
        v-if="dialogVisible"
        :roleId="roleId"
        :isEdit="isEdit"
        @success="onSuccess"
        @cancel="dialogVisible = false"
      />
    </el-dialog>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { getRolePages } from '@/services/role'
import { Form } from 'element-ui'
import CreateOrEditRole from './CreateOrEditRole.vue'

export default Vue.extend({
  name: 'ResourceListIndex',
  data () {
    return {
      dialogVisible: false,
      roles: [],
      form: {
        name: '',
        current: 1,
        size: 10
      },
      pageParams: {
        current: 1,
        size: 10
      },
      totalCount: 0,
      isLoading: false,
      roleId: null,
      isEdit: false
    }
  },
  components: {
    CreateOrEditRole
  },
  created () {
    this.loadAllRoles()
  },
  methods: {
    onSubmit () {
      console.log('submit!')
      this.form.current = 1
      this.loadAllRoles(this.form)
    },
    onReset () {
      (this.$refs.form as Form).resetFields()
    },
    async loadAllRoles (params = { current: 1, size: 10 }) {
      this.isLoading = true
      const { data } = await getRolePages(params)
      this.roles = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false
    },
    handleSizeChange (val: number) {
      this.pageParams.size = val
      const params = {
        ...this.form,
        ...this.pageParams
      }
      this.loadAllRoles(params)
    },
    handleCurrentChange (val: number) {
      this.pageParams.current = val
      const params = {
        ...this.form,
        ...this.pageParams
      }
      this.loadAllRoles(params)
    },
    onSuccess () {
      this.loadAllRoles()
      this.dialogVisible = false
    },
    handleEdit (role: any) {
      this.dialogVisible = true
      this.roleId = role.id
      this.isEdit = true
    },
    handleAdd () {
      this.dialogVisible = true
      this.isEdit = false
    }
  }
})
</script>
<style lang="scss" scoped>

</style>
