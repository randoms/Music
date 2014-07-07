var music_dir = "./music"
var domain = "42.96.195.88"
//var domain = "127.0.0.1"
var port = 9990

var fs = require("fs")
var spawn = require('child_process').spawn
var request = require("request")
var raw_input = require("./utils/raw_input.js")

// mplayer will leave 2 process when play over
// this need to be cleaned
function clearMplayer(cb){
    var clear = spawn('killall',['mplayer']);
    clear.stderr.on('data',function(err){
        console.log(err);
    })
    
    clear.on('close',function(code){
        if(code == 0){
            console.log('Clear process');
            if(cb != null)cb()
        }else{
            console.log("PLAY:ERROR")
        }
    })
}

process.on('SIGINT', function() {
    clearMplayer()
    console.log('\nEXITED')
    process.exit(0)
});

function play(musicName,cb){
    console.log("PLAYING:"+musicName)
    var prefix = 'http://'+domain+':'+port+'/'
    var address = prefix+encodeURIComponent(musicName.substring(prefix.length,musicName.length))
    console.log(address);
    var playmusic = spawn('mplayer',[address],{cwd:__dirname})
    playmusic.on("error",function(err){
        console.log(err);
    })

    playmusic.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });
    
    playmusic.stdout.on('data',function(data){
        console.log('stdout: '+data)
    })
    
    playmusic.on("close",function(code){
        if(code == 0){
            if(cb != null)cb()
        }else{
            console.log("PLAY:ERROR")
        }
    })
}

function randomPlay(musicList){
    var next = function(musicList,playedList){
        if(musicList.length == playedList.length){
            playedList = []
            console.log("PLAY:ONE_LOOP")
        }
        // gene random order
        var unplayedList = []
        musicList.forEach(function(name){
            var length = playedList.length
            var playFlag = false
            for(var i=0;i<length;i++){
                if(name == playedList){
                    playFlag = true
                }
            }
            if(!playFlag)unplayedList.push(name)
        })
        var order = parseInt(Math.random()*unplayedList.length)
        play(musicList[order],function(){
            playedList.push(musicList[order])
            next(musicList,playedList)
        })
    }
    next(musicList,[])
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

getPlayList(function(myList){
    //loopPlay(myList);
    randomPlay(myList)
});


function getPlayList(cb){
    request('http://'+domain+":"+port+"/playList", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var myList = JSON.parse(body)
            var prefix = 'http://'+domain+":"+port;
            var myMusicList = []
            console.log("Please select your playList:")
            
            for(var count = 0; count<myList.length;count++){
                console.log((count+1)+" "+myList[count].substring(prefix.length+1))
            }
            console.log("0 play all list")
            raw_input(">",function(cmd){
                var cmd = cmd.split(' ')
                var completeFlag = 0;
                for(var i=0;i<cmd.length;i++){
                    var url = prefix + "/playList"+myList[i].substring(prefix.length)
                    request(url,function(err,res,body){
                        var music = JSON.parse(body);
                        music.forEach(function(add){
                            myMusicList.push(add);
                        })
                        completeFlag++
                        if(completeFlag == cmd.length)cb(myMusicList)
                    })
                }
            })
            
        }else{
            console.log("GET_PLAY_LIST:ERROR")
        }
    })
}


