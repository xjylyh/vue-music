import originJSONP from 'jsonp'
export default function jsonp(url,data,option){
    if(data){
        url+=(url.indexOf('?')<0?'?':'')+param(data);
    }
    return new Promise((resolve,reject)=>{
        originJSONP(url,option,(err,data)=>{
            if(!err){
                resolve(data);
            }else{
                reject(data);
            }
        })
    })
}

function param(data){
    let url='';
    for(var key in data){
        let value = data[key]!==undefined?data[key]:'';
        url+=`&${key}=${encodeURIComponent(value)}`;
    }
    return url?url.substr(1):''
}