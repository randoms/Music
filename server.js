//var domain = "42.96.195.88"
var domain = "127.0.0.1"
var port = 9990
var music_dir = "./music"

var http = require('http')
var send = require('send')
var fs = require("fs")



var server = http.createServer(function(req, res){
    //send(req, 'cat_video.mp4').pipe(res)
    if(req.url.indexOf("/playList") != -1){
        if(req.url == "/playList"){
            return res.end(JSON.stringify(getPlayList(),null,4))
        }else{
            var playList = req.url.substring("/playList".length)
            return res.end(JSON.stringify(getMusicList(playList),null,4))
        }
    }else{
        send(req, req.url)
          .root(music_dir)
          .pipe(res)
        console.log("PLAYING:"+decodeURIComponent(req.url))
    }
})

server.listen(port,function(){
    console.log("START WORKING...")
})


function getPlayList(){
    var musicList = fs.readdirSync(music_dir)
    var length = musicList.length
    for(var count = 0; count<length; count++){
        musicList[count] = "http://"+domain+":"+port+"/"+musicList[count]
    }
    return musicList
}


function getMusicList(dir){
    console.log(dir)
    var musicList = fs.readdirSync(music_dir+dir)
    var length = musicList.length
    for(var count = 0; count<length; count++){
        musicList[count] = "http://"+domain+":"+port+dir+"/"+musicList[count]
    }
    return musicList
}