<template>
  <div class="container">
    <div class="login-wrapper">
      <div class="header">微逆监测云平台</div>
      <a-form class="form-wrapper" :form="form" @submit="handleSubmit">
        <a-form-item>
          <a-input
              class="input-item"
              type="text"
              placeholder="请输入用户名"
              v-decorator="[
              'userName',
              { rules: [{ required: true, message: '请输入用户名！' }] },
            ]"
          />
        </a-form-item>
        <a-form-item>
          <a-input
              class="input-item"
              type="password"
              placeholder="请输入密码"
              v-decorator="[
              'password',
              { rules: [{ required: true, message: '请输入密码！' }] },
            ]"
          />
        </a-form-item>
        <button class="login-btn">登录</button>
      </a-form>
      <div class="msg">
        没有账户? 现在<router-link to="/register">注册</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { userLogin } from "@/api/api";

export default {
  name: "Login",
  data() {
    return {
      form: this.$form.createForm(this, { name: 'normal_login' })
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          userLogin(values).then(res => {
            if(res.code === 0){
              localStorage.setItem("user", JSON.stringify(res.data))  // 存储用户信息到浏览器
              this.$router.push("/platform")
              this.$message.success("登录成功")
            }else {
              this.$message.error(res.msg)
            }
          })
        }
      });
    },
  },
};
</script>

<style scoped src="@/assets/log.css">
</style>

