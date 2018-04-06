<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" :data="dicList" class="recommend-content">
      <div>
        <div v-if="recommend.length" class="slider-wrapper">
          <slider>
            <div v-for="item in recommend">
              <a :href="item.linkUrl">
                <img @load="loadImg" class="needsclick" :src="item.picUrl" alt="">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list" ref="list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in dicList" class="item">
              <div class="icon">
                <img v-lazy="item.imgurl" width="60" height="60">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!dicList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import loading from 'base/loading/loading'
import slider from 'base/slider/slider'
import scroll from 'base/scroll/scroll'
import {getRecommend,getDiscList} from "api/recommend"
import {ERR_OK} from 'api/config'
import {playlistMixin} from 'common/js/mixin'
export default {
  mixins:[playlistMixin],
  data(){
    return {
      recommend:[],
      dicList:[]
    }
  },
  components:{
    slider,scroll,loading
  },
  created(){
    this._getRecommend();
    this._getDiscList();
  },
  methods:{
    handlePlaylist(playlist){
       const bottom = playlist.length>0?'60px':'';
       this.$refs.recommend.style.bottom = bottom;
       this.$refs.scroll.refresh();
     },
    _getRecommend(){ 
      getRecommend().then((res)=>{
        if(res.code===ERR_OK){
          console.log(res.data.slider.length)
           for(var i=0;i<res.data.slider.length;i++){
              res.data.slider[i].picUrl = res.data.slider[i].picUrl.replace(/^http/ig,'https');
           }
          this.recommend = res.data.slider;
        }
      })
    },
    _getDiscList(){
      getDiscList().then((res)=>{
        if(res.code==ERR_OK){
          this.dicList = res.data.list;
        }
      })
    },
    loadImg(){
      if(!this.checkLoaded){
        this.$refs.scroll.refresh();
        this.checkLoaded = true;
      }
      
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>