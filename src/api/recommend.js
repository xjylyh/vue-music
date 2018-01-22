import jsonp from 'common/js/jsonp'
import { commonParams,options } from './config';
export default function getRecommend(){
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
    const data = Object.assign({},commonParams,{
        platform:'h5',
        uin:470267864,
        needNewCode:1
    })
    return jsonp(url,data,options)
}