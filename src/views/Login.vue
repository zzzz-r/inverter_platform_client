<!--已不再使用-->

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
        <a-form-item>
          <div style="display: flex">
            <a-input
                class="input-item"
                style="width: 60%;margin-right: 20px"
                placeholder="请输入验证码"
                v-decorator="[
              'validCode',
              { rules: [{ required: true, message: '请输入验证码！' }] },
            ]"/>
            <ValidCode @input="createValidCode" />
          </div>
        </a-form-item>
        <button class="login-btn">登录</button>
      </a-form>
      <div class="msg">
        没有账户? 查看<a-button type="link" @click="info">如何获取</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { userLogin } from "@/api/api";
import ValidCode from "@/components/ValidCode.vue";
import {setPlusRoutes} from "@/router";

export default {
  name: "Login",
  components: {ValidCode},
  data() {
    return {
      form: this.$form.createForm(this, { name: 'normal_login' }),
      validCode: '',
    };
  },
  methods: {
    // 接收验证码组件提交的 4位验证码
    createValidCode(data) {
      this.validCode = data
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          // 校验验证码
          if(this.form.getFieldValue('validCode').toLowerCase() !== this.validCode.toLowerCase()) {
            this.$message.error("验证码错误")
            return
          }
          userLogin(values).then(res => {
            if(res.code === 0){
              localStorage.setItem("user", JSON.stringify(res.data))  // 存储用户信息到浏览器
              setPlusRoutes();
              this.$router.push("/platform")
              this.$message.success("登录成功")
            }else {
              this.$message.error(res.msg)
            }
          })
        }
      });
    },
    info() {
      const h = this.$createElement;
      this.$info({
        title: '获取账号',
        content: h('div', {}, [
          h('p', '- 如果您是业主用户，请联系您的安装人员创建帐户；'),
          h('p', '- 如果您是新安装商，并且之前没有安装帐户，请联系您的经销商为您创建帐户；'),
          h('p', '- 如果您是新经销商，请告诉联系我们给出您的销售和登录 ID，我们将为您创建帐户'),
        ]),
        onOk() {},
      });
    },
  },
};
</script>

<style scoped src="@/assets/log.css">
</style>

