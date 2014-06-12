var spawn = require('child_process').spawn

var rm = spawn('rm',['-rf','test1'])
rm.on('close',function(){
    console.log('deleted!')
})
