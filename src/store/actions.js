import * as types from './mutation-type'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

function findIndex(list,song){
    return list.findIndex((item)=>{
        return item.id===song.id;
    })
}
export const selectPlay = function({commit,state},{list,index}){//普通播放动作
    commit(types.SET_SEQUENCE_LIST,list);
    if(state.mode === playMode.random){//当选择模式变为随机播放时会触发列表改变
        let randomList = shuffle(list);//随机排序后的列表
        commit(types.SET_PLAYLIST,randomList);//设置当前的播放列表为改变后的列表
        index = findIndex(randomList,list[index]);//这里设置了排序后的歌曲的相对应的index
    }else{
        commit(types.SET_PLAYLIST,list);//如果没有设置为随机播放模式则一切如常
    }
    commit(types.SET_CURRENT_INDEX,index);//保存当前播放的歌曲的idnex
    commit(types.SET_FULL_SCREEN,true);//播放器展开或是mini状态
    commit(types.SET_PLAYING_STATE,true);//是否正在播放
}

export const randomPlay = function({commit},{list}){//随机播放动作，歌单列表随机播放按钮触发
    commit(types.SET_PLAY_MODE,playMode.random);//改变播放模式
    commit(types.SET_SEQUENCE_LIST,list);//默认列表
    let randomList = shuffle(list);//随机排序数组
    commit(types.SET_PLAYLIST,randomList);//设置随机排序列表为播放列表
    commit(types.SET_CURRENT_INDEX,0);//直接播放第一个
    commit(types.SET_FULL_SCREEN,true);//同上
    commit(types.SET_PLAYING_STATE,true);
}