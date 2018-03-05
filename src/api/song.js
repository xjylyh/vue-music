import { commonParams,options } from './config';
import axios from 'axios';

export function getLyric(mid){
    const url = '/lyric';
    const data = Object.assign({},commonParams,{
        songmid:mid,
        pcachetime:new Date(),
        g_tk:5381,
        loginUin:0,
        hostUin:0,
        inCharset:'utf8',
        outCharset:'utf-8',
        notice:0,
        platform:'yqq',
        needNewCode:0,
        format:'json'
    })
    return axios.get(url,{
        params:data
    }).then((res)=>{
        return Promise.resolve(res.data);
    })
}