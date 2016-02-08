;(function($) {
    "use strict";

    $.fn.kolabSlider = function( options ) {

        // fix mistakes with the ready state
        var o;
        if ( this.length === 0 && !$.isReady ) {
            o = { s: this.selector, c: this.context };
            console.log('requeuing slideshow (dom not ready)');
            $(function() {
                $( o.s, o.c ).kolabSlider(options);
            });
            return this;
        }

        return this.each(function() {
            var opts;
            var container = $(this);

            if(container.data('kolabSlider.opts'))
                return; // already initialized

            opts = $.extend( {}, $.fn.kolabSlider.defaults, options || {});
            opts.API = $.extend ( { _container: container }, $.fn.kolabSlider.API );
            opts.SCROLL = $.extend ( { _container: container }, $.fn.kolabSlider.SCROLL );
            opts.TOUCHSWIPE = $.extend ( { _container: container }, $.fn.kolabSlider.TOUCHSWIPE );

            opts.animations = $.fn.kolabSlider.animations;

            // Initial margin left
            opts.previousPosition = 0;
            opts.initialSlidesVisible = opts.slidesVisible;

            container.data('kolabSlider.opts', opts);
            container.data('kolabSlider.API', opts.API);

            opts.API.preInitSlideshow();

            if(opts.slides.length)
              opts.API.initSlideshow();

              if(opts.scrollbar && typeof jQuery.ui !== undefined)
                opts.SCROLL.initScroll();

              if($.fn.swipe !== undefined)
                opts.TOUCHSWIPE.initTouchswipe();
        });

    };

    $.fn.kolabSlider.API = {
        initSlideshow: function() {
            var opts = this.opts();
        },
        opts: function() {
            return this._container.data('kolabSlider.opts');
        },
        changeVisibleSlides: function(newSlidesVisible) {
            var opts = this.opts();
            opts.slidesVisible = newSlidesVisible;
        },
        preInitSlideshow: function(){
            var opts = this.opts();
            opts.slides = $(this._container).find('.' + opts.slideClass);
            opts.slideCount = opts.slides.length;
            opts.sliderContainer = $(this._container).find('.' + opts.sliderContainerClass);
            opts.sliderContainerParent = opts.sliderContainer.parent();

            opts.slides.on('click', "close", { opts: opts }, opts.API.closeClick);
            opts.slides.on('click', { opts: opts }, opts.API.slideClick);

            opts.API.indexSlides();

            $.each(opts.slides, function(index, slide) {
                var opened = $(slide).attr('data-opened');
                if(opened == 'true') {
                    opts.openedSlideIndex = index;
                    return false;
                }
            });

            $(window).resize(function() {

                var windowWidth = $(window).width();
                // Prewent triggering resize event on iPad/iPhone scroll
                if(opts.initialWindowWidth == undefined || opts.initialWindowWidth != windowWidth) {
                    var newSlidesVisible = opts.initialSlidesVisible;

                    // Check if some responsive breakpoints are set in settings
                    $.each(opts.responsive, function( key, value ) {
                        if(value.width >= windowWidth){
                            newSlidesVisible = value.slidesVisible;
                        }
                    });

                    if( newSlidesVisible > 0 && (newSlidesVisible != opts.slidesVisible) )
                        opts.API.changeVisibleSlides(newSlidesVisible);

                    opts.API.sliderDimensions();

                    // Check if slide is marked as opened
                    if(opts.openedSlideIndex){
                        $(opts.slides[opts.openedSlideIndex]).trigger('click');
                    }else {
                        // If no ther is no opened slides, start at the middle of slider
                        var moveValue = 0;
                        if(opts.slidesVisible > 0) {
                            var diff =  (opts.slideCount - opts.slidesVisible) / 2;
                            moveValue = Math.floor(diff) * opts.slideWidth
                        }
                        opts.API.animateContainer(moveValue, opts.animSpeed, false, false, true, true);
                    }

                    // If less then posible visible slides open one
                    if(opts.slideCount < newSlidesVisible) {
                        $(opts.slides[1]).trigger('click');
                    }
                }

            });
            // Ttrigger resize on init to check if there are some responsice amends
            $(window).trigger('resize');
        },
        sliderDimensions: function() {
            var opts = this.opts();
            var sliderWidth = $(this._container).width(); // Main slide wrapper width
            opts.initialWindowWidth = sliderWidth;
            opts.slideWidth = sliderWidth / opts.slidesVisible;

            // When slide is expanded ther should be only place for max 2 collapsed slides on each side
            opts.expandedWidth = (opts.slidesVisible - 2) * opts.slideWidth;

            var expandedSlide = false;
            $.each(opts.slides, function(index, slide) {
                if($(slide).hasClass('expanded')) {
                    expandedSlide = true;
                    return false;
                }
            });

            if(expandedSlide) {
                $.each(opts.slides, function(index, slide) {
                    if($(slide).hasClass('expanded')) {
                        $(slide).width(opts.expandedWidth);
                    } else {
                        $(slide).width(opts.slideWidth);
                    }
                });
                opts.sliderContainer.width(((opts.slideCount - 1) * opts.slideWidth) + opts.expandedWidth);
            }else {
                opts.slides.width(opts.slideWidth);
                // opts.sliderContainer.width(opts.slideCount * opts.slideWidth);
            }

            // Calcualte each slide width and add animations
            opts.slides.each(function(index, el) {
                var slide = $(this);
                // Check if slide has other animation
                var animation = slide.attr('data-animation');
                if(!animation)
                    animation = opts.slideAnimation;
                opts.animations[animation].init(slide, opts);
            });
        },
        indexSlides: function() {
            var opts = this.opts();
            opts.slides.each(function(index, el) {
                var slide = $(this);
                slide.addClass('slide-' + (index))
                slide.attr({
                    'data-slide': index
                });

            });
        },
        slidersWidth: function() { // Add's all slides width
            var opts = this.opts();
            var width = 0;
            opts.slides.each(function(index, el) {
                width = width + $(this).width();
            });

            opts.sliderContainer.width(width + 1);

            if(opts.scrollbar)
                opts.SCROLL.resetScroll();

            return (width + 1); // Need to add 1px to prevent last slide flicker
        },
        animateContainer: function(moveValue, speed, clearQueue, jumpToEnd, animInProgress, initialSlide) {
            var opts = this.opts();
            var moveSpeed = speed || opts.animSpeed;

            clearQueue = clearQueue || false;
            jumpToEnd = jumpToEnd || false;
            opts.animInProgress = animInProgress || false;

            initialSlide = initialSlide || false;

            opts.sliderContainer.stop(clearQueue, jumpToEnd).animate({
                 'margin-left': '-' + moveValue
            }, {
                duration: moveSpeed,
                progress: function() {
                    // If we want to start for example from middle slide
                    if(initialSlide)
                        opts.API.slidersWidth();
                },
                complete: function(){
                    opts.animInProgress = false;
                }
            });

        },
        collapseSlides: function() {
            var opts = this.opts();
            opts.slides.each(function(index, el) {
                var slide = $(this);
                if(slide.hasClass('expanded')) {
                    slide.removeClass('expanded');

                    // Check if slide has other animation
                    var animation = slide.attr('data-animation');
                    if(!animation)
                        animation = opts.slideAnimation;

                    // Animations inside slider
                    opts.animations[animation].hide(slide, opts);

                    // Hide slide
                    opts.API.collapseSlide(slide, opts);
                }
            });
        },
        expandSlide: function(slide, opts, expandedWidth) {
            expandedWidth = expandedWidth || opts.expandedWidth;
            slide.stop().animate({
                width: expandedWidth
            }, {
                duration: opts.animSpeed,
                progress: function() {
                    opts.API.slidersWidth();
                },
                complete: function(){

                }
            });
        },
        collapseSlide: function(slide, opts) {
            slide.stop().animate({
                width: opts.slideWidth
            }, {
                duration: opts.animSpeed,
                progress: function() {
                    opts.API.slidersWidth();
                },
                complete: function(){

                }
            });
        },
        closeClick: function(event) {
            var slide = $(this);
            opts.API.collapseSlide(slide, opts);
        },
        moveSlider: function(direction) {
            if(direction === 'left' || direction === 'right') {
                var opts = this.opts();
                if(opts.animInProgress === false) {
                    var moveValue = 0;
                    var containerOffsetLeft = opts.sliderContainer.offset().left;

                    if(containerOffsetLeft <= 0) {
                        if(direction === 'right'){
                            moveValue = parseInt(containerOffsetLeft) + parseInt(opts.slideWidth);
                        }else if(direction === 'left') {
                            moveValue = parseInt(containerOffsetLeft) - parseInt(opts.slideWidth);
                        }
                        moveValue = Math.abs(moveValue);
                        var visibleOffset = (opts.slideCount * opts.slideWidth) - ((opts.slidesVisible -1) * opts.slideWidth);
                        if(visibleOffset % 1 != 0) {
                            visibleOffset = Math.round(visibleOffset / 10) * 10;
                        }

                        var maxMove = visibleOffset - opts.slideWidth;
                        if(maxMove % 1 != 0) {
                            maxMove = Math.round(maxMove / 10) * 10;
                        }

                        // Prevent going out of slide container
                        if(visibleOffset > moveValue && maxMove >= moveValue){
                            opts.API.animateContainer(moveValue, opts.animSpeed, false, false, true, true);
                        }
                    }
                }
            }
        },
        slideClick: function(event) {
            var opts = event.data.opts;
            var slide = $(this);
            var slideNumber = slide.attr('data-slide');

            if(slide.hasClass('expanded')) {
                if(opts.slideCount >= opts.slidesVisible) {
                    slide.removeClass('expanded');
                    // Check if slide has other animation
                    var animation = slide.attr('data-animation');
                    if(!animation)
                        animation = opts.slideAnimation;

                    // Animations inside slider
                    opts.animations[animation].hide(slide, opts);

                    // Hide slide
                    opts.API.collapseSlide(slide, opts);

                    var moveValue = 0;
                    var realSlideNumber = parseInt(slideNumber) + 1;

                    // If slide was collapsed move margin this way that it is allways shown as last visible slide
                    if(realSlideNumber > opts.slidesVisible) {
                        moveValue = (realSlideNumber - opts.slidesVisible) * opts.slideWidth
                    }

                    opts.API.animateContainer(moveValue, opts.animSpeed, false, false, true);
                }

            }else {
                opts.API.collapseSlides();
                slide.addClass('expanded');

                // Check if slide has other animation
                var animation = slide.attr('data-animation');
                if(!animation)
                    animation = opts.slideAnimation;

                // Animations inside slider
                opts.animations[animation].show(slide, opts);


                //--- Expand slide
                var windowWidth = $(window).width();

                // Full slide width without slide on each side
                var fullSlideCover = false;
                $.each(opts.responsive, function( key, value ) {
                    if(value.width >= windowWidth){
                        if(value.fullSlideCover)
                            fullSlideCover = value.fullSlideCover;
                    }
                });

                if(fullSlideCover){
                    opts.API.expandSlide(slide, opts, opts.sliderContainerParent.width());
                    var moveValue = ((slideNumber)  * opts.slideWidth);
                    if(slideNumber == (opts.slideCount -1)) moveValue = ((slideNumber)  * opts.slideWidth);
                } else {
                    opts.API.expandSlide(slide, opts);

                    var moveValue = ((slideNumber - 1)  * opts.slideWidth);
                    if(slideNumber == (opts.slideCount -1)) moveValue = ((slideNumber - 2)  * opts.slideWidth);

                    // console.log(opts.sliderContainer.offset().left);
                    // opts.previousPosition = opts.sliderContainer.offset().left;
                }

                opts.API.animateContainer(moveValue, opts.animSpeed, false, false, true);

            }
        }
    };

    $.fn.kolabSlider.SCROLL = {
        opts: function() {
            return this._container.data('kolabSlider.opts');
        },
        initScroll: function() {
            var opts = this.opts();
            var scrollBar = $('<div class="scroll-bar"></div>');
            var scrollbarWrap = $('<div class="scroll-bar-wrap ui-widget-content ui-corner-bottom"></div>');
            scrollbarWrap.append(scrollBar);
            opts.sliderContainerParent.append(scrollbarWrap);

            opts.scrollbar = scrollBar.slider({
                animate: opts.animSpeed,
                step: 0.1,
                slide: function( event, ui ) {

                    if ( opts.sliderContainer.width() > opts.sliderContainerParent.width() ) {
                        var moveValue = Math.round(ui.value / 100 * ( opts.sliderContainerParent.width() - opts.sliderContainer.width()));

                        moveValue = Math.abs(moveValue);
                        opts.API.animateContainer(moveValue, 1000, true, true);

                        // moveValue = moveValue+'px';
                        // opts.sliderContainer.css( "margin-left", moveValue);
                    }
                    else {
                        // opts.API.animateContainer(0, opts);
                        opts.sliderContainer.css( "margin-left", 0 );
                    }
                }
            });

            opts.scrollbar.bind('mousewheel DOMMouseScroll', function (e) {
                var delta = 0, element = opts.scrollbar, value, result, oe;
                oe = e.originalEvent; // for jQuery >=1.7
                value = element.slider('value');

                if (oe.wheelDelta) {
                    // delta = -oe.wheelDelta; // Oposite direction scroll
                    delta = oe.wheelDelta;
                }
                if (oe.detail) {
                    delta = oe.detail * 40;
                }

                value -= delta / 5;
                if (value > 100) {
                    value = 100;
                }
                if (value < 0) {
                    value = 0;
                }

                if(!opts.animInProgress){
                   result = element.slider('option', 'slide').call(element, e, { value: value });
                   if (result !== false) {
                       element.slider('value', value);
                   }
                }

                return false;
            });
        },
        moveScroll: function(percentage) {
            var opts = this.opts();
            if(opts.scrollbar.slider){
                opts.scrollbar.slider( "value", percentage );
            }
        },
        resetScroll: function() {
            var opts = this.opts();
            var remainder = opts.sliderContainerParent.width() - opts.sliderContainer.width();
            var leftVal = opts.sliderContainer.css( "margin-left" ) === "auto" ? 0 : parseInt( opts.sliderContainer.css( "margin-left" ) );
            var percentage = Math.round( leftVal / remainder * 100 );
            if(opts.scrollbar.slider){
                opts.scrollbar.slider( "value", percentage );
            }

        }
    };

    $.fn.kolabSlider.TOUCHSWIPE = {
        opts: function() {
            return this._container.data('kolabSlider.opts');
        },
        initTouchswipe: function() {
            var opts = this.opts();
            opts.sliderContainerParent.swipe( {
                allowPageScroll: 'vertical',
                //Generic swipe handler for all directions
                swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
                    opts.API.moveSlider(direction);
                },
                excludedElements:$.fn.swipe.defaults.excludedElements+", .scroll-bar-wrap"
            });
        }
    };

    // Animations on elemennts inside slider
    $.fn.kolabSlider.animations = {
        basic: {
            init: function(slide, opts) {
                slide.find('.slide-bg').css({
                    'min-width': opts.expandedWidth,
                    'left': '-' + (opts.expandedWidth / 2) + 'px'
                });
            },
            show: function(slide, opts) {
                slide.find('.slide-bg').stop().animate({
                  left: 0
                }, {
                  duration: opts.animSpeed,
                });
            },
            hide: function(slide, opts) {
                slide.find('.slide-bg').stop().animate({
                  left: '-' + (opts.expandedWidth / 2 )
                }, {
                  duration: opts.animSpeed,
                });
            }
        },
    };

    // default options
    $.fn.kolabSlider.defaults = {
        sliderContainerClass: 'slider-container',
        slideClass: 'slide', // Slides class
        animSpeed: 1000,
        slidesVisible: 6,
        slideAnimation: 'basic',
        scrollbar: true,
        responsive: {
            1: {
                width: 900,
                slidesVisible: 5,
                fullSlideCover: true
            },
            2: {
                width: 768,
                slidesVisible: 4
            },
            3: {
                width: 600,
                slidesVisible: 3
            },
            4: {
                width: 400,
                slidesVisible: 1
            }
        }
    };

}(jQuery));
