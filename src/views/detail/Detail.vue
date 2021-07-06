<template>
  <div>
    <nav-bar>
      <template v-slot:default>商品详情{{id}}</template>
    </nav-bar>
    <van-image 
      width="100%"
      lazy-load
      :src="detail.cover_url"/>
    <van-card
      style="text-align: left"
      :num="detail.stock"
      :price="detail.price"
      :desc="detail.description"
      :title="detail.title"
    >
      <template #tags>
        <van-tag plain type="danger">新书</van-tag>
        <van-tag plain type="danger">推荐</van-tag>
      </template>
      <template #footer>
        <van-button type="warning" @click='handleAddCart'>加入购物车</van-button>
        <van-button type="danger" @click="goToCart">立即购买</van-button>
      </template>
    </van-card>
    <van-tabs v-model="active">
      <van-tab title="概述">
        <div class="content" v-html="detail.details"></div>
      </van-tab>
      <van-tab title="热评">
        <div v-for="item in detail.comments" :key="item.id">
          {{item}}
        </div>
      </van-tab>
      <van-tab title="相关图书">
        <goods-list :goods='like_goods'></goods-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import GoodsList from "components/content/goods/GoodsList";
import {useRoute, useRouter} from 'vue-router';
import {onMounted, reactive, ref, toRefs} from 'vue';
import {getDetail} from 'network/detail';
import {addCart} from 'network/cart';
import { Toast } from 'vant';
import { useStore } from 'vuex';
export default {
  name: 'Detail',
  components: {
    NavBar,
    GoodsList
  },
  setup() {
    let active = ref(0);
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    let id = ref(0);
    let book = reactive({
      detail:{},
      like_goods:[]
    });
    onMounted(()=>{
      id.value = route.query.id;
      getDetail(id.value).then(res=>{
        book.detail = res.goods;
        book.like_goods = res.like_goods;
      });
    })
    const handleAddCart = ()=>{
      addCart({
        goods_id: book.detail.id,
        num: 1
      }).then(res=>{
        if(res.status == '201' || res.status == '204'){
          Toast.success('添加成功');
          store.dispatch('updateCart');
        }
      })
    }
    const goToCart = ()=>{
      addCart({
        goods_id: book.detail.id,
        num: 1
      }).then(res=>{
        if(res.status == '201' || res.status == '204'){
          Toast.success('添加成功，显示购物车');
          store.dispatch('updateCart');
          router.push({path:'/shopcart'})
        }
      })
    }
    return {
      id,
      ...toRefs(book),
      active,
      handleAddCart,
      goToCart
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
  padding: 10px;
  *{
    z-index: -10;
  }
}
</style>