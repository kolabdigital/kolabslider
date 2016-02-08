$.fn.kolabSlider.animations.video = {
    init: function(slide, opts) {
        slide.find('.slide-bg').css({
            'min-width': opts.expandedWidth,
            'left': '-' + (opts.expandedWidth / 2) + 'px'
        });
    },
    show: function(slide, opts) {
        $(slide).find('.placholder-inner').on('click', function(event) {
          if(slide.hasClass('expanded')) {
            $(slide).find('.placeholder').fadeOut();
            $(slide).find('.details').fadeIn(800);

            var youtube_video_holder = $(slide).find('.youtube-video');
            if(youtube_video_holder.length > 0) {
              var youtube_video_id = youtube_video_holder.attr('data-video-url');
              $.fn.kolabSlider.animations.video.autoPlayVideo(youtube_video_holder.find('.player'), youtube_video_id, 'youtube');
            }

            var vimeo_video_holder = $(slide).find('.vimeo-video');
            if(vimeo_video_holder.length > 0) {
              var youtube_video_id = vimeo_video_holder.attr('data-video-url');
              $.fn.kolabSlider.animations.video.autoPlayVideo(vimeo_video_holder.find('.player'), youtube_video_id, 'vimeo');
            }
            return false;
          }
        });

      slide.find('.slide-bg').stop().animate({
        left: 0
      }, {
        duration: opts.animSpeed,
      });
    },
    hide: function(slide, opts) {
        $(slide).find('.placeholder').fadeIn(800);
        $(slide).find('.details').fadeOut();
        slide.find('.slide-bg').stop().animate({
          left: '-' + (opts.expandedWidth / 2 )
        }, {
          duration: opts.animSpeed,
        });
        var youtube_video_holder = $(slide).find('.youtube-video');
        if(youtube_video_holder.length > 0) {
          youtube_video_holder.find('.player').html('');
        }

        var vimeo_video_holder = $(slide).find('.vimeo-video');
        if(vimeo_video_holder.length > 0) {
          vimeo_video_holder.find('.player').html('');
        }
    },
    autoPlayVideo: function(container, video_id, video_type) {
      if(video_type === 'youtube'){
        container.html('<iframe width="1000" height="725" src="//www.youtube.com/embed/'+video_id+'?width=1000&amp;height=725&amp;theme=dark&amp;autoplay=1&amp;vq=large&amp;rel=0&amp;showinfo=0&amp;modestbranding=0&amp;iv_load_policy=3&amp;controls=1&amp;autohide=1&amp;start=0&amp;wmode=opaque" frameborder="0" allowfullscreen=""></iframe>');
      }else if(video_type === 'vimeo') {
        container.html('<iframe src="https://player.vimeo.com/video/'+video_id+'?autoplay=1&title=0&byline=0&portrait=0" width="1000" height="725" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
      }
    }
};
