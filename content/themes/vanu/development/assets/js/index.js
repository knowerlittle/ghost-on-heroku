/*====================================================
  TABLE OF CONTENT
  1. function declearetion
  2. Initialization
====================================================*/
(function ($) {
    /*===========================
    1. function declearetion
    ===========================*/
    var themeApp = {

        featuredSlider: function () {
            if ($('.featured-slider').length) {
                var slider = new Siema({
                    selector: '.featured-slider',
                    duration: 500,
                    easing: 'ease-in-out',
                    loop: true,
                    onInit: function () {
                        var s = $('.featured-slider');
                        var h = s.height();
                        s.find('.post-wrap').height(h);
                        s.addClass('visible');
                    }
                });
                $('.prev').on('click', function () { slider.prev(); });
                $('.next').on('click', function () { slider.next(); });
                var timer = null;
                function autoPlay() {
                    timer = setInterval(function () { slider.next() }, 3000);
                }
                autoPlay();
                $('.featured-slider-wrap').hover(function () {
                    clearInterval(timer);
                }, function () { autoPlay() });
            }
        },
        responsiveIframe: function () {
            $('.single-article').fitVids();
        },
        highlighter: function () {
            $('pre code').each(function (i, block) {
                hljs.highlightBlock(block);
            });
        },
        mobileMenu: function () {
            // $('#mobile-menu > ul').html($('.main-menu').html());
            $('#menu-open').on('click', function (e) {
                e.preventDefault();
                $('body').toggleClass('mobile-menu-opened');
            });
            $('#backdrop').on('click', function () {
                $('body').toggleClass('mobile-menu-opened');
            });
        },
        SearchProcess: function () {
            var list = [];
            $('.search-open').on('click', function (e) {
                e.preventDefault();
                if (list.length == 0 && typeof searchApi !== undefined) {
                    $.get(searchApi)
                        .done(function (data) {
                            list = data.posts;
                            search();
                        })
                        .fail(function (err) {
                        });
                }
                $('.search-popup').addClass('visible');
                $('#search-input').css('visibility', 'visible').focus();
            });
            $('.close-button').on('click', function (e) {
                e.preventDefault();
                $('.search-popup').removeClass('visible');
                $('#search-input').val("");
                $("#search-results").empty();
            });
            function search() {
                if (list.length > 0) {
                    var options = {
                        shouldSort: true,
                        tokenize: true,
                        matchAllTokens: true,
                        threshold: 0,
                        location: 0,
                        distance: 100,
                        maxPatternLength: 32,
                        minMatchCharLength: 1,
                        keys: [{
                            name: 'title'
                        }, {
                            name: 'plaintext'
                        }]
                    }
                    fuse = new Fuse(list, options);
                    $('#search-input').on("keyup", function () {
                        keyWord = this.value;
                        var result = fuse.search(keyWord);
                        var output = '';
                        var language = $('html').attr('lang');
                        $.each(result, function (key, val) {
                            var pubDate = new Date(val.published_at).toLocaleDateString(language, {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })
                            output += '<div id="' + val.id + '" class="result-item">';
                            output += '<a href="' + val.url + '"><div class="title">' + val.title + '</div>';
                            output += '<div class="date">' + pubDate + '</div></a>';
                            output += '</div>';
                        });
                        $("#search-results").html(output);
                    });
                }
            }
        },
        backToTop: function () {
            $(window).scroll(function () {
                if ($(this).scrollTop() > 100) {
                    $('#back-to-top').fadeIn();
                } else {
                    $('#back-to-top').fadeOut();
                }
            });
            $('#back-to-top').on('click', function (e) {
                e.preventDefault();
                $('html, body').animate({ scrollTop: 0 }, 1000);
                return false;
            });
        },
        gallery: function () {
            var images = document.querySelectorAll('.kg-gallery-image img');
            images.forEach(function (image) {
                var container = image.closest('.kg-gallery-image');
                var width = image.attributes.width.value;
                var height = image.attributes.height.value;
                var ratio = width / height;
                container.style.flex = ratio + ' 1 0%';
            });
            mediumZoom('.kg-gallery-image img', {
                margin: 30
            });
        },
        loadMore: function () {
            var nextPageUrl = $('link[rel=next]').attr('href');
            var loadMoreButton = $('.btn-load-more');
            loadMoreButton.on('click', function (e) {
                e.preventDefault();
                var url = nextPageUrl.split(/page/)[0] + 'page/' + nextPage + '/';
                $.ajax({
                    url: url,
                    beforeSend: function () {
                        loadMoreButton.addClass('loading');
                    }
                }).done(function (data) {
                    var posts = $(data).find('.post-wrap');
                    loadMoreButton.removeClass('loading');
                    $('.post-list-wrap').append(posts);
                    $(window).scroll();
                    nextPage++;
                    if (nextPage > totalPages) {
                        loadMoreButton.addClass('disabled');
                        loadMoreButton.attr('disabled', true);
                    }
                });
            });
        },
        sortAuthorTags: function () {
            $('#sortby').on('change', function () {
                var val = this.value;
                var sortedDivs = null;
                var divs = $('.card-wrap');
                sortedDivs = divs.sort(function (a, b) {
                    switch(val) {
                        case 'post-asc':
                            return ($(a).data('count') > $(b).data('count')) ? 1 :  -1;
                        case 'post-desc':
                            return ($(a).data('count') > $(b).data('count')) ? -1 :  1;
                        case 'alpha-asc':
                            return ($(a).data('name').toLowerCase() > $(b).data('name').toLowerCase()) ? 1 :  -1;
                        case 'alpha-desc':
                            return ($(a).data('name').toLowerCase() > $(b).data('name').toLowerCase()) ? -1 :  1;
                        default:
                            break;
                    }
                });
                $('#sortable-wrap').append(sortedDivs);
                $(window).scroll();
            });
        },
        animateOnScroll: function() {
            var viewBox = $(window);
            function checkInView() {
                var wHeight = viewBox.height();
                var wTop = viewBox.scrollTop();
                var wBottom = wTop + wHeight;
                $('.animate').each(function(){
                    var el = $(this);
                    var elHeight = el.height();
                    var elTop = el.offset().top;
                    var elBottom = elTop + elHeight;
                    if ((elTop <= wBottom - 100 && elTop >= wTop) || (elBottom >= wTop && elBottom <= wBottom) || (elTop <= wBottom - 100 && elBottom >= wBottom))  {
                        el.addClass('visible ' + el.data('animation'));
                    }
                });
            }
            viewBox.on('scroll resize reload', checkInView);
            viewBox.scroll();
        },
        menuScroll: function() {
            function setNavSize() {
                var h = $('.site-header').height() - $('.logo-wrap').height() + $('.header-bottom').height();
                $('.site-nav').height(h - 282);
            }
            setNavSize();
            $(window).on('resize', setNavSize);
            var el = $('.site-nav')[0];
            SimpleScrollbar.initEl(el);
        },
        init: function () {
            themeApp.featuredSlider();
            themeApp.responsiveIframe();
            themeApp.highlighter();
            themeApp.mobileMenu();
            themeApp.SearchProcess();
            themeApp.backToTop();
            themeApp.gallery();
            themeApp.loadMore();
            themeApp.sortAuthorTags();
            themeApp.animateOnScroll();
            themeApp.menuScroll();
        }
    }
    /*===========================
    2. Initialization
    ===========================*/
    $(document).ready(function () {
        themeApp.init();
    });

    

}(jQuery));


// var $animation_elements = $('.animation-element');
// var $window = $(window);

// function check_if_in_view() {
//   var window_height = $window.height();
//   var window_top_position = $window.scrollTop();
//   var window_bottom_position = (window_top_position + window_height);
 
//   $.each($animation_elements, function() {
//     var $element = $(this);
//     var element_height = $element.outerHeight();
//     var element_top_position = $element.offset().top;
//     var element_bottom_position = (element_top_position + element_height);
 
//     //check to see if this current container is within viewport
//     if ((element_bottom_position >= window_top_position) &&
//         (element_top_position <= window_bottom_position)) {
//       $element.addClass('in-view');
//     } else {
//       $element.removeClass('in-view');
//     }
//   });
// }

// $window.on('scroll resize', check_if_in_view);
// $window.trigger('scroll');