<template>
  <div>
    <nav-bar>
      <template v-slot:default>新用户注册</template>
    </nav-bar>
    <div style="margin-top: 50px">
      <div style="text-align:center;padding-top:50pxd">
        <van-image
          width="10rem"
          height="8rem"
          src="https://img01.yzcdn.cn/vant/cat.jpeg"
        />
      </div>
    </div>
    <van-form @submit="onSubmit">
      <van-field
        v-model="email"
        name="邮箱"
        label="邮箱"
        placeholder="邮箱"
        :rules="[{ required: true, message: '请填写邮箱' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div style="margin: 16px;">
        <div class="link-login">
          没有账号，<span @click="$router.push({path:'/register'})">立即注册</span>
        </div>
        <van-button round block type="info" color="#44b883" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import { reactive, toRefs } from '@vue/reactivity';
import {login} from 'network/user';
import {Notify, Toast} from 'vant';
import { useRouter } from 'vue-router';
import {useStore} from 'vuex';
export default {
  name: "Login",
  components:{
    NavBar
  },
  setup() {
    const userinfo = reactive({
      email: '',
      password: ''
    });
    const store = useStore();
    const router = useRouter();
    const onSubmit = ()=>{
      login(userinfo).then(res=>{
        window.localStorage.setItem('token',res.access_token);
        store.commit('setIsLogin', true);
        Toast.success("登录成功");
        userinfo.email = '';
        userinfo.password = '';
        setTimeout(()=>{
          router.push({path:'/'});
        },500)
      })
    }
    return {
      ...toRefs(userinfo),
      onSubmit
    }
  }
}
</script>

<style lang="scss" scoped>
  .link-login{
    font-size: 14px;
    margin-bottom: 20px;
    display: inline-block;
    span{
      color: #42b983;
    }
  }
</style>