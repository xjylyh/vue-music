<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
      @touchstart.prevent="progressTouchStart"
      @touchmove.prevent="progressTouchMove"
      @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {prefixStyle} from 'common/js/dom'
const progressBtnWidth = 16;
const transform = prefixStyle('transform');
export default {
  props:{
    percent:{//歌曲播放的百分比，所有的宽度计算都是基于这个
      type:Number,
      default:0
    }
  },
  created(){
    this.touch = {}
    /*
    这里的变量是为了储存进度条的状态，包括
    1.this.touch.initiated->是否点击到进度条球(进度条球的初始化状态) true被点击 false没有点到
    2.this.touch.startX->进度条球最开始被点击的位置
    3.this.touch.left->为了设置move事件下的进度条的宽度和进度条球的位置。记录进度条的最原始的宽度
    */
  },
  methods:{
    progressTouchStart(e){
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth;
    },
    progressTouchMove(e){
      if(!this.touch.initiated){//当没有点击到进度条球时return
        return
      }
      const deltaX = e.touches[0].pageX-this.touch.startX;//move事件下进度条球被拖动的距离
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth-progressBtnWidth,Math.max(0,this.touch.left+deltaX));//首先max计算出拖动的距离，而min是为了限制如果拖动距离大于进度条总宽度，则为进度条宽度
      this._offset(offsetWidth);
    },
    progressTouchEnd(e){
      this.touch.initiated = false;//拖动完成后把进度条球的拖动状态重置为false
      this.triggerPercent();//拖动完成调用像外派发事件来改变歌曲播放的时间
    },
    triggerPercent(){
      const barWidth = this.$refs.progressBar.clientWidth-progressBtnWidth;//这里总宽度减去进度条球宽度得到进度条的总宽度
      const percent = this.$refs.progress.clientWidth/barWidth;//计算出百分比
      this.$emit('percentChange',percent);//派发事件回传给父组件
    },
    _offset(offsetWidth){//这个方法是为了设置进度条的位置和进度条球的位置
      this.$refs.progress.style.width = `${offsetWidth}px`;
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
    },
    progressClick(e){//进度条的点击事件
      this._offset(e.offsetX);//设置进度条和进度条球
      this.triggerPercent();//计算并派发事件
    }
  },
  watch:{
    percent(newval){//监听传过来的percent
      if(newval>=0&&!this.touch.initiated){//这个判断是为了一方面保证歌曲已经播放（播放百分比>0），另一方面保证当前不是拖动进度条球的状态（进度条球拖动状态中不回根据传过来的percent进行位置改变）
        const barWidth = this.$refs.progressBar.clientWidth-progressBtnWidth;//进度条总宽度
        const offsetWidth = newval * barWidth;//进度条应该填充的宽度
        this._offset(offsetWidth);
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>