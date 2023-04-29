<template>
  <div class="container">
    <div class="login-wrapper">
      <div class="header">用户注册<a-icon type="edit" theme="filled" /></div>
      <a-form class="form-wrapper" :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
        <a-form-item label="用户名">
          <a-input
              class="input-item"
              placeholder="请输入用户名"
              v-decorator="[
              'userName',
              { rules: [{ required: true, message: '请输入用户名！' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="密码" has-feedback>
          <a-input
              class="input-item"
              type="password"
              placeholder="请输入密码"
              v-decorator="[
              'password',
              { rules: [{ required: true, message: '请输入密码！' },
              { validator: validateToNextPassword }
              ]},
            ]"
          />
        </a-form-item>
        <a-form-item label="确认密码" has-feedback>
          <a-input
              class="input-item"
              type="password"
              placeholder="请再次输入密码"
              v-decorator="[
              'confirm',
              { rules: [{ required: true, message: '请确认密码！' },
              { validator: compareToFirstPassword }
              ] },
            ]"
              @blur="handleConfirmBlur"
          />
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input
              class="input-item"
              placeholder="请输入邮箱"
              v-decorator="[
          'email',
          {
            rules: [
              {
                type: 'email',
                message: '请输入正确的邮箱格式！',
              },
              {
                required: false,
              },
            ],
          },
        ]"
          />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input
              class="input-item"
              placeholder="请输入手机号"
              v-decorator="['phone',{ rules: [{ required: false, }, ], }, ]"
          />
        </a-form-item>
        <a-form-item label="用户类型" style="text-align: left">
          <a-radio-group v-decorator="['type',{ rules: [{ required: true, }, ], }, ]">
            <a-radio :value="0">
              普通用户
            </a-radio>
            <a-radio :value="1">
              机构用户
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="机构名称" v-if="form.getFieldValue('type')===1">
          <a-input
              class="input-item"
              placeholder="请输入机构名称"
              v-decorator="['institute',{ rules: [{ required: true, message: '请输入机构名称！'}, ], }, ]"
          />
        </a-form-item>
      </a-form>
      <div>
        <a-button class="register-btn">
          <router-link to="/login">返回登录</router-link>
        </a-button>
        <a-button class="register-btn" type="primary" @click="login" style="background-color: rgba(56,56,56,0.85)">
          注册
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import {userRegister} from "@/api/api";

export default {
  name: "Register",
  data() {
    return {
      form: this.$form.createForm(this, { name: 'register' }),
      confirmDirty: false,
    };
  },
  methods: {
    login(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('表单数据: ', values);
          userRegister(values).then(res => {
            if(res.code === 0){
              this.$router.push("/login")
              this.$message.success("注册成功")
            }else {
              console.log(res)
              this.$message.error(res.msg)
            }
          })
        }
      });
    },
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue('password')) {
        callback('两次输入的密码不一致！');
      } else {
        callback();
      }
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      callback();
    },
  },
  mounted() {
    this.form.setFieldsValue({type: 0});
  }
};
</script>

<style scoped src="@/assets/log.css">
</style>

