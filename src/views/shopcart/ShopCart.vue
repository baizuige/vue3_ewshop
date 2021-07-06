<template>
  <div>
      <nav-bar>
      <template v-slot:default>
        购物车(<span style="color:red">{{$store.state.cartCount}}</span>)
      </template>
    </nav-bar>
    <div class="cart-box">
      <div class="cart-body">
        <van-checkbox-group ref="checkboxGroup" @change="groupChange" v-model="result">
          <van-swipe-cell :right-width="50"
            v-for="(item, index) in list" :key="index"
          >
            <div class="good-item">
              <van-checkbox :name="item.id" />
              <div class="good-img"><img :src="item.goods.cover_url" alt=""></div>
              <div class="good-desc">
                <div class="good-title">
                  <span>{{item.goods.title}}</span>
                  <span>x{{item.goods.stock}}</span>
                </div>
                <div class="good-btn">
                  <div class="price"><small>￥</small>{{item.goods.price+'.00'}}</div>
                  <van-stepper integer :min="1" :max="item.goods.stock" :model-value="item.num" :name="item.id" async-change 
                    @change="onChange"
                  />
                </div>
              </div>
            </div>
            <template #right>
              <van-button 
                square
                icon="delete"
                type="danger"
                class="delete-button"
                @click="deleteGoods(item.id)"
              />
            </template>
          </van-swipe-cell>
        </van-checkbox-group>
      </div>
      <van-submit-bar class="submit-all" :price="total*100" @submit="onSubmit" button-text="结算">
        <van-checkbox @click="allCheck" v-model:checked="checkAll">全选</van-checkbox>
      </van-submit-bar>
      <div class="empty" v-if="!list.length">
        <img class="empty-cart" src="~assets/image/cart.png" alt="空购物车" >
        <div class="title">购物车空空如也</div>
        <van-button  ton round color="#1baeae" type="primary" block @click="goTo">前往选购</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { getCart, deleteCartItem, checkedCart, modifyCart } from 'network/cart'
import { Toast } from 'vant';
import { reactive, toRefs } from '@vue/reactivity';
import { computed, onMounted } from '@vue/runtime-core';
export default {
  name: 'ShopCart',
  setup() {
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      list: [],
      result: [],
      checkAll:false
    })
    const init = ()=>{
      Toast.loading({message:"加载中...",forbidClick:true});
      getCart('include=goods').then(res=>{
        state.list = res.data;
        state.result = res.data.filter(n=>
          n.is_checked == 1
        ).map(item=>item.id)
        Toast.clear();
      })
    }
    const total = computed(()=>{
      let sum = 0;
      state.list.filter(item=>state.result.includes(item.id))
        .forEach(item=>{
          sum += parseInt(item.num) * parseFloat(item.goods.price);
        })
      return sum;
    })
    onMounted(()=>{
      init();
    })
    const groupChange = (result)=>{
      if(result.length == state.list.length){
        state.checkAll = true;
      } else {
        state.checkAll = false;
      }
      state.result = result;
      
      checkedCart({cart_ids:result})
    }
    const goTo = ()=>{
      router.push({path:'/home'});
    }
    const onChange = (value,detail)=>{
      Toast.loading({message:'修改中...',forbidClick:true})
      modifyCart(detail.name,{num:value}).then(res=>{
        state.list.forEach(item=>{
          if(item.id==detail.name){
            item.num = value;
          }
        })
        Toast.clear();
      })
    }
    const allCheck = ()=>{
      if(!state.checkAll){
        state.result = state.list.map(item=>item.id);
        state.checkAll = true;
      } else {
        state.result = [];
        state.checkAll = false;
      }
    }
    const deleteGoods = (id)=>{
      deleteCartItem(id).then(res=>{
        init();
        store.dispatch('updateCart');
      })
    }
    const onSubmit = ()=>{
      if(state.result.length==0) {
        Toast.fail("请选择商品进行结算");
        return;
      } else {
        router.push({path:'/createorder'});
      }
    }
    return {
      ...toRefs(state),
      goTo,
      onChange,
      groupChange,
      allCheck,
      deleteGoods,
      total,
      onSubmit
    }
  },
  components: {
    NavBar,
  }
}
</script>
<style lang="scss" scoped>
.cart-box{
  .cart-body{
    margin: 60px 0 100px 0;
    padding-left: 10px;
    .good-item{
      display: flex;
      .good-img{
        display: flex;;
        justify-content: center;
        img{
          width: 100px;
          height: auto;
        }
      }
      .good-desc{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        padding: 20px;
        .good-title{
          display: flex;
          justify-content: space-between;
        }
        .good-btn{
          display: flex;
          justify-content: space-between;
          .price{
            font-size: 16px;
            color: red;
            line-height: 28px;
          }
          .van-icon-delete{
            font-size: 20px;
            margin-top: 4px;
          }
        }
      }
    }
    .delete-button{
      width: 50px;
      height: 100%;
    }
  }
  .empty{
    width: 50%;
    margin: 0 auto;
    text-align: center;
    margin-top: 200px;
    .empty-cart{
      width: 150px;
      margin-bottom: 20px;
    }
    .van-icon-smile-o{
      font-size: 50px;
    }
    .title{
      font-size: 16px;
      margin-bottom: 20px;
    }
  }
  .submit-all{
    margin-bottom: 50px;
    .van-checkbox{
      margin-left: 0px;
    }
    
    .van-submit-bar__text{
      margin-right: 10px;
    }
    .van-submit0bar__button{
      background: red;
    }
  }
  .van-checkbox__icon--checked .van-icon{
    background-color: red;
    border-color: red;
  }
}
</style>