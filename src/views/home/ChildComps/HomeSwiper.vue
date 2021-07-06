<template>
  <van-swipe class="my-swipe" v-if="banners.length" :autoplay="3000" indicator-color="white">
    <van-swipe-item v-for="(item, index) in banners" :key="index">
      <img v-lazy="item.img_url" alt="">
    </van-swipe-item>
  </van-swipe>
</template>

<script>
export default {
  name: "HomeSwiper",
  props: {
    banners: {
      type: Array,
      default() {
        return [];
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  img{
    width: 100%;
    height: auto;
  }
</style>
