webpackJsonp([0],[function(i,e,s){i.exports=s(1)},function(i,e,s){(function(i){"use strict";!function(e){e.fn.kolabSlider=function(s){var n;return 0!==this.length||e.isReady?this.each(function(){var n,t=e(this);t.data("kolabSlider.opts")||(n=e.extend({},e.fn.kolabSlider.defaults,s||{}),n.API=e.extend({_container:t},e.fn.kolabSlider.API),n.SCROLL=e.extend({_container:t},e.fn.kolabSlider.SCROLL),n.TOUCHSWIPE=e.extend({_container:t},e.fn.kolabSlider.TOUCHSWIPE),n.animations=e.fn.kolabSlider.animations,n.previousPosition=0,n.initialSlidesVisible=n.slidesVisible,t.data("kolabSlider.opts",n),t.data("kolabSlider.API",n.API),n.API.preInitSlideshow(),n.slides.length&&n.API.initSlideshow(),n.scrollbar&&void 0!==typeof i.ui&&n.SCROLL.initScroll(),void 0!==e.fn.swipe&&n.TOUCHSWIPE.initTouchswipe())}):(n={s:this.selector,c:this.context},console.log("requeuing slideshow (dom not ready)"),e(function(){e(n.s,n.c).kolabSlider(s)}),this)},e.fn.kolabSlider.API={initSlideshow:function(){this.opts()},opts:function(){return this._container.data("kolabSlider.opts")},changeVisibleSlides:function(i){var e=this.opts();e.slidesVisible=i},preInitSlideshow:function(){var i=this.opts();i.slides=e(this._container).find("."+i.slideClass),i.slideCount=i.slides.length,i.sliderContainer=e(this._container).find("."+i.sliderContainerClass),i.sliderContainerParent=i.sliderContainer.parent(),i.slides.on("click","close",{opts:i},i.API.closeClick),i.slides.on("click",{opts:i},i.API.slideClick),i.API.indexSlides(),e.each(i.slides,function(s,n){var t=e(n).attr("data-opened");return"true"==t?(i.openedSlideIndex=s,!1):void 0}),e(window).resize(function(){var s=e(window).width();if(void 0==i.initialWindowWidth||i.initialWindowWidth!=s){var n=i.initialSlidesVisible;if(e.each(i.responsive,function(i,e){e.width>=s&&(n=e.slidesVisible)}),n>0&&n!=i.slidesVisible&&i.API.changeVisibleSlides(n),i.API.sliderDimensions(),i.openedSlideIndex)e(i.slides[i.openedSlideIndex]).trigger("click");else{var t=0;if(i.slidesVisible>0){var l=(i.slideCount-i.slidesVisible)/2;t=Math.floor(l)*i.slideWidth}i.API.animateContainer(t,i.animSpeed,!1,!1,!0,!0)}i.slideCount<n&&e(i.slides[1]).trigger("click")}}),e(window).trigger("resize")},sliderDimensions:function(){var i=this.opts(),s=e(this._container).width();i.initialWindowWidth=s,i.slideWidth=s/i.slidesVisible,i.expandedWidth=(i.slidesVisible-2)*i.slideWidth;var n=!1;e.each(i.slides,function(i,s){return e(s).hasClass("expanded")?(n=!0,!1):void 0}),n?(e.each(i.slides,function(s,n){e(n).hasClass("expanded")?e(n).width(i.expandedWidth):e(n).width(i.slideWidth)}),i.sliderContainer.width((i.slideCount-1)*i.slideWidth+i.expandedWidth)):i.slides.width(i.slideWidth),i.slides.each(function(s,n){var t=e(this),l=t.attr("data-animation");l||(l=i.slideAnimation),i.animations[l].init(t,i)})},indexSlides:function(){var i=this.opts();i.slides.each(function(i,s){var n=e(this);n.addClass("slide-"+i),n.attr({"data-slide":i})})},slidersWidth:function(){var i=this.opts(),s=0;return i.slides.each(function(i,n){s+=e(this).width()}),i.sliderContainer.width(s+1),i.scrollbar&&i.SCROLL.resetScroll(),s+1},animateContainer:function(i,e,s,n,t,l){var d=this.opts(),a=e||d.animSpeed;s=s||!1,n=n||!1,d.animInProgress=t||!1,l=l||!1,d.sliderContainer.stop(s,n).animate({"margin-left":"-"+i},{duration:a,progress:function(){l&&d.API.slidersWidth()},complete:function(){d.animInProgress=!1}})},collapseSlides:function(){var i=this.opts();i.slides.each(function(s,n){var t=e(this);if(t.hasClass("expanded")){t.removeClass("expanded");var l=t.attr("data-animation");l||(l=i.slideAnimation),i.animations[l].hide(t,i),i.API.collapseSlide(t,i)}})},expandSlide:function(i,e,s){s=s||e.expandedWidth,i.stop().animate({width:s},{duration:e.animSpeed,progress:function(){e.API.slidersWidth()},complete:function(){}})},collapseSlide:function(i,e){i.stop().animate({width:e.slideWidth},{duration:e.animSpeed,progress:function(){e.API.slidersWidth()},complete:function(){}})},closeClick:function(i){var s=e(this);opts.API.collapseSlide(s,opts)},moveSlider:function(i){if("left"===i||"right"===i){var e=this.opts();if(e.animInProgress===!1){var s=0,n=e.sliderContainer.offset().left;if(0>=n){"right"===i?s=parseInt(n)+parseInt(e.slideWidth):"left"===i&&(s=parseInt(n)-parseInt(e.slideWidth)),s=Math.abs(s);var t=e.slideCount*e.slideWidth-(e.slidesVisible-1)*e.slideWidth;t%1!=0&&(t=10*Math.round(t/10));var l=t-e.slideWidth;l%1!=0&&(l=10*Math.round(l/10)),t>s&&l>=s&&e.API.animateContainer(s,e.animSpeed,!1,!1,!0,!0)}}}},slideClick:function(i){var s=i.data.opts,n=e(this),t=n.attr("data-slide");if(n.hasClass("expanded")){if(s.slideCount>=s.slidesVisible){n.removeClass("expanded");var l=n.attr("data-animation");l||(l=s.slideAnimation),s.animations[l].hide(n,s),s.API.collapseSlide(n,s);var d=0,a=parseInt(t)+1;a>s.slidesVisible&&(d=(a-s.slidesVisible)*s.slideWidth),s.API.animateContainer(d,s.animSpeed,!1,!1,!0)}}else{s.API.collapseSlides(),n.addClass("expanded");var l=n.attr("data-animation");l||(l=s.slideAnimation),s.animations[l].show(n,s);var o=e(window).width(),r=!1;if(e.each(s.responsive,function(i,e){e.width>=o&&e.fullSlideCover&&(r=e.fullSlideCover)}),r){s.API.expandSlide(n,s,s.sliderContainerParent.width());var d=t*s.slideWidth;t==s.slideCount-1&&(d=t*s.slideWidth)}else{s.API.expandSlide(n,s);var d=(t-1)*s.slideWidth;t==s.slideCount-1&&(d=(t-2)*s.slideWidth)}s.API.animateContainer(d,s.animSpeed,!1,!1,!0)}}},e.fn.kolabSlider.SCROLL={opts:function(){return this._container.data("kolabSlider.opts")},initScroll:function(){var i=this.opts(),s=e('<div class="scroll-bar"></div>'),n=e('<div class="scroll-bar-wrap ui-widget-content ui-corner-bottom"></div>');n.append(s),i.sliderContainerParent.append(n),i.scrollbar=s.slider({animate:i.animSpeed,step:.1,slide:function(e,s){if(i.sliderContainer.width()>i.sliderContainerParent.width()){var n=Math.round(s.value/100*(i.sliderContainerParent.width()-i.sliderContainer.width()));n=Math.abs(n),i.API.animateContainer(n,1e3,!0,!0)}else i.sliderContainer.css("margin-left",0)}}),i.scrollbar.bind("mousewheel DOMMouseScroll",function(e){var s,n,t,l=0,d=i.scrollbar;return t=e.originalEvent,s=d.slider("value"),t.wheelDelta&&(l=t.wheelDelta),t.detail&&(l=40*t.detail),s-=l/5,s>100&&(s=100),0>s&&(s=0),i.animInProgress||(n=d.slider("option","slide").call(d,e,{value:s}),n!==!1&&d.slider("value",s)),!1})},moveScroll:function(i){var e=this.opts();e.scrollbar.slider&&e.scrollbar.slider("value",i)},resetScroll:function(){var i=this.opts(),e=i.sliderContainerParent.width()-i.sliderContainer.width(),s="auto"===i.sliderContainer.css("margin-left")?0:parseInt(i.sliderContainer.css("margin-left")),n=Math.round(s/e*100);i.scrollbar.slider&&i.scrollbar.slider("value",n)}},e.fn.kolabSlider.TOUCHSWIPE={opts:function(){return this._container.data("kolabSlider.opts")},initTouchswipe:function(){var i=this.opts();i.sliderContainerParent.swipe({allowPageScroll:"vertical",swipe:function(e,s,n,t,l,d){i.API.moveSlider(s)},excludedElements:e.fn.swipe.defaults.excludedElements+", .scroll-bar-wrap"})}},e.fn.kolabSlider.animations={basic:{init:function(i,e){i.find(".slide-bg").css({"min-width":e.expandedWidth,left:"-"+e.expandedWidth/2+"px"})},show:function(i,e){i.find(".slide-bg").stop().animate({left:0},{duration:e.animSpeed})},hide:function(i,e){i.find(".slide-bg").stop().animate({left:"-"+e.expandedWidth/2},{duration:e.animSpeed})}}},e.fn.kolabSlider.defaults={sliderContainerClass:"slider-container",slideClass:"slide",animSpeed:1e3,slidesVisible:6,slideAnimation:"basic",scrollbar:!0,responsive:{1:{width:900,slidesVisible:5,fullSlideCover:!0},2:{width:768,slidesVisible:4},3:{width:600,slidesVisible:3},4:{width:400,slidesVisible:1}}}}(i)}).call(e,s(2))}]);