<template>
  <div>
    <nav-bar>
      <template v-slot:default>商品分类</template>
    </nav-bar>
    <div id="mainbox">
      <div class="ordertab">
        <van-tabs v-model="active" @click="tabClick">
          <van-tab title="销量排序"></van-tab>
          <van-tab title="价格排序"></van-tab>
          <van-tab title="评论排序"></van-tab>
        </van-tabs>
      </div>
      <van-sidebar class="leftmenu" v-model="activeKey">
        <van-collapse v-model="activeName" accordion>
          <van-collapse-item v-for="item in categories" :key="item.id" :title="item.name" :name="item.name">
            <van-sidebar-item v-for="sub in item.children" :key="sub.id" :title="sub.name" @click="getGoods(sub.id)"/>
          </van-collapse-item>
        </van-collapse>
      </van-sidebar>
      <div class="goodslist">
         <div class="content">
           <van-card
            v-for="item in showGoods"
            @click="itemClick(item.id)"
            :key="item.id"
            :num="item.comments_count"
            :tag="item.comments_count >= 0 ?'流行':'标签'"
            :price="item.price"
            :desc="item.updated_at"
            :title="item.title"
            :thumb="item.cover_url"
            :lazy-load="true"
          />
         </div>
      </div>
    </div>
    <back-top @bTop="bTop" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import { reactive, ref } from '@vue/reactivity';
import {getCategory, getCategoryGoods} from 'network/category';
import BackTop from "components/common/backtop/BackTop";
import { computed, onMounted, watchEffect, nextTick } from '@vue/runtime-core';
import BScroll from 'better-scroll';
import { useRouter } from 'vue-router';
export default {
  name: 'Category',
  setup(){
    const router = useRouter();
    let activeKey = ref(0);
    let activeName = ref(0);
    let active = ref(1);
    let categories = ref([]);
    let bscroll = ref([]);
    let isShowBackTop = ref(false);
    onMounted(()=>{
      getCategory().then(res=>{
        categories.value = res.categories;
      });
      init();
      bscroll = new BScroll(document.querySelector(".goodslist"),{
        probeType: 3,
        click: true,
        pullUpLoad: true
      });
      bscroll.on("pullingUp",()=>{
        const page = ++goods[currentOrder.value].page;
        getCategoryGoods(currentOrder.value,currentCid.value,page).then(res=>{
          goods[currentOrder.value].list.push(...res.goods.data); 
        })
        bscroll.finishPullUp();
        nextTick(()=>{
          bscroll && bscroll.refresh();
        })
      })
      bscroll.on('scroll',(position)=>{
        isShowBackTop.value = (-position.y)>300;
      })
    })
    let currentOrder = ref('sales');
    let currentCid = ref(0);
    const goods = reactive({
      sales:{page:1, list:[]},
      price:{page:1, list:[]},
      comments_count:{page:1, list:[]},
    });
    const showGoods = computed(()=>{
      return goods[currentOrder.value].list;
    })
    const init = ()=>{
      getCategoryGoods('sales',currentCid.value).then(res=>{
        goods.sales.list = res.goods.data;
      });
      getCategoryGoods('price',currentCid.value).then(res=>{
        goods.price.list = res.goods.data;
      });
      getCategoryGoods('comments_count',currentCid.value).then(res=>{
        goods.comments_count.list = res.goods.data;
      });
    }
    const tabClick = (index)=>{
      let orders = ['sales','price','comments_count'];
      currentOrder.value = orders[index];
      getCategoryGoods(currentOrder.value,currentCid.value).then(res=>{
        goods[currentOrder.value].list = res.goods.data;
        nextTick(()=>{
          bscroll && bscroll.refresh();
        })
      })
    }
    const getGoods = (id)=>{
      currentCid.value = id;
      init();
    };
    watchEffect(()=>{
      nextTick(()=>{
        bscroll && bscroll.refresh();
      })
    })
    const bTop = ()=>{
      bscroll.scrollTo(0,0,300);
    }
    return {
      activeKey,
      activeName,
      active,
      categories,
      tabClick,
      getGoods,
      showGoods,
      isShowBackTop,
      bTop,
      itemClick:(id)=>{
        router.push({path:'/detail',query:{id}});
      }
    }
  },
  components: {
    NavBar,
    BackTop
  }
}
</script>

<style lang="scss" scoped>
  #mainbox {
    margin-top: 45px;
    // display: flex;
    .ordertab{
      position: fixed;
      height: 50px;
      top: 45px;
      right: 0;
      left: 130px;
      z-index: 10;
    }
    .leftmenu{
      position: fixed;
      top: 95px;
      left: 0;
      width: 130px;
    }
    .goodslist{
      position: absolute;
      top: 95px;
      left: 130px;
      right: 0;
      height: 100vh;
      text-align: left;
    }
  }
</style>