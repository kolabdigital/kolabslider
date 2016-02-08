$.fn.kolabSlider.animations.promo = {
    init: function(slide, opts) {
        if(slide.hasClass('expanded')) {
          slide.find('.slide-bg').css({
              'min-width': opts.expandedWidth,
              'left': 0
          });
        }else {
          slide.find('.slide-bg').css({
              'min-width': opts.expandedWidth,
              'left': '-' + (opts.expandedWidth / 2) + 'px'
          });
        }
    },
    show: function(slide, opts) {
      $(slide).find('.placeholder').fadeOut();
      $(slide).find('.details').fadeIn(800);

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
    }
};
