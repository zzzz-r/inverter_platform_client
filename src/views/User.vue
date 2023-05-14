<template>
  <div class="box-wrapper">
<!--    <img class="left-img" src="http://localhost:8082/upload/图片1.png">-->
    <div class="login-wrapper" style="width:70%;margin-top: 20px;">
      <div class="header" style="line-height: 80px"><a-icon type="idcard" theme="filled" />&nbsp;用户信息</div>

      <a-form class="form-wrapper" :form="form">
        <a-form-item>
          <a-upload
              :file-list="avatar"
              :action=uploadURL()
              list-type="picture-card"
              @change="handelCoverUploadChange"
              style="width: 20%;"
              v-decorator="[
              'avatar',
              { rules: [{ required: false }]},
            ]"
          >
            <div v-if="avatar.length < 1">
              <a-icon type="plus"/><div>上传头像</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-row>
          <a-col span="12">
            <a-form-item label="用户名" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-input
              class="input-item"
              placeholder="请输入用户名"
              v-decorator="[
              'userName',
              { rules: [{ required: true, message: '请输入用户名！' }] },
            ]"
          />
        </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item label="邮箱" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
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
          </a-col>
        </a-row>

        <a-row>
          <a-col span="12">
            <a-form-item label="新密码" has-feedback :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
              <a-input
                  class="input-item"
                  type="password"
                  placeholder="请输入密码"
                  v-decorator="[
              'password',
              { rules: [{ required: false, message: '请输入密码！' },
              { validator: validateToNextPassword }
              ]},
            ]"
              />
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item label="手机号" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
              <a-input
                  class="input-item"
                  placeholder="请输入手机号"
                  v-decorator="['phone',{ rules: [{ required: false, }, ], }, ]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col span="12">
            <a-form-item label="确认密码" has-feedback :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
              <a-input
                  class="input-item"
                  type="password"
                  placeholder="请再次输入密码"
                  v-decorator="[
              'confirm',
              { rules: [{ required: false, message: '请确认密码！' },
              { validator: compareToFirstPassword }
              ] },
            ]"
                  @blur="handleConfirmBlur"
              />
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item label="用户类型" style="text-align: left" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
              <a-radio-group :disabled="true" v-decorator="['type',{ rules: [{ required: true, }, ], }, ]">
                <a-radio :value="0">
                  普通用户
                </a-radio>
                <a-radio :value="1">
                  机构用户
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col span="12">
            <a-form-item label="报警消息推送" style="text-align: left" :label-col="{ span: 7 }" :wrapper-col="{ span: 14 }">
              <a-radio-group v-decorator="['alarmMessage',{ rules: [{ required: true, }, ], }, ]">
                <a-radio :value="1">
                  开启
                </a-radio>
                <a-radio :value="0">
                  关闭
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item label="所属机构" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-input
                class="input-item"
                :disabled="true"
                v-decorator="['institute',{ rules: [{ required: false}, ], }, ]"
            />
          </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div style="width: 100%">

        <a-button class="register-btn" type="primary" @click="save" style="background-color: rgba(56,56,56,0.85)">
          保存
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import {updateUser} from "@/api/api";
import {uploadURL} from "@/config/config";
import {EventBus} from "@/main";

export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: 'user_info' }),
      confirmDirty: false,
      avatar: [],
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
    };
  },
  methods: {
    setUserInfo(){
      this.form.setFieldsValue({userName: this.user.userName, email: this.user.email, phone: this.user.phone,
        type: this.user.type, institute: this.user.institute, alarmMessage: this.user.alarmMessage});
      if(this.user.avatar){
        this.avatar.push({
          uid: -1,
          url: this.coverUrlWithPrefix(this.user.avatar),
        });
      }
    },
    uploadURL() {
      return uploadURL
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
    handelCoverUploadChange(res){
      this.avatar = res.fileList;
      if(res.file.status === "done"){
        this.$message.success('上传成功')
        this.avatar = [];
        this.avatar.push({
          uid: res.file.uid,
          url: this.coverUrlWithPrefix(res.file.response.data),
        })
      }else if(res.file.status === "error"){
        this.$message.error('上传失败!只能上传小于1Mb的图片文件！')
        this.avatar = [];
      }else if(res.file.status === 'removed'){
        const removedFile = res.file
        const index = this.avatar.findIndex(file => file.uid === removedFile.uid)
        if (index !== -1) {
          this.avatar.splice(index, 1)
        }
      }
    },
    save(e){
      if(this.avatar.length>0) {
        this.form.setFieldsValue({avatar: this.coverUrlWithoutPrefix(this.avatar[0].url)})
      }

      if(this.form.getFieldValue('password') === '') //防止提交空密码
        this.form.setFieldsValue({password: null, confirm: null});
      if(this.form.getFieldValue('password') !== null && this.form.getFieldValue('confirm') === null){
        this.$message.warning("请确认密码！");
        return;
      }

      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          // console.log('表单数据: ', values);
          updateUser(this.user.id, values).then(res => {
            if (res.code === 0) {
              this.$message.success("保存成功")
              localStorage.setItem("user", JSON.stringify(res.data))
              EventBus.$emit('userInfoChange') // 触发事件修改header头像
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      });
    }
  },
  mounted() {
    this.setUserInfo()
  },

};
</script>

<style scoped src="@/assets/log.css">
.box-wrapper{
  overflow: scroll;
}
avatar-container {
  padding: 20px;
}
</style>

