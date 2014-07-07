###Music
=====

一个node.js的音乐服务器程序，设置好之后你就可以在任何地方播放自己喜欢的音乐了

####requirement
客户端
    需要客户端有mplayer，目前只支持linux系统
    
服务端
    没有特别的要求

####用法

服务端设置

修改server.js里面的domain变量，将其改成自己的服务器ip，如果想要修改端口就改里面的port变量
把你的音乐文件放在music文件夹内
然后运行
    
    node server.js
就行了


客户端设置

修改clinet.js里面的domain变量，将ip改为自己的服务器ip，port端口设置成服务器端口
然后运行

    node client.js
这时候就能播放音乐了


####使用技巧

配合上screen指令就可以后台播放了。

客户端

    screen -S music
    node client.js
    ctrl + A, ctrl + D
    想要回去
    screen -r music

####新增特性

添加播放列表支持，在music文件夹内创建文件夹，在启动的时候就可选择播放哪个文件夹了
