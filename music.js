// 音乐搜索接口：https://autumnfish.cn/search
// 请求方法：get
// 请求参数：keywords（查询的关键字）
// 响应内容：歌曲搜索结果

var musicplayer = new Vue({
    el: "#musicplayer",
    data:{
        search: "",
        musicList: "",
        getUrl: "",
        getAlbumUrl: "",
        getSongInfo:{
            title:"",
            singer:"",
            albumTitle: "",
            pulishedeTime:""
        },
        isPlaying:false,
    },
    methods:{
        searchMusic:function(){
            var that = this;
            axios.get("https://autumnfish.cn/search?keywords=" + this.search)
            .then(function(response){
                console.log(response);

                // duration:Unix format to common format
                for(var i =0; i<response.data.result.songs.length; i++){
                    let songDuration = response.data.result.songs[i].duration;
                    let min = parseInt((songDuration / 1000) / 60);
                    let sec = parseInt((songDuration / 1000) % 60);
                    min >= 10 ? min : min = "0" + min;
                    sec >= 10 ? sec : sec = "0" + sec;
                    response.data.result.songs[i].duration = min + ":" + sec;
                }

                that.musicList = response.data.result.songs;
                
        },function(err){})
        },

        hotKeywordSearch:function(keywords){
            this.search = keywords;
            console.log(this.search);
            this.searchMusic();
        },
// 歌曲url获取接口：https://autumnfish.cn/song/url
// 请求方法：get
// 请求参数：id（歌曲id）例子：4873540
// 响应内容：歌曲的url地址
        playMusic:function(musicId,index){
            var that = this;
            console.log(musicId);
            that.isPlayingIndex = index;
            axios.get("https://autumnfish.cn/song/url?id=" + musicId)
            .then(function(response){
                console.log(response);
                console.log(musicId);
                console.log(response.data.data[0].url);
                that.getUrl = response.data.data[0].url;
            },function(err){})

// 歌曲url获取接口：https://autumnfish.cn/song/detail
// 请求方法：get
// 请求参数：ids（歌曲id）
// 响应内容：歌曲的图片的url地址
            axios.get("https://autumnfish.cn/song/detail?ids=" + musicId)
            .then(function(response){
                console.log(response.data.songs[0].al.picUrl);
                that.getAlbumUrl = response.data.songs[0].al.picUrl;
                that.getSongInfo.title = response.data.songs[0].name;
                that.getSongInfo.singer = response.data.songs[0].ar[0].name;
                that.getSongInfo.albumTitle = response.data.songs[0].al.name;
                that.getSongInfo.pulishedeTime = UnixtimesTocommon(response.data.songs[0].publishTime);
                console.log(musicplayer);
            },function(err){})
        },

        play:function(){
            this.isPlaying = true;
            console.log("play"); 
        },

        pause:function(){
            console.log("pause")
        },      

    }
})

function UnixtimesTocommon (unixTimestamp){
    console.log(unixTimestamp);
    var date = new Date(unixTimestamp);
    return date.toISOString().substring(0,10);
}

