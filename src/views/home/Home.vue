<template>
  <div id="home">
    <nav-bar>
      <template v-slot:default>图书兄弟</template>
    </nav-bar>
    <tab-control v-show="isTabFixed" @tabClick="tabClick" :titles="['畅销','新书','精选']"></tab-control>
    <div class="wrapper">
      <div class="content">
        <div ref="banref">
            <home-swiper :banners="banners"></home-swiper>
            <recommend-view :recommends='recommends'></recommend-view>
        </div>
        
        <tab-control @tabClick="tabClick" :titles="['畅销','新书','精选']"></tab-control>
        <goods-list :goods="showGoods"></goods-list>
      </div>
    </div>
    <back-top @bTop="bTop" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import RecommendView from "./ChildComps/RecommendView"
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList"
import BackTop from "components/common/backtop/BackTop";
import HomeSwiper from "./ChildComps/HomeSwiper"
import {getHomeAllData, getHomeGoods} from "network/home";
import {computed, nextTick, onMounted, reactive, ref, watchEffect} from 'vue';
import BScroll from 'better-scroll';
export default {
  name: 'Home',
  setup() {
    let isTabFixed = ref(false);
    let isShowBackTop = ref(false);
    let banref = ref(null);
    const recommends = ref([]);
    const goods = reactive({
      sales:{page:1, list: []},
      new:{page:1,list:[]},
      recommend:{page:1,list:[]}
    });
    let currentType = ref("sales");
    const showGoods = computed(()=>{
      return goods[currentType.value].list;
    })
    let bscroll = reactive({});
    let banners = ref([]);
    onMounted(()=>{
      getHomeAllData().then(res=>{
        recommends.value = res.goods.data;
        banners.value = res.slides;
      });
      getHomeGoods('sales').then(res=>{
        goods.sales.list = res.goods.data;
      });
      getHomeGoods('recommend').then(res=>{
        goods.recommend.list = res.goods.data;
      });
      getHomeGoods('new').then(res=>{
        goods.new.list = res.goods.data;
      });
      bscroll = new BScroll(document.querySelector('.wrapper'),{
        probeType: 3,
        click: true,
        pullUpLoad: true,
      });
      bscroll.on("scroll",(position)=>{
        isShowBackTop.value = isTabFixed.value = (-position.y) > banref.value.offsetHeight;
      })
      bscroll.on("pullingUp",()=>{
        const page = ++goods[currentType.value].page;
        getHomeGoods(currentType.value, page).then(res=>{
          goods[currentType.value].list.push(...res.goods.data);
        })
        bscroll.finishPullUp();
        bscroll.refresh();
      })
    });
    const tabClick = (index)=>{
      let type = ['sales','new','recommend'];
      currentType.value = type[index];
      nextTick(()=>{
        bscroll && bscroll.refresh();
      })
    }

    watchEffect(()=>{
      nextTick(()=>{
        bscroll && bscroll.refresh();
      })
    })

    const bTop = ()=>{
      bscroll.scrollTo(0,0,500);
    }

    return {
      recommends,
      tabClick,
      goods,
      showGoods,
      isTabFixed,
      banref,
      isShowBackTop,
      bTop,
      banners
    }
  },
  components: {
    NavBar,
    RecommendView,
    TabControl,
    GoodsList,
    BackTop,
    HomeSwiper
  }
}
</script>

<style lang="scss" scoped>
.banners {
  img {
    width: 100%;
    height: auto;
  }
}
#home {
  height: 100vh;
  position: relative;
  .wrapper {
    position: absolute;
    top: 45px;
    bottom: 50px;
    left: 0;
    right: 0;
    overflow: hidden;
  }
}
</style>