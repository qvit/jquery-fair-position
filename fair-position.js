(function($) {
	var defaults = {
        defaultOffset: 50
	};

	$.fn.position = function(params) {
		var options = $.extend({}, defaults, params),
            pageHeight = document.body.scrollHeight,
            defaultOffset = options.defaultOffset,
            lastScrollTop = 0;

        function stickToBottom(element) {
            $(element).css({
                position: 'fixed',
                top: 'auto',
                bottom: options.defaultOffset
            });
        }

        function stickToTop(element) {
            $(element).css({
                position: 'fixed',
                top: options.defaultOffset,
                bottom: 'auto'
            });
        }

        function unstick(element) {
            $(element).css({
                position: $(element).data('initialPositionValue')
            });
        }

        function windowScrollHandler(event) {
            var element = event.data.element,
                st = $(this).scrollTop(),
                bottomEdgeScrollTop = $(window).scrollTop() + window.innerHeight;

            // работаем только при недостатке места под форму на экране
            if (!$(element).data('centered') && $(element).is(':visible')) {
                var elementOffsetTop = $(element).offset().top;

                // крутим вниз
                if (st > lastScrollTop) {
                    var elementBottomEdgeOffsetTop = elementOffsetTop + $(element).height();

                    // много прокрутили вниз - форма фиксируется снизу
                    if (Math.round(elementBottomEdgeOffsetTop + defaultOffset) <= bottomEdgeScrollTop) {
                        stickToBottom(element);
                    }
                    else {
                        $(element).css({
                            top: elementOffsetTop
                        });
                        unstick(element);
                    }
                }

                // крутим вверх
                else {

                    // много прокрутили вверх - форма фиксируется сверху
                    if (Math.round($(window).scrollTop() + defaultOffset) <= elementOffsetTop) {
                        stickToTop(element);
                    }
                    else {
                        // отклеиваем форму от нижнего края
                        $(element).css({
                            top: elementOffsetTop
                        });
                        unstick(element);
                    }
                }
            }

            lastScrollTop = st;
        }

		function init(element) {
            var elementHeight = $(element).height(),
                offset;

            $(element).data({
                initialPositionValue: $(element).css('position')
            })

            // форме хватает места на экране - фиксируем по центру
            if (elementHeight < window.innerHeight) {
                offset = (window.innerHeight - elementHeight) / 2;

                $(element).data({
                    centered: true
                }).css({
                    position: 'fixed'
                });
            }

            // форма не умещается на экране - запоминаем положение верхнего края формы
            else {

                // нижний край формы помещается на страницу
                if (Math.round($(window).scrollTop() + options.defaultOffset + elementHeight) < pageHeight) {
                    offset = $(window).scrollTop() + options.defaultOffset;

                    $(element).data({
                        centered: false,
                        initialOffsetTop: offset
                    });
                }

                // мы где-то внизу страницы
                else {
                    offset = 'auto';

                    stickToBottom(element);
                }
            }

            $(element).css({
                top: offset
            });

		    $(window).scroll({
                element: element
            }, windowScrollHandler);
        }

		this.each(function() {
			init(this);
		});

		return this;
	};
})(jQuery);