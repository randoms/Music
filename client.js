var music_dir = "./music"
var domain = "42.96.195.88"
//var domain = "127.0.0.1"
var port = 9990

var fs = require("fs")
var spawn = require('child_process').spawn
var request = require("request")


function play(musicName,cb){
    console.log("PLAYING:"+musicName)
    var playmusic = spawn('mplayer',['-cache','500',musicName])
    playmusic.on("error",function(err){
        console.log(err);
    })
    
     playmusic.stdout.on('data', function (data) {
     console.log('stdout: ' + data);
     });
 
     playmusic.stderr.on('data', function (data) {
     console.log('stderr: ' + data);
     });

    
    playmusic.on("close",function(code){
        if(code != -1){
            if(cb != null)cb()
        }else{
            console.log("PLAY:ERROR")
        }
    })
}

function loopPlay(musicList){
    var next = function(musicList,order){
        if(order == musicList.length){
            order = 0;
            console.log("PLAY:ONE_LOOP");
        }
        play(musicList[order],function(){
            next(musicList,order+1)
        })
    }
    next(musicList,0);
}

function randomPlay(musicList){
    var next = function(musicList,playedList){
        if(playedList.length == musicList.length){
            playedList = []
            console.log("PLAY:ONE_LOOP")
        }
        // gene random order
        var unplayedList = []
        musicList.forEach(function(name){
            var playedLength = playedList.length
            var playedFlag = false
            for(var i=0;i<playedLength;i++){
                if(playedList[i] == name){
                    // this music is played
                   playedFlag = true
                }
            }
            if(!playedFlag)unplayedList.push(name)
        })

        randomOrder = parseInt(Math.random()*unplayedList.length)
	console.log(randomOrder)
        play(musicList[randomOrder],function(){
            playedList.push(musicList[randomOrder])
            next(musicList,playedList)
        })
    }

    next(musicList,[])
}

getPlayList(function(myList){
    //loopPlay(myList);
    randomPlay(myList);
});


function getPlayList(cb){
    request('http://'+domain+":"+port+"/playList", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var myList = JSON.parse(body);
            console.log("GET_PLAY_LIST:OK")
            cb(myList);
        }else{
            console.log("GET_PLAY_LIST:ERROR")
        }
    })
}
