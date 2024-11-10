(function ($) {
    "use strict";

    // Initialize Portfolio Grid with Shuffle functionality
    function portfolioInit() {
        var portfolioGrid = $(".portfolio-grid"),
            portfolioFilter = $(".portfolio-filters");

        if (portfolioGrid.length) {
            portfolioGrid.shuffle({ speed: 450, itemSelector: "figure" });

            portfolioFilter.on("click", ".filter", function (e) {
                e.preventDefault();
                portfolioGrid.shuffle("update");

                $(".portfolio-filters .filter").parent().removeClass("active");
                $(this).parent().addClass("active");

                portfolioGrid.shuffle("shuffle", $(this).attr("data-group"));
            });
        }
    }

    // Hide mobile menu when screen width is smaller than 1025px
    function mobileMenuHide() {
        var windowWidth = $(window).width(),
            siteHeader = $("#site_header");

        if (windowWidth < 1025) {
            siteHeader.addClass("mobile-menu-hide");
            $(".menu-toggle").removeClass("open");
            setTimeout(function () {
                siteHeader.addClass("animate");
            }, 500);
        } else {
            siteHeader.removeClass("animate");
        }
    }

    // Initialize custom scroll on appropriate elements
    function customScroll() {
        var windowWidth = $(window).width();
        if (windowWidth > 1024) {
            $(".animated-section, .single-page-content").each(function () {
                $(this).perfectScrollbar();
            });
        } else {
            $(".animated-section, .single-page-content").each(function () {
                $(this).perfectScrollbar("destroy");
            });
        }
    }

    // Contact form submission with Formspree integration
    function contactFormSubmission() {
        $("#contact_form").validator();
        $("#contact_form").on("submit", function (e) {
            if (!e.isDefaultPrevented()) {
                var $contactForm = $("#contact_form"),
                    $submit = $("#btn_submit"),
                    url = "https://formspree.io/f/xzborvqk";

                $.ajax({
                    url: url,
                    method: "POST",
                    data: $(this).serialize(),
                    dataType: "json",
                    beforeSend: function () {
                        $submit.attr("disabled", true).val("Sending message…");
                    },
                    success: function () {
                        $submit.val("Message sent!");
                        setTimeout(function () {
                            $(".alert--success").remove();
                            $contactForm[0].reset();
                            $submit.attr("disabled", false).val("Send message");
                        }, 3000);
                    },
                    error: function () {
                        $submit.val("Ops, there was an error.");
                        setTimeout(function () {
                            $submit.attr("disabled", false).val("Send message");
                        }, 5000);
                    }
                });
                return false;
            }
        });
    }

    // Initialize on page load
    $(function () {
        // Handle preloader and page transitions
        $(window).on("load", function () {
            $(".preloader").fadeOut(800, "linear");
            if ($(".animated-sections").length) {
                PageTransitions.init({ menu: "ul.main-menu" });
            }
        });

        // Handle window resize events
        $(window).on("resize", function () {
            mobileMenuHide();
            $(".animated-section").each(function () {
                $(this).perfectScrollbar("update");
            });
            customScroll();
        });

        // Handle mouse movement for background animation
        var movementStrength = 23,
            height = movementStrength / $(document).height(),
            width = movementStrength / $(document).width();

        $("body").on("mousemove", function (e) {
            var pageX = e.pageX - $(document).width() / 2,
                pageY = e.pageY - $(document).height() / 2,
                newvalueX = width * pageX * -1,
                newvalueY = height * pageY * -1,
                elements = $(".lm-animated-bg");

            elements.addClass("transition");
            elements.css({
                "background-position": "calc(50% + " + newvalueX + "px) calc(50% + " + newvalueY + "px)"
            });

            setTimeout(function () {
                elements.removeClass("transition");
            }, 300);
        });

        // Handle menu toggle
        $(".menu-toggle").on("click", function () {
            $("#site_header").addClass("animate");
            $("#site_header").toggleClass("mobile-menu-hide");
            $(".menu-toggle").toggleClass("open");
        });

        // Close mobile menu on menu item click
        $(".main-menu").on("click", "a", function () {
            mobileMenuHide();
        });

        // Handle sidebar toggle
        $(".sidebar-toggle").on("click", function () {
            $("#blog-sidebar").toggleClass("open");
        });

        // Initialize portfolio grid
        $(".portfolio-grid").imagesLoaded(function () {
            portfolioInit();
        });

        // Initialize masonry for blog container
        var $container = $(".blog-masonry");
        $container.imagesLoaded(function () {
            $container.masonry();
        });

        // Initialize custom scroll
        customScroll();

        // Initialize text rotation carousel
        $(".text-rotation").owlCarousel({
            loop: true,
            dots: false,
            nav: false,
            margin: 0,
            items: 1,
            autoplay: true,
            autoplayHoverPause: false,
            autoplayTimeout: 3800,
            animateOut: "animated-section-scaleDown",
            animateIn: "animated-section-scaleUp"
        });

        // Initialize testimonials carousel
        $(".testimonials.owl-carousel").imagesLoaded(function () {
            $(".testimonials.owl-carousel").owlCarousel({
                nav: true,
                items: 3,
                loop: false,
                navText: false,
                autoHeight: true,
                margin: 25,
                responsive: {
                    0: { items: 1 },
                    480: { items: 1 },
                    768: { items: 2 },
                    1200: { items: 2 }
                }
            });
        });

        // Initialize clients carousel
        $(".clients.owl-carousel").imagesLoaded().owlCarousel({
            nav: true,
            items: 2,
            loop: false,
            navText: false,
            margin: 10,
            autoHeight: true,
            responsive: {
                0: { items: 2 },
                768: { items: 4 },
                1200: { items: 5 }
            }
        });

        // Handle form control focus states
        $(".form-control")
            .val("")
            .on("focusin", function () {
                $(this).parent(".form-group").addClass("form-group-focus");
            })
            .on("focusout", function () {
                if ($(this).val().length === 0) {
                    $(this).parent(".form-group").removeClass("form-group-focus");
                }
            });

        // Initialize Magnific Popup for lightbox functionality
        $("body").magnificPopup({
            delegate: "a.lightbox",
            type: "image",
            removalDelay: 300,
            mainClass: "mfp-fade",
            image: {
                titleSrc: "title",
                gallery: {
                    enabled: true
                }
            },
            iframe: {
                markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe><div class="mfp-title mfp-bottom-iframe-title"></div></div>',
                patterns: {
                    youtube: { index: "youtube.com/", id: null, src: "%id%?autoplay=1" },
                    vimeo: { index: "vimeo.com/", id: "/", src: "//player.vimeo.com/video/%id%?autoplay=1" },
                    gmaps: { index: "//maps.google.", src: "%id%&output=embed" }
                },
                srcAction: "iframe_src"
            },
            callbacks: {
                markupParse: function (template, values, item) {
                    values.title = item.el.attr("title");
                }
            }
        });

        // Handle contact form submission
        contactFormSubmission();
    });

})(jQuery);
