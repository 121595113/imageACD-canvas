(function($) {
    var CanvasVideo = (function() {
        // 加载图片
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

        function CanvasVideo(obj, options) {
            if (obj[0].nodeName.toLowerCase() !== 'canvas') {
                this.dom = obj.append($('<canvas></canvas>'));
            } else {
                this.dom = obj;
            }
            this._setOptions(options);
            this._init();
        }
        CanvasVideo.prototype.options = {
            width: '100',
            height: '100',
            data: []
        }

        CanvasVideo.prototype._setOptions = function(options) {
            this.options = $.extend({}, this.options, options || null);
            return this;
        }

        CanvasVideo.prototype._init = function() {
            var that = this;
            preloadimages(this.options.data).done(function(images) {
                that.images = images;
                that._render();
            });
        }
        CanvasVideo.prototype._render = function() {
            var that = this;
            this.index = 0;
            this.canvas = this.dom[0];
            this.context = this.canvas.getContext("2d");

            var canvas_w = this.dom.parent().width();
            var canvas_h = canvas_w * this.images[0].height / this.images[0].width;

            this.canvas.width = canvas_w;
            this.canvas.height = canvas_h;

            this._drawImage(this.index);
        }

        CanvasVideo.prototype._drawImage = function(index) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.drawImage(this.images[index], 0, 0, this.canvas.width, this.canvas.height);
            // change_silder();
        }

        // 下一帧
        CanvasVideo.prototype.next = function() {
            this.index++;
            if (this.index > this.images.length - 1) {
                this.index = this.images.length - 1;
                return;
            }
            this._drawImage(this.index);
        }
        // 上一帧
        CanvasVideo.prototype.pre=function(){
            this.index--;
            if (this.index < 0) {
                this.index = 0;
                return;
            }
            this._drawImage(this.index);
        }
        return CanvasVideo;
    })();

    $.fn.CanvasVideo = function(opts) {
        return new CanvasVideo($(this), opts);
    }
})(Zepto);
