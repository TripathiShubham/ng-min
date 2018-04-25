(function ($) {
    'use strict';

    // :: 5.0 CounterUp Active JS
    if ($.fn.counterUp) {
        $('.counter').counterUp({
            delay: 10,
            time: 2000
        });
    }

    // :: 6.0 PreventDefault a Click
    $("a[href='#']").on('click', function ($) {
        $.preventDefault();
    });

    // :: 7.0 Search Form Active Code
    $(".searchBtn").on('click', function () {
        $(".search-hidden-form").toggleClass("search-form-open");
    });

    // :: 10.0 matchHeight Active JS
    if ($.fn.matchHeight) {
        $('.item').matchHeight();
    }

    var $window = $(window);

    // :: 11.0 Preloader active code
    $window.on('load', function () {
        $('#preloader').fadeOut('slow', function () {
            $(this).remove();
        });
    });

})(jQuery);