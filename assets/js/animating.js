var PageTransitions = (function($, options) {
    "use strict";

    // Cache DOM elements
    var sectionsContainer = $(".animated-sections"),
        isAnimating = false,
        windowArea = $(window),
        animEndEventNames = {
            'WebkitAnimation': 'webkitAnimationEnd',
            'OAnimation': 'oAnimationEnd',
            'msAnimation': 'MSAnimationEnd',
            'animation': 'animationend'
        },
        animEndEventName = animEndEventNames[Modernizr.prefixed('animation')],
        support = Modernizr.cssanimations;

    function init(options) {
        // Store original classes for each section
        $('.animated-section').each(function() {
            var $page = $(this);
            $page.data('originalClassList', $page.attr('class'));
        });

        // Set initial active section
        if (location.hash === "") {
            $('section[data-id=' + getActiveSection() + ']').addClass('section-active');
        }

        // Menu click event
        $('.nav-anim').on("click", function(e) {
            e.preventDefault();
            if (isAnimating) return false;
            var pageTrigger = $(this);
            setActiveMenuItem(pageTrigger);
            navigateToPage(pageTrigger);
            location.hash = pageTrigger.attr('href');
        });

        // Handle hash change
        window.onhashchange = function(event) {
            if (location.hash && !isAnimating) {
                var menuLink = $(options.menu + ' a[href*="' + location.hash.split('/')[0] + '"]');
                setActiveMenuItem(menuLink);
                navigateToPage(menuLink);
                loadAjaxContent();
            }
        };

        // Initial setup
        var menu = options.menu;
        var pageStart = getActiveSection();
        location.hash = pageStart;
        var menuLink = $(menu + ' a[href*="' + location.hash.split('/')[0] + '"]');
        setActiveMenuItem(menuLink);
        navigateToPage(menuLink);

        // Append ajax loading container
        $('body').append('<div id="page-ajax-loaded" class="page-ajax-loaded animated animated-section-moveFromLeft"></div>');
        loadAjaxContent();

        // Arrow navigation for menu
        $(".lmpixels-arrow-right").click(function() {
            navigateToNextMenuItem();
        });

        $(".lmpixels-arrow-left").click(function() {
            navigateToPreviousMenuItem();
        });
    }

    function getActiveSection() {
        if (location.hash === "") {
            return location.hash = $('section.animated-section').first().attr('data-id');
        }
        return location.hash;
    }

    function setActiveMenuItem(item) {
        if (!item) return false;
        $('ul.main-menu a').removeClass('active');
        $(item).addClass('active');
    }

    function loadAjaxContent() {
        var ajaxLoadedContent = $('#page-ajax-loaded');

        function showContent() {
            ajaxLoadedContent.removeClass('animated-section-moveToRight closed').show();
            $('body').addClass('ajax-page-visible');
        }

        function hideContent() {
            ajaxLoadedContent.addClass('animated-section-moveToRight closed');
            $('body').removeClass('ajax-page-visible');
            setTimeout(function() {
                ajaxLoadedContent.hide().html('');
            }, 500);
        }

        $('.ajax-page-load').each(function() {
            var href = $(this).attr('href');
            if (location.hash === location.hash.split('/')[0] + '/' + href.substr(0, href.length - 5)) {
                showContent();
                ajaxLoadedContent.load(href);
                return false;
            }
        });

        $(document).on("click", ".main-menu, #ajax-page-close-button", function(e) {
            e.preventDefault();
            hideContent();
            location.hash = location.hash.split('/')[0];
        }).on("click", ".ajax-page-load", function() {
            var hash = location.hash.split('/')[0] + '/' + $(this).attr('href').substr(0, $(this).attr('href').length - 5);
            location.hash = hash;
            showContent();
            return false;
        });
    }

    function navigateToPage($pageTrigger) {
        if (!$pageTrigger.attr('data-animation')) {
            var animNumber = Math.floor(Math.random() * 67) + 1;
            $pageTrigger.data('animation', animNumber);
        }

        var animation = $pageTrigger.data('animation').toString(),
            inClass, outClass, selectedAnimNumber;

        // Select animation
        if (animation.indexOf('-') !== -1) {
            var randomAnimList = animation.split('-');
            selectedAnimNumber = parseInt(randomAnimList[Math.floor(Math.random() * randomAnimList.length)]);
        } else {
            selectedAnimNumber = parseInt(animation);
        }

        // Ensure valid animation number
        if (selectedAnimNumber > 67) {
            alert("Invalid 'data-animation' attribute configuration. Animation number should not be greater than 67.");
            return false;
        }

        // Map selected animation number to CSS classes
        var animationClasses = getAnimationClasses(selectedAnimNumber);
        inClass = animationClasses.inClass;
        outClass = animationClasses.outClass;

        // Page transition logic
        var $pageWrapper = sectionsContainer,
            currentPageId = $pageWrapper.data('current'),
            $currentPage = $('section[data-id="' + currentPageId + '"]'),
            gotoPage = $pageTrigger.attr('href').split("#")[1];

        if (currentPageId !== gotoPage) {
            isAnimating = true;
            $pageWrapper.data('current', gotoPage);

            var $nextPage = $('section[data-id=' + gotoPage + ']').addClass('section-active');
            $nextPage.scrollTop(0);

            // Current page animation out
            $currentPage.addClass(outClass).on(animEndEventName, function() {
                $currentPage.off(animEndEventName);
                resetPage($nextPage, $currentPage);
            });

            // Next page animation in
            $nextPage.addClass(inClass).on(animEndEventName, function() {
                $nextPage.off(animEndEventName);
                resetPage($nextPage, $currentPage);
                isAnimating = false;
            });
        } else {
            isAnimating = false;
        }

        if (!support) {
            resetPage($currentPage, $nextPage);
        }
    }

    function getAnimationClasses(animNumber) {
        var animationClasses = {
            1: { inClass: 'animated-section-moveFromRight', outClass: 'animated-section-moveToLeft' },
            2: { inClass: 'animated-section-moveFromLeft', outClass: 'animated-section-moveToRight' },
            // Add more animation mappings here...
        };

        return animationClasses[animNumber] || { inClass: '', outClass: '' };
    }

    function resetPage($nextPage, $currentPage) {
        $currentPage.attr('class', $currentPage.data('originalClassList'));
        $nextPage.attr('class', $nextPage.data('originalClassList') + ' section-active');
    }

    // Helper functions for menu navigation
    function navigateToNextMenuItem() {
        var activeItem = $('.main-menu a.active').parent("li");
        activeItem.next("li").children("a").click();
        if (activeItem.is(':last-child')) {
            $('.main-menu li:first-child').children("a").click();
        }
    }

    function navigateToPreviousMenuItem() {
        var activeItem = $('.main-menu a.active').parent("li");
        activeItem.prev("li").children("a").click();
        if (activeItem.is(':first-child')) {
            $('.main-menu li:last-child').children("a").click();
        }
    }

    return {
        init: init
    };
})(jQuery);
