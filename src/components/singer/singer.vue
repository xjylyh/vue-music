<template>
  <div class="singer" ref="singer">
    <listview @select="selectSinger" :data="singers" ref="list"></listview>
    <router-view></router-view>
  </div>
</template>

<script>
import {getSingerList} from 'api/singer';
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'
import listview from 'base/listview/listview'
import {mapMutations} from 'vuex'
import {playlistMixin} from 'common/js/mixin';

const HOT_NAME = '热门';
const HOT_SINGER_LEN = 10;
  export default {
    mixins:[playlistMixin],
    data(){
      return{
        singers:[]
      }
    },
    created(){
      this._getSingerList();
    },
    components:{
      listview
    },
    methods:{
      handlePlaylist(playlist){
        const bottom = playlist.length>0?"60px":'';
        this.$refs.singer.style.bottom = bottom;
        this.$refs.list.refresh();
      },
      selectSinger(item){
        console.log('$emit::::::'+JSON.stringify(item));
        this.$router.push({
          path:`/singer/${item.id}`
        })
        this.setSinger(item);
      },
      _getSingerList(){
        console.log('init');
        getSingerList().then((res)=>{
          if(res.code===ERR_OK){
            this.singers = this._normalizeSinger(res.data.list);
          }
        });
      },
      _normalizeSinger(list){
        let maps = {
          hot:{
            title:HOT_NAME,
            item:[]
          }
        }
        list.forEach((item,index)=>{
          if(index<HOT_SINGER_LEN){
            maps.hot.item.push(new Singer({
              id:item.Fsinger_mid,
              name:item.Fsinger_name,
            }))
          }
          const key = item.Findex;
          if(!maps[key]){
            maps[key] = {
              title:key,
              item:[]
            }
          }
          maps[key].item.push(new Singer({
              id:item.Fsinger_mid,
              name:item.Fsinger_name,
            }))
        })
        //为了得到有序列表，需要处理maps
        let hot = [];
        let ret = [];
        for(let key in maps){
          let val = maps[key];
          if(val.title.match(/[a-zA-Z]/)){
            ret.push(val);
          }else if(val.title === HOT_NAME){
            hot.push(val);
          }
        }
        ret.sort((a,b)=>{
          return a.title.charCodeAt(0)-b.title.charCodeAt(0);
        })
        return hot.concat(ret);
      },
      ...mapMutations({
        setSinger:'SET_SINGER'
      })
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
