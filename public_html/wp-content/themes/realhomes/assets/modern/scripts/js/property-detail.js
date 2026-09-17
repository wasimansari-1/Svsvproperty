/**
 * The js file for single property related scripts.
 *
 * @since 3.20.0
 *
 * @param {jQuery} $ The jQuery object.
 */
(function ($) {
    "use strict";
    const $body = $('body');

    if ($body.hasClass('property-content-layout-horizontal-tabs') || $body.hasClass('property-content-layout-vertical-tabs')) {
        /**
         * Single property content horizontal and vertical Tabs layout script.
         */
        const propertyContentWrapper = $('#property-content-wrapper'),
            propertyContentTabs = propertyContentWrapper.find('#property-content-tabs'),
            propertyContentTabsItems = propertyContentTabs.find('li'),
            currentClass = 'current',
            propertyContentTabsContent = propertyContentWrapper.find('.property-content-section');

        propertyContentTabsItems.first().addClass(currentClass);
        propertyContentTabsContent.first().addClass('current-content-section');

        setTimeout(function () {
            if (!propertyContentTabsContent.first().hasClass('js-content-section')) {
                propertyContentTabsContent.addClass('js-content-section');
            }
        }, 2000);

        // Tabs click event
        propertyContentTabs.on('click', 'li', function (event) {
            const item = $(this);
            if (!item.hasClass(currentClass)) {
                propertyContentTabsItems.removeClass(currentClass);
                item.addClass(currentClass);
                propertyContentTabsContent.hide().removeClass('current-content-section');
                propertyContentWrapper.find('#property-content-section-' + item.data('id')).addClass('current-content-section').fadeIn(250);
            }
        });

    } else if ($body.hasClass('property-content-layout-accordion') || $body.hasClass('property-content-layout-toggle')) {
        /**
         * Single property content accordion and toggle layout script.
         */
        const propertyContent = $('#property-content'),
            headings = propertyContent.find("> div:not(.property-overview) > .rh_property__heading"),
            contents = propertyContent.find("> div:not(.property-overview) > div"),
            currentClass = 'current',
            isAccordion = $body.hasClass('property-content-layout-accordion');

        // Remove current class from headings.
        headings.removeClass(currentClass);

        // Adds loading class to show loader.
        propertyContent.addClass('loading')

        setTimeout(function () {
            if (!contents.first().hasClass('js-content-section')) {
                contents.addClass('js-content-section');
                propertyContent.removeClass('loading')
            }
        }, 2000);

        headings.on('click', function (event) {
            const heading = $(this);

            if (isAccordion) {
                // Accordion logic
                if (!heading.hasClass(currentClass)) {
                    headings.removeClass(currentClass);
                    contents.stop(false, true).slideUp(300);
                    heading.addClass(currentClass);
                    heading.siblings('div').addClass(currentClass).stop(false, true).slideDown(300);
                }
            } else {
                // Toggle logic
                if (heading.hasClass(currentClass)) {
                    heading.removeClass(currentClass);
                    heading.siblings('div').removeClass(currentClass).stop(false, true).slideUp(300);
                } else {
                    heading.addClass(currentClass);
                    heading.siblings('div').addClass(currentClass).stop(false, true).slideDown(300);
                }
            }

            event.stopPropagation();
            event.preventDefault();
        });
    }

})(jQuery);