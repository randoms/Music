//var domain = "42.96.195.88"
var domain = "127.0.0.1"
var port = 9990
var music_dir = "./music"

var http = require('http');
var send = require('send');
var fs = require("fs");



var server = http.createServer(function(req, res){
    //send(req, 'cat_video.mp4').pipe(res);
    if(req.url == "/playList"){
        var musicList = getPlayList();
        return res.end(JSON.stringify(musicList));
    }else{
        send(req, req.url)
          .root(music_dir)
          .pipe(res);
    }
})

server.listen(port);



function getPlayList(){
    var musicList = fs.readdirSync(music_dir)
    var length = musicList.length
    for(var count = 0; count<length; count++){
        musicList[count] = "http://"+domain+":"+port+"/"+musicList[count]
    }
    return musicList
}