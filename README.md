# Kolabslider timeline slider

Demo available in here http://kolabdigital.github.io/kolabslider

Photos used in demo are taken from https://unsplash.com

# Requirements
## Basic requirements
"jquery": ">=1.10.2"
"jquery-ui": ">=1.11.4"

Fore example include
```html
<script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
<script src="http://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
```

## If you want mobile/tablets support those plugins are also required
"jquery-ui-touch-punch-improved" : "~0.3.1"
https://github.com/Bantam/jquery-ui-touch-punch-improved

"jquery-touchswipe": ">=1.6.9"
https://github.com/mattbryson/TouchSwipe-Jquery-Plugin

# Basic Usage
Example html structure, note that at least 3 slides are required.

```html
<div id="slider">
  <div class="slider-container">

    <!-- Single slide -->
    <div class="slide not-expanded image">
        <div class="placeholder">
            <div class="vcenter">
                <div class="placholder-inner">
                    <h4 class="slider-title">1985</h4>
                </div>
            </div>
        </div>
        <div class="details">
            <div class="table" style="background-color: #939e19">
                <div class="vcenter">
                    <div class="slide-image">
                      <h4 class="slider-title">1985</h4>
                    </div>
                    <h2 class="title">Vivamus in erat ut</h2>
                    <div class="field-name-body">
                      <p>Donec id justo. Ut a nisl id ante tempus hendrerit. Praesent ac massa at ligula laoreet iaculis. Vivamus aliquet elit ac nisl. Praesent egestas tristique nibh.</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="overlay" style="background-color: #939e19"></div>
        <img class="slide-bg" typeof="foaf:Image" src="images/photos/photo2.jpg" alt="" />
    </div>
    <!-- Single slide end -->

  </div>
</div>
```

#### Include kolab-slider plugin
```html
<script type="text/javascript" src="src/javascripts/kolab-slider.js"></script>
```

#### Include promo animation effect used in demo
```html
<script type="text/javascript" src="src/javascripts/kolabslider-promo.js"></script>
```

#### If you want to use video slides you also need to include this script
```html
<script type="text/javascript" src="src/javascripts/kolabslider-video.js"></script>
```

#### Example markup for video slides
```html
<!-- Single slide -->
  <div class="slide not-expanded video" data-animation="video">
      <div class="placeholder">
          <div class="vcenter">
              <div class="placholder-inner">
                  <a href="#" title="" class="play-button icon-play"></a>
              </div>
          </div>
      </div>
      <div class="details">
        <div class="close"></div>
        <div class="embedded-video youtube-video" data-video-url="0NKUpo_xKyQ"> <!-- Video id in here -->
            <div class="player"></div>
        </div>
      </div>
      <div class="overlay" style="background-color: #939e19"></div>
      <img class="slide-bg" typeof="foaf:Image" src="images/photos/photo5.jpg" alt="" />
  </div>
<!-- Single slide end -->
```


#### Include main styles
```html
<link rel="stylesheet" href="examples/stylesheets/main.css">
```

#### And then initialize slider with promo effect
```javascript
$(document).ready(function()
{
  $('#slider').kolabSlider({
    slideAnimation : "promo"
  });
});
```

#### Here are some initial parameters that you can change

```javascript
sliderContainerClass: 'slider-container', // Slide container class
slideClass: 'slide', // Slides class
animSpeed: 1000, // Transition time between slides
slidesVisible: 6, // Initial number of visible slides
slideAnimation: 'basic', // Change default animation type
scrollbar: true // Srcollbar, requires jquery-ui
```

### How to change animation inside slide
You can add simply add additional elements inside slide and easly animate them using you own custom animation plugin

```javascript
$.fn.kolabSlider.animations.custom_animation_name = {
    init: function(slide, opts) { // Things that happens only once when slider is initialized
        // In order to find elements inside slide use for example
        slide.find('.slide-bg').css({
          'min-width': opts.expandedWidth,
          'left': 0
        });
    },
    show: function(slide, opts) { // Runs everytime slide is opend

    },
    hide: function(slide, opts) { // Runs everytime slide is closed

    }
};
```

Save plugin in separate file and inlcude it
```
<script type="text/javascript" src="src/javascripts/kolabslider-custom_animation_name.js"></script>
```

and then initialize with new default animation
```javascript
$(document).ready(function()
{
  $('#slider').kolabSlider({
    slideAnimation : "custom_animation_name"
  });
});
```

If you want to use custom animation in one slide add data attribute with animation name to slide DIV. Each slide can have different animation type.

```html
<!-- Single slide -->
<div class="slide not-expanded" data-animation="custom_animation_name">

</div>
<!-- Single slide end -->
```
