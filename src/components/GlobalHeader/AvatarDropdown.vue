<template>
  <div> <a-modal v-model="visible" title="修改密码" @ok="handleOk" okText="确认" cancelText="取消">
      <a-input v-model="currentPassword" placeholder="请输入当前密码"></a-input>
      <a-input style="margin-top: 20px;" v-model="newPassword" placeholder="请输入新密码"></a-input>
    </a-modal>
    <a-dropdown v-if="currentUser && currentUser.name" placement="bottomRight">
      <span class="ant-pro-account-avatar">
        <a-avatar size="small" src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
          class="antd-pro-global-header-index-avatar" />
        <!-- <span>{{ currentUser.name }}</span> -->
        <span>个人中心</span>
      </span>

      <template v-slot:overlay>
        <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
          <!-- <a-menu-item v-if="menu" key="center" @click="handleToCenter">
          <a-icon type="user" />
          {{ $t('menu.account.center') }}
        </a-menu-item>
        <a-menu-item v-if="menu" key="settings" @click="handleToSettings">
          <a-icon type="setting" />
          {{ $t('menu.account.settings') }}
        </a-menu-item>
        <a-menu-divider v-if="menu" /> -->
          <a-menu-item key="change" @click="handlechange">
            <a-icon type="key" />
            修改密码
          </a-menu-item>
          <a-menu-item key="logout" @click="handleLogout">
            <a-icon type="logout" />
            退出登录
          </a-menu-item>

        </a-menu>
      </template>
    </a-dropdown>
    <span v-else>
      <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
    </span>
  </div>
</template>

<script>
import { Modal } from 'ant-design-vue'

export default {
  name: 'AvatarDropdown',
  props: {
    currentUser: {
      type: Object,
      default: () => null
    },
    menu: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false,
      newPassword: "",
      currentPassword: ""
    }
  },
  methods: {
    handleOk() {
      this.$http.post("/api/account/updatePassword", {
        "currentPassword": this.currentPassword,
        "newPassword": this.newPassword
      }).then((data) => {
        this.$message.info(data.msg);
        this.visible = false;
        if (data.code == 0) {
          this.$store.dispatch('Logout').then(() => {
            this.$router.push({ name: 'login' })
          })
        }
      })
    },
    handlechange() {
      this.visible = true
    },
    handleToCenter() {
      this.$router.push({ path: '/account/center' })
    },
    handleToSettings() {
      this.$router.push({ path: '/account/settings' })
    },
    handleLogout(e) {
      Modal.confirm({
        title: this.$t('layouts.usermenu.dialog.title'),
        content: this.$t('layouts.usermenu.dialog.content'),
        onOk: () => {
          // return new Promise((resolve, reject) => {
          //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1500)
          // }).catch(() => console.log('Oops errors!'))
          return this.$store.dispatch('Logout').then(() => {
            this.$router.push({ name: 'login' })
          })
        },
        onCancel() { }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }

  /deep/ .ant-dropdown-menu-item {
    min-width: 160px;
  }
}
</style>
