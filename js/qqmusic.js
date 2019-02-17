$(function () {
    var $audio = $('.audio');
    var player = new Play($audio);
    var $progressBar = $('.song_over');
    var $progressLine = $('.song_ing');
    var $progressDot = $('.song_dot');
    var progress = new Progress($progressBar, $progressLine, $progressDot);
    //  1.载入音乐列表json
    addMusicList();
    function addMusicList() {
        $.ajax({
            type: "GET",
            url: "../source/musiclist.json",
            dataType: "json",
            success: function (data) {
                player.musicList = data;
                console.log(player.musicList);
                var $songList = $('.song_list');
                $.each(data, function (index, ele) {
                    var $item = createList(index, ele);
                    $songList.append($item);
                })
                createMucsicInfo(data[0]);
            },
            error: function (e) {
                console.log(e);
            }
        });
    }

    // 2.创建列表中每一个li
    function createList(index, ele) {
        var $item = $('<li>' +
            '<div class="song_item">' +
            '<div class="edit"></div>' +
            '<div class="song_list_number">' + (index + 1) + '</div>' +
            '<div class="song_list_songname">' +
            '<span class="song_name">' + ele.name + '</span>' +
            '<div class="mod_list_menu">' +
            '<a href="javascript:;"><i title="播放" class="m_playing"></i></a>' +
            '<a href="javascript:;"><i title="添加到" class="m_addTo"></i></a>' +
            '<a href="javascript:;" class="logining_down"><i title="下载" class="m_load"></i></a>' +
            '<a href="javascript:;"><i title="分享" class="m_share"></i></a>' +
            '</div>' +
            '</div>' +
            '<div class="song_list_singer"><a href="" title="' + ele.singer + '" class="singer">' + ele.singer + '</a></div>' +
            '<div class="song_list_time">' + ele.time + '</div>' +
            '<div class="song_list_other"></div>' +
            '<a href="javascript:;" class="song_list_delete" title="删除"></a>' +
            '</div>' +
            +'</li>');
        $item.get(0).index = index;
        $item.get(0).music_info = ele;
        return $item;
    }
    // 3.创建歌曲信息
    function createMucsicInfo(music) {
        var $songName = $('.m_name>a');
        var $singer = $('.m_singer>a');
        var $album = $('.m_album>a');
        var $bt_songName = $('.play_music_info');
        var $bt_time = $('.play_music_time');
        var $pic = $('.m_pic>img');
        var $bg_pic = $('.bg_pic');

        $songName.text(music.name);
        $songName.attr('title', music.name);
        $singer.text(music.singer);
        $singer.attr('title', music.singer);
        $album.text(music.album);
        $album.attr('title', music.album);
        $bt_songName.text(music.name);
        $bt_time.text('00:00' + ' / ' + music.time);
        $pic.attr('src', music.cover);
        $bg_pic.css('background', 'url("' + music.cover + '") no-repeat 0 0');
        $bg_pic.css('background-size', '100% 100%');
    }
    // 各类事件集合
    initEvent();
    function initEvent() {
        // 1.1点击登陆弹出登陆框
        user_login();
        function user_login() {
            $('.login>span').on("click", function () {
                $('.login_warp').show();
            })
        }

        // 1.2点击关闭登陆框
        close_login();
        function close_login() {
            $('.close').on('click', function () {
                $('.login_warp').hide();
            })
        }

        // 1.3 QQ登陆框与微信登陆框切换
        toggle_login();
        function toggle_login() {
            $(".qq").on('click', function () {
                $(this).addClass('green');
                $('.wx').removeClass('green');
                $('.qq_login').show();
                $('.wx_login').hide();
            })
            $(".wx").on('click', function () {
                $(this).addClass('green');
                $('.qq').removeClass('green');
                $('.wx_login').show();
                $('.qq_login').hide();
            })
        }

        /**
        * 音乐列表相关方法集合
        */
        // 2.1 移入歌曲li显示menu与删除按钮
        menuToggle();
        function menuToggle() {
            $('.song_list').on('mouseover', 'li', function () {
                $(this).find('.mod_list_menu').stop().fadeIn(50);
                $(this).find('.song_list_time').stop().fadeOut(10);
                $(this).find('.song_list_delete').stop().css('right', '55px');
            })
            $('.song_list').on('mouseout', 'li', function () {
                $(this).find('.mod_list_menu').stop().fadeOut(50);
                $(this).find('.song_list_time').stop().fadeIn(10);
                $(this).find('.song_list_delete').stop().css('right', '-99px');
            })
        }

        // 2.2 点击歌曲前部方框变成选中状态
        editChecked();
        function editChecked() {
            $('.song_list').on('click', 'div.edit', function () {
                $(this).toggleClass('edit_checked');
            })
        }

        // 2.3 播放按钮的状态切换
        mPlaying();
        function mPlaying() {
            $('.song_list').on('click', '.m_playing', function () {
                // 执行播放或暂停函数
                var $item = $(this).parents('li');
                player.playMusic($item.get(0).index, $item.get(0).music_info);
                createMucsicInfo($item.get(0).music_info);
                $(this).toggleClass('m_playing2');
                $(this).parents('li').siblings().find('.m_playing').removeClass('m_playing2');
                if ($(this).attr('class').indexOf('m_playing2') != -1) {
                    $('.playing').addClass('playing2');
                    $(this).parents('li').find('.song_name').addClass('song_name2');
                    $(this).parents('li').siblings().find('.song_name').removeClass('song_name2');
                    $(this).parents('li').find('.singer').addClass('singer2');
                    $(this).parents('li').siblings().find('.singer').removeClass('singer2');
                    $(this).parents('li').find('.song_list_number').addClass('song_list_number2');
                    $(this).parents('li').siblings().find('.song_list_number').removeClass('song_list_number2');
                } else {
                    $('.playing').removeClass('playing2');
                    $(this).parents('li').find('.song_name').removeClass('song_name2');
                    $(this).parents('li').find('.singer').removeClass('singer2');
                    $(this).parents('li').find('.song_list_number').removeClass('song_list_number2');
                }
            })
        }

        // 2.4.1 底部音乐控制切换
        bottomContorl();
        function bottomContorl() {
            $('.playing').on('click', function () {

                // 中间播放按钮---默认第一次触发第一首歌
                if (player.count == -1) {
                    $('.song_list>li').eq(0).find('.m_playing').trigger('click');
                } else {
                    $('.song_list>li').eq(player.count).find('.m_playing').trigger('click');
                }
            })
            $('.play_prev').on('click', function () {
                $('.song_list>li').eq(player.prevMusic()).find('.m_playing').trigger('click');
                console.log(player.musicList.length);

            })
            $('.play_next').on('click', function () {
                $('.song_list>li').eq(player.nextMusic()).find('.m_playing').trigger('click');
                console.log(player.count);
            })


        }

        // 2.4.2 进度条拖拽
        progressControls();
        function progressControls() {
            progress.progressBarClick(function(value){
                player.musicTeekTo(value);
            });
            progress.progressDotMove(function(value){
                player.musicTeekTo(value);
            });
        }

        // 2.4.3 时间同步
        player.musicTimeUpdate(function (duration, current, timeStr) {
            $('.play_music_time').text(timeStr);
            var value = current / duration * 100;
            progress.autoProgress(value);
        })

        
        // 2.5 删除音乐
        deleteMusic();
        function deleteMusic() {
            $('.song_list').on('click', '.song_list_delete', function () {
                var $lis = $(this).parents('li');
                // 判断是否删除当前播放的歌曲，是的话播放下一首
                if ($lis.get(0).index == player.count) {
                    $('.play_next').trigger('click');
                }
                $lis.remove();
                player.removeMusic($lis.get(0).index);
                // 循环新的音乐列表，重排序号  
                $('.song_list>li').each(function (index, ele) {
                    ele.index = index;
                    $(ele).find('.song_list_number').text(index + 1);
                })

            })
        }

        // 2.6 音量控制
        stopVolume();
        function stopVolume(){
            $('.stop_volume').on('click', function(){
                $(this).toggleClass('stop_volume2');
                if($(this).attr('class').indexOf('stop_volume2') != -1){
                    player.musicVolumeStop(0);
                }else{
                    player.musicVolumeStop(1);
                }
            })

            
        }
    }




})
