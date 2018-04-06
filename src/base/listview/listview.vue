<template>
  <scroll class="listview"
   :data="data"
    ref="listview"
    :listenScroll="listenScroll"
    @scroll="scroll"
    :probeType="probeType">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.item" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar" />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchmove.stop.prevent="onShortcutTouchMove" @touchstart="onShortcutTouchStart">
      <ul>
        <li :class="{'current':currentIndex===index}"
         v-for="(item,index) in shortcutList"
          class="item"
           :data-index="index"
          >{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import {getData} from 'common/js/dom'

const ANCHOR_HEIGHT=18;
const TITLE_HEIGHT = 30;

 export default {
   created(){
     this.touch = {};
     this.listenScroll = true;
     this.listHeight = [];
     this.probeType = 3;
   },
   props:{
     data:{
       type:Array,
       default:[]
     }
   },
   data(){
     return {
       scrollY:-1,
       currentIndex: 0,
       diff:-1
     }
   },
   computed:{
     shortcutList(){
       return this.data.map((group)=>{
         return group.title.substr(0,1);
       })
     },
     fixedTitle(){
       if(this.scrollY>0){
         return '';
       }
       return this.data[this.currentIndex]?this.data[this.currentIndex].title:'';
     }
   },
   methods:{
     refresh(){
       this.$refs.listview.refresh();
     },
     selectItem(item){
       this.$emit('select',item);
     },
     onShortcutTouchStart(event){
       const solindex = getData(event.target,'index');
       let firstTouch = event.touches[0];
       this.touch.y1 = firstTouch.pageY;
       this.touch.solindex = solindex;
       this._scrollTo(solindex);
     },
     onShortcutTouchMove(event){
       let firstTouch = event.touches[0];
       this.touch.y2 = firstTouch.pageY;
       let data = (this.touch.y2-this.touch.y1)/ANCHOR_HEIGHT | 0;
       let solindex = parseInt(this.touch.solindex)+data;
       this._scrollTo(solindex);
     },
     _scrollTo(index){
       if(!index && index!==0){
         return;
       }
       if(index<0){
         index=0;
       }else if(index>this.listHeight-2){
         index = this.listHeight-2;
       }
       this.$refs.listview.scrollToElement(this.$refs.listGroup[index],1000);
     },
     scroll(pos){
       this.scrollY = pos.y
     },
     _calculateHeight(){
       this.listHeight = [];
       const list = this.$refs.listGroup;
       let height = 0;
       this.listHeight.push(height);
       for(let i=0;i<list.length;i++){
         let item = list[i];
         height += item.clientHeight;
         this.listHeight.push(height);
       }
     }
   },
   watch:{
     data(){
       setTimeout(()=>{
         this._calculateHeight();
       })
     },
     scrollY(newY){//由于监听scrollY，而scroll.vue组件派发出来的事件返回的pos.y也是负数，所以在下面传过来的新的值也就是（newY）需要变为负数再做比较
       const listHeight = this.listHeight;
       //当滚动到顶部，newY>0
       if(newY>0){
         this.currentIndex = 0;
         return;
       }
       for(let i=0;i<listHeight.length-1;i++){
         let heightlow = listHeight[i];
         let heightup = listHeight[i+1];
         if(-newY>=heightlow && -newY<heightup){
           this.currentIndex = i;
           this.diff = heightup+newY;
           return;
         }
       }

       //当滚动到底部
       this.currentIndex = listHeight.length-2;
     },
     diff(newval){
       let fixedTop = (newval>0 && (newval<TITLE_HEIGHT?newval-TITLE_HEIGHT:0));
       if(this.fixedTop===fixedTop){
         return;
       }
       this.fixedTop = fixedTop;
       this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
       console.log(fixedTop);
     }
   },
   components:{
     scroll,loading
   }
 }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
