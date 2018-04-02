const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');

app.use(express.static(path.join(__dirname,'/dist')));

app.get('/getDiscList',function(req,res){
    var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';
    axios.get(url,{
      headers:{
        referer:'https://c.y.qq.com/',
        host:'c.y.qq.com'
      },
      params:req.query
    }).then((response)=>{
      res.json(response.data);
      console.log(response.data);
      res.end();
    }).catch((e)=>{
      console.log(e);
    })
  })
  app.get('/lyric',function(req,res){
    var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';
    axios.get(url,{
      headers:{
        referer:'https://c.y.qq.com/',
        host:'c.y.qq.com'
      },
      params:req.query
    }).then((response)=>{
      var ret = response.data;
      if(typeof ret === 'string'){
        var reg = /^\w+\(({[^()]+})\)$/;
        var matches = ret.match(reg);
        if(matches){
          ret = JSON.parse(matches[1]);
        }
      }
      res.json(ret);
    }).catch((e)=>{
      console.log(e);
    })
  })
  app.listen('9001',function(){
      console.log('app is run in n1');
  })