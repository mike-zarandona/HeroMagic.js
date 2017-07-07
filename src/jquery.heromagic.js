/*!
**********************************************************
* HeroMagic.js
* https://github.com/mike-zarandona/HeroMagic.js
*
* Version:       1.0.2
* Author:        Mike Zarandona | @mikezarandona
* Release:       Jul 07 2017
*                Complex transition positioning fix
**********************************************************
*/

;(function ($, document, window, undefined) {
    $.fn.heroMagic = function(options) {
        "use strict";

        // store the calling element
        var elem = $(this),
            transitioningElementCounter = 0
        ;


        // Override defaults with specified options
        options = $.extend({}, $.fn.heroMagic.options, options);


        // Main setup functionality
        this.initialize = function() {
            // Warn about in + out values comprising the entire height of the screen
            if ( options.scrollOutDistance + options.scrollInDistance >= $(window).outerHeight() ) {
                console.warn('HeroMagic.js: The options for `scrollOutDistance` and `scrollInDistance` are the same or a greater total height than the current viewport.');
            }

            // Optionally add styles to the DOM
            if ( options.addStyles ) {
                // If the styles don't already exist...
                if ( $('#heromagic-styles').length === 0 ) {
                    // get ready to construct some CSS
                    var styles = '';

                    // - appear styles
                    styles += '[data-appear],.hm-fade-in,.hm-fade-out{opacity:0;will-change:opacity;}';

                    // - move styles
                    styles += '[data-move],.hm-scroll-in,.hm-scroll-out{will-change:transform;}';

                    // - appear + move styles
                    styles += '[data-appear][data-move],.hm-fade-in.hm-scroll-out,.hm-fade-out.hm-scroll-in{will-change:opacity,transform;}';

                    // ...append them to the <head/>
                    $('head').append('<style id="heromagic-styles" type="text/css">' + styles + '</style>');
                }
            }

            // Optionally add scrollpoint indicators for debugging
            if ( options.debugScrollPoints ) {
                var debugStyles = '';

                debugStyles += 'body{position:relative;}';

                debugStyles += 'body::before{content:"";display:block;position:fixed;z-index:99999;top:' + options.scrollOutDistance + 'px;left:0;width:100%;border-bottom:1px dashed red;}';
                debugStyles += 'body::after{content:"";display:block;position:fixed;z-index:99999;bottom:' + options.scrollInDistance + 'px;left:0;width:100%;border-top:1px dashed red;}';

                $('head').append('<style id="heromagic-styles-debug" type="text/css">' + debugStyles + '</style>');
            }

            // Construct the settings, options, and math for `appear`s and `move`s
            $('[data-appear], [data-move]').each(function() {
                var $this = $(this),
                    transitionRule = ''
                ;

                // APPEAR
                if ( $this.data('appear') !== undefined ) {
                    transitionRule = '';

                    // consume the settings applied on the element
                    var appearValues = $this.attr('data-appear').split(','),
                        thisAppearDuration = appearValues[0].trim() || options.defaults.appearDuration,
                        thisAppearEasing = appearValues[1].trim() || options.defaults.appearEasing,
                        thisAppearDelay = appearValues[2].trim() || options.defaults.appearDelay
                    ;

                    // save the data values on the element for touches later out of scope
                    $this.data('thisAppearDuration', thisAppearDuration)
                         .data('thisAppearEasing', thisAppearEasing)
                         .data('thisAppearDelay', thisAppearDelay)
                    ;

                    // set the transition in preparation for the move
                    // - if transition already has a rule, persist it
                    if ( $this.css('transition') !== undefined ) {
                        transitionRule += $this.css('transition') + ', ';
                    }

                    transitionRule += 'opacity ' + thisAppearDuration + ' ' + thisAppearEasing + ' ' + thisAppearDelay;

                    $this.css('transition', transitionRule);
                }

                // MOVE
                if ( $this.data('move') !== undefined ) {
                    transitionRule = '';

                    var moveValues = $this.attr('data-move').split(','),
                        thisMoveX = moveValues[0].trim() || options.defaults.moveX,
                        thisMoveY = moveValues[1].trim() || options.defaults.moveY,
                        thisMoveDuration = moveValues[2].trim() || options.defaults.moveDuration,
                        thisMoveEasing = moveValues[3].trim() || options.defaults.moveEasing,
                        thisMoveDelay = moveValues[4].trim() || options.defaults.moveDelay
                    ;

                    // save the data values to the element for potential processing later
                    $this.data('thisMoveX', thisMoveX)
                         .data('thisMoveY', thisMoveY)
                         .data('thisMoveDuration', thisMoveDuration)
                         .data('thisMoveEasing', thisMoveEasing)
                         .data('thisMoveDelay', thisMoveDelay)
                    ;

                    // set position to `relative` ONLY if not already set or set to absolute
                    if ( $this.css('position') !== 'relative' && $this.css('position') !== 'absolute' && $this.css('position') !== 'fixed' ) {
                        $this.css('position', 'relative');
                    }

                    // set up some preliminary offsets based on movements so elements finish animating into the correct position
                    if ( thisMoveY !== 0 ) {
                        $this.css('bottom', thisMoveY);
                    }
                    if ( thisMoveX !== 0 ) {
                        $this.css('right', thisMoveX);
                    }

                    // set the transition in preparation for the move
                    // - if transition already has a rule, persist it
                    if ( $this.css('transition') !== undefined ) {
                        transitionRule += $this.css('transition') + ', ';
                    }

                    transitionRule += 'transform ' + thisMoveDuration + ' ' + thisMoveEasing + ' ' + thisMoveDelay;

                    $this.css('transition', transitionRule);
                }

                // Counting transitioning elements
                if ( $this.data('transitioning') !== undefined && $this.data('transitioning') !== 0 ) {
                    transitioningElementCounter++;
                }
            });

            // if starting immediately, do it now
            if ( options.autoStart ) {
                this.animate();
            }


            return this;
        };


        // Handles animating the `.appear` and `.move` elements
        this.animate = function() {
            $('[data-appear], [data-move]').each(function() {
                var $this = $(this);

                if ( $this.data('appear') !== undefined ) {
                    // start the appear after the delay
                    setTimeout(function() {
                        $this.css('opacity', '1');

                        // remove the transition after the initial effect
                        $this.one('transitionend.appear', function(e) {
                            $this.css('transition', 'none');
                        });
                    }, $this.data('thisAppearDelay'));
                }

                if ( $this.data('move') !== undefined ) {
                    // start the move after the delay
                    setTimeout(function() {
                        $this.css('transform', 'translate3d(' + $this.data('thisMoveX') + ', ' + $this.data('thisMoveY') + ', 0');

                        // remove the transition + resolve vertical positioning after the initial effect
                        $this.one('transitionend.move', function(e) {
                            $this.css('transition', 'none');

                            var thisTop = $this.css('top'),
                                thisBottom = $this.css('bottom')
                            ;

                            // both in use (or not in use) - use `top`
                            if ( (thisTop !== 'auto' && thisBottom !== 'auto') || (thisTop === 'auto' && thisBottom === 'auto') ) {
                                $this.css('top', parseInt(thisTop) + parseInt($this.data('thisMoveY')) + 'px');
                            }
                            // `top` in use
                            else if ( thisTop !== 'auto' && thisBottom === 'auto' ) {
                                $this.css('top', parseInt($this.css('top')) + parseInt($this.data('thisMoveY')) + 'px');
                            }
                            // `bottom` in use
                            else if ( thisBottom !== 'auto' && thisTop === 'auto' ) {
                                $this.css('bottom', parseInt($this.css('bottom')) + parseInt($this.data('thisMoveY')) + 'px');
                            }

                            // reset the 3d translate
                            $this.css('transform', 'translate3d(' + $this.data('thisMoveX') + ', 0, 0)');
                        });
                    }, $this.data('thisMoveDelay'));
                }
            });

            // engage the scrolls once these are done
            this.scrolls();


            return this;
        };


        // Handles the onscroll functionality for the `fade` + `scroll` classes
        this.scrolls = function() {
            var $scrollingElements = $('.hm-scroll-out, .hm-scroll-in, .hm-fade-out, .hm-fade-in');

            if ( $scrollingElements.length !== 0 ) {
                $(window).on('scroll', function() {
                    var scrollPosition = $(window).scrollTop();

                    $scrollingElements.each(function() {
                        var $this = $(this),
                            thisDistanceFromTop = $this.offset().top - scrollPosition,
                            thisDistanceFromBottom = $(window).outerHeight() - thisDistanceFromTop,
                            percentageToOut = 0,
                            percentageToIn = 0,
                            currentXOffset,
                            currentYOffset,
                            currentTransform
                        ;

                        // .hm-fade-out
                        if ( $this.hasClass('hm-fade-out') && thisDistanceFromTop <= options.scrollOutDistance ) {
                            percentageToOut = thisDistanceFromTop / options.scrollOutDistance;

                            $this.css('opacity', percentageToOut);
                        }
                        else if ( $this.hasClass('hm-fade-out') && thisDistanceFromTop > options.scrollOutDistance && thisDistanceFromBottom > options.scrollInDistance ) {
                            $this.css('opacity', 1);
                        }

                        // .hm-fade-in
                        if ( $this.hasClass('hm-fade-in') && thisDistanceFromBottom >= 0 && thisDistanceFromBottom <= options.scrollInDistance ) {
                            percentageToIn = thisDistanceFromBottom / options.scrollInDistance;

                            $this.css('opacity', percentageToIn);
                        }
                        else if ( $this.hasClass('hm-fade-in') && thisDistanceFromBottom > options.scrollInDistance && thisDistanceFromTop > options.scrollOutDistance ) {
                            $this.css('opacity', 1);
                        }

                        // .hm-scroll-out
                        if ( $this.hasClass('hm-scroll-out') && thisDistanceFromTop <= (options.scrollOutDistance * 2) ) {
                            if ( $this.css('transform') !== 'none' ) {
                                currentTransform = $this.css('transform').split(',');
                                currentXOffset = currentTransform[4];
                                currentYOffset = currentTransform[5].split(')')[0];
                            }
                            else {
                                currentXOffset = 0;
                                currentYOffset = 0;
                            }

                            percentageToOut = thisDistanceFromTop / options.scrollOutDistance;

                            if ( percentageToOut > -1 && percentageToOut <= 2 ) {
                                if ( percentageToOut < 1 ) {
                                    $this.css('transform', 'translate3d(' + currentXOffset + 'px, ' + (-1 * (options.scrollOutDistance - thisDistanceFromTop) * options.scrollCompressor) + 'px, 0)');
                                }
                                else {
                                    $this.css('transform', 'translate3d(' + currentXOffset + 'px, 0, 0)');
                                }
                            }
                        }

                        // .hm-scroll-in
                        if ( $this.hasClass('hm-scroll-in') && thisDistanceFromBottom <= (options.scrollInDistance * 2) ) {
                            if ( $this.css('transform') !== 'none' ) {
                                currentTransform = $this.css('transform').split(',');
                                currentXOffset = currentTransform[4];
                                currentYOffset = currentTransform[5].split(')')[0];
                            }
                            else {
                                currentXOffset = 0;
                                currentYOffset = 0;
                            }

                            percentageToIn = thisDistanceFromBottom / options.scrollInDistance;

                            if ( percentageToIn > -1 && percentageToIn <= 2 ) {
                                if ( percentageToIn < 1 ) {
                                    $this.css('transform', 'translate3d(' + currentXOffset + 'px, ' + ((options.scrollInDistance - thisDistanceFromBottom) * options.scrollCompressor) + 'px, 0)');
                                }
                                else {
                                    $this.css('transform', 'translate3d(' + currentXOffset + 'px, 0, 0)');
                                }
                            }
                        }
                    });
                });
            }


            return this;
        };


        // Eject if none of the magic classes are found
        if ( $('[data-appear], [data-move], .hm-fade-in, .hm-fade-out, .hm-scroll-in, .hm-scroll-out').length === 0 ) {
            console.warn('HeroMagic.js: No magic parameters nor classes found.');

            return false;
        }


        return this.initialize();
    };


    // Default the defaults
    $.fn.heroMagic.options = {
        addStyles: true,
        defaults: {
            appearDuration: '300ms',
            appearEasing: 'ease-in-out',
            appearDelay: 0,
            moveX: 0,
            moveY: '-20px',
            moveDuration: '300ms',
            moveEasing: 'ease-in-out',
            moveDelay: 0,
        },
        autoStart: true,
        positionOverrides: true,
        scrollOutDistance: 80,
        scrollInDistance: 80,
        scrollCompressor: 0.2,
        debugScrollPoints: false,
    };
})(jQuery, document, window, undefined);
