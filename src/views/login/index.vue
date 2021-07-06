<template>
  <div class="login">
    <el-form
      class="login-form"
      label-position="top"
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px">
      <el-form-item prop="phone" label="手机号">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          class="login-btn"
          type="primary"
          @click="onSubmit"
          :loading="isLoginLoading">登录</el-button>
        <!-- <el-button>取消</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { login } from '@/services/user'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'LoginIndex',
  data () {
    return {
      form: {
        phone: '18201288771',
        password: '111111'
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号✅', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '请 6 - 18 位字符', trigger: 'blur' }
        ]
      },
      isLoginLoading: false
    }
  },
  methods: {
    async onSubmit () {
      try {
        // 1. 表单验证
        await (this.$refs.form as Form).validate()

        // 2. 验证通过 -> 提交表单
        // 登录中
        this.isLoginLoading = true

        const { data } = await login(this.form)

        // const { data } = await request({
        //   method: 'POST',
        //   headers: { 'content-type': 'application/x-www-form-urlencoded' },
        //   url: '/front/user/login',
        //   data: qs.stringify(this.form) // axios 默认发送的是 application/json 格式的数据
        // })
        // 3. 处理请求结果
        // 失败：给出提示
        if (data.state !== 1) {
          this.$message.error(data.message)
        } else {
          this.$store.commit('setUser', data.content)
          // 成功：跳转首页
          this.$router.push({
            name: 'home'
          })
          this.$message.success('登录成功')
        }
      } catch (err) {
        console.log('登录失败', err)
      }
      // 结束登录 loading
      this.isLoginLoading = false
    }
  }
})
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-form {
    width: 300px;
    background: #fff;
    padding: 20px;
    border-radius: 5px;
  }
  .login-btn {
    width: 100%;
  }
}
</style>
