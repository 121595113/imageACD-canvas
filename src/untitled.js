(function($) {
    var imgs = [
        './images/img-lg.jpg',
        './images/lv2.png',
        './images/lv3.png',
        './images/lv4.png',
        './images/lv5.png',
        './images/lv6.png',
        './images/lv7.png'
    ];
    var p = $('#a'),
        txt = $('#b');

    function preloadimages(obj) {
        var loaded = 0;
        var toload = 0;
        var images = obj instanceof Array ? [] : {};

        for (var i in obj) {
            toload++;
            images[i] = new Image();
            images[i].src = obj[i];
            images[i].onload = load;
            images[i].onerror = load;
            images[i].onabort = load;
        }

        function load() {
            if (++loaded >= toload) postaction(images);
        }
        return {
            done: function(f) {
                postaction = f || postaction
            }
        }
    }
    preloadimages(imgs).done(function(images) {
        render(images);
    });

    function render(images) {
        var _timer;
        var _index = 0;

        var canvas = $("#canvas")[0]
        var context = canvas.getContext("2d")

        var canvas_w = $(window).width();
        var canvas_h = canvas_w * images[0].height / images[0].width;
        canvas.width = canvas_w;
        canvas.height = canvas_h;

        function _drawImage(index) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(images[index], 0, 0, canvas.width, canvas.height);
            change_silder();
        }
        _drawImage(_index);

        // 下一帧
        function _next() {
            _index++;
            if (_index > images.length - 1) {
                _index = images.length - 1;
                return;
            }
            _drawImage(_index);
        }
        // 上一帧
        function _pre() {
            _index--;
            if (_index < 0) {
                _index = 0;
                return;
            }
            _drawImage(_index);
        }

        function _play() {
            clearTimeout(_timer);
            _timer = setTimeout(function() {
                _drawImage(_index);
                _index++;
                if (_index > images.length - 1) {
                    _stop();
                    _index = images.length - 1;
                } else {
                    _play();
                }
            }, 1000);
        }

        function _stop() {
            clearTimeout(_timer);
        }

        function change_silder() {
            var Rate = _index / (images.length - 1);
            txt.val(txt.attr('max') * Rate);
        }
        $('.next').click(function() {
            _next();
        });
        $('.pre').click(function() {
            _pre();
        });
        $('.play').click(function() {
            if (_index==images.length - 1) {
                _index=0;
            }
            _play();
        });
        $('.stop').click(function() {
            _stop();
            _drawImage(_index);
        });



        txt.on('touchstart', function() {
            $(this).on('touchmove', function() {
                p.html($(this).val());
                var _rate = $(this).val() / $(this).attr('max');
                _index = parseInt((images.length - 1) * _rate);
                _drawImage(_index);
            });
        });


    }
})(Zepto);
