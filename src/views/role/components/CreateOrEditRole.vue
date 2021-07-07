<template>
  <div class="">
    <el-form :model="form">
      <el-form-item label="角色名称">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色编码">
        <el-input v-model="form.code" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="form.description" type="textarea"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="$emit('cancel')">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { createOrUpdate, getRoleById } from '@/services/role'
export default Vue.extend({
  name: 'CreateOrEditRole',
  props: {
    roleId: [String, Number],
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        code: '',
        name: '',
        description: ''
      }
    }
  },
  created () {
    if (this.isEdit) {
      this.loadRole()
    }
  },
  methods: {
    async loadRole () {
      const { data } = await getRoleById(this.roleId)
      this.form = data.data
    },
    async onSubmit () {
      const { data } = await createOrUpdate(this.form)
      console.log(data)
      this.$message.success('操作成功')
      this.$emit('success')
    }
  }
})
</script>
<style lang="scss" scoped>

</style>
