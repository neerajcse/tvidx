/*
 * tvidx - Titans cross-browser video player.
 * JQuery plugin which aims to degrade gracefully from HTML5 to Flash player.
 * Under http://en.wikipedia.org/wiki/WTFPL
 *
 * Copyright (c) 2013 WTFPL
 * Where free is really free.
 *
 * www.neerajkumar.net
 * neerajkumar@outlook.com
 *
 */

(function($) {
  // plugin definition
  $.fn.gVideo = function(options) {    
    // build main options before element iteration    
    var defaults = {
      theme: 'simpledark',
      childtheme: ''
    };
    var options = $.extend(defaults, options);
    // iterate and reformat each matched element
    return this.each(function() {
      var $gVideo = $(this);
      
      //create html structure
      //main wrapper
      var $video_wrap = $('<div></div>').addClass('titans-video-player').addClass(options.theme).addClass(options.childtheme);
      //controls wraper
      var $video_controls = $('<div class="titans-video-controls"><a class="titans-video-play" title="Play/Pause"></a><div class="titans-video-seek"></div><div class="titans-video-timer">00:00</div><div class="titans-volume-box"><div class="titans-volume-slider"></div><a class="titans-volume-button" title="Mute/Unmute"></a></div></div>');            
      $gVideo.wrap($video_wrap);
      $gVideo.after($video_controls);
      
      //get new elements
      var $video_container = $gVideo.parent('.titans-video-player');
      var $video_controls = $('.titans-video-controls', $video_container);
      var $ghinda_play_btn = $('.titans-video-play', $video_container);
      var $ghinda_video_seek = $('.titans-video-seek', $video_container);
      var $ghinda_video_timer = $('.titans-video-timer', $video_container);
      var $ghinda_volume = $('.titans-volume-slider', $video_container);
      var $ghinda_volume_btn = $('.titans-volume-button', $video_container);
      
      $video_controls.hide(); // keep the controls hidden
            
      var gPlay = function() {
        if($gVideo.attr('paused') == false) {
          $gVideo[0].pause();          
        } else {          
          $gVideo[0].play();        
        }
      };
      
      $ghinda_play_btn.click(gPlay);
      $gVideo.click(gPlay);
      
      $gVideo.bind('play', function() {
        $ghinda_play_btn.addClass('titans-paused-button');
      });
      
      $gVideo.bind('pause', function() {
        $ghinda_play_btn.removeClass('titans-paused-button');
      });
      
      $gVideo.bind('ended', function() {
        $ghinda_play_btn.removeClass('titans-paused-button');
      });
      
      var seeksliding;      
      var createSeek = function() {
        if($gVideo.attr('readyState')) {
          var video_duration = $gVideo.attr('duration');
          $ghinda_video_seek.slider({
            value: 0,
            step: 0.01,
            orientation: "horizontal",
            range: "min",
            max: video_duration,
            animate: true,          
            slide: function(){              
              seeksliding = true;
            },
            stop:function(e,ui){
              seeksliding = false;            
              $gVideo.attr("currentTime",ui.value);
            }
          });
          $video_controls.show();          
        } else {
          setTimeout(createSeek, 150);
        }
      };

      createSeek();
    
      var gTimeFormat=function(seconds){
        var m=Math.floor(seconds/60)<10?"0"+Math.floor(seconds/60):Math.floor(seconds/60);
        var s=Math.floor(seconds-(m*60))<10?"0"+Math.floor(seconds-(m*60)):Math.floor(seconds-(m*60));
        return m+":"+s;
      };
      
      var seekUpdate = function() {
        var currenttime = $gVideo.attr('currentTime');
        if(!seeksliding) $ghinda_video_seek.slider('value', currenttime);
        $ghinda_video_timer.text(gTimeFormat(currenttime));              
      };
      
      $gVideo.bind('timeupdate', seekUpdate);  
      
      var video_volume = 1;
      $ghinda_volume.slider({
        value: 1,
        orientation: "vertical",
        range: "min",
        max: 1,
        step: 0.05,
        animate: true,
        slide:function(e,ui){
            $gVideo.attr('muted',false);
            video_volume = ui.value;
            $gVideo.attr('volume',ui.value);
          }
      });
      
      var muteVolume = function() {
        if($gVideo.attr('muted')==true) {
          $gVideo.attr('muted', false);
          $ghinda_volume.slider('value', video_volume);
          
          $ghinda_volume_btn.removeClass('titans-volume-mute');
        } else {
          $gVideo.attr('muted', true);
          $ghinda_volume.slider('value', '0');
          
          $ghinda_volume_btn.addClass('titans-volume-mute');
        };
      };
      
      $ghinda_volume_btn.click(muteVolume);
      
      $gVideo.removeAttr('controls');
      
    });
  };

  //
  // plugin defaults
  //
  $.fn.gVideo.defaults = {    
  };

})(jQuery);