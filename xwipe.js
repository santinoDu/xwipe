/**
 * Created by dujia on 2015/5/6.
 * Email : dujia_email@163.com
 */

function Xwipe(options, el, tab){
    this.el = el;
    this.element = el.children[0];
    if(this.element.children.length == 2){
        this.realLength = 2;
        this.element.appendChild(this.element.children[0].cloneNode(true));
        this.element.appendChild(this.element.children[1].cloneNode(true));
    }
    this.slides = this.element.children;
    this.sLength = this.slides.length;
    this.options = {
        curIndex : options.curIndex || 0,
        speed : options.speed || 300,
        auto : options.auto || 0,
        callback : options.callback || null
    };
    this.autoTimer = 0;
    this.startStatus = {};
    this.endStatus = {};
    this.delta = {};//位移差
    this.slidePos = [];//存储每个slide的transform水平位移值
    this.canSkip = true;
    this.isScrollY;
    this.tab = tab || null;
    if(this.tab){
        this.tabModule();
    }
    this.init();
    this.initEvents();
}
Xwipe.prototype = {
    version : '1.0.2',
    handleEvent : function(e){
        switch (e.type){
            case 'touchstart':
                this.touchStart(e);
                break;
            case 'touchmove':
                this.touchMove(e);
                break;
            case 'touchend':
                this.touchEnd(e);
                break;
            case 'resize':
                this.init();
                break;
            case 'click':
                this.getTabIndex(e);
                break;
        }
    },
    init : function(){
        this.width = this.el.getBoundingClientRect().width || this.el.offsetWidth;
        this.element.style.width = (this.sLength * this.width) + "px";
        var index = this.sLength;
        while( index-- ){
            var slide = this.slides[index];
            slide.style.width = this.width + 'px';
            slide.style.left = ( index * -this.width ) + 'px';
            //slide.setAttribute('data-index', index);
            this.medium(index, this.width, 0);
        }
        if(this.sLength != 1) this.medium(this.circle(this.options.curIndex - 1), -this.width, 0);
        this.medium(this.options.curIndex, 0, 0);
        if(this.sLength != 1) this.medium(this.circle(this.options.curIndex + 1), this.width, 0);
        this.el.style.visibility = 'visible';
        this.clearTimer();
        this.setTimer();
    },
    medium : function (index,dist,speed) {
        this.slidePos[index] = dist;
        this.translate(index, dist, speed);
    },
    translate : function (index, dist, speed) {
        var slide = this.slides[index];
        //slide.style.transitionDuration = this.options.speed + 'ms';
        slide.style.webkitTransitionDuration = speed + 'ms';
        //slide.style.transform = 'translate3d(' + dist + 'px, 0, 0)';
        slide.style.webkitTransform = 'translate3d(' + dist + 'px, 0, 0)';
    },
    circle : function (index) {
        //return this.sLength==1 ? 0 :( this.sLength==2 ? ( index % 2==0 ? 0 :1) : (this.sLength + (index % this.sLength)) % this.sLength);
        return (this.sLength + (index % this.sLength)) % this.sLength;
    },
    initEvents : function(){
        this.el.addEventListener("touchstart", this, false);
        this.el.addEventListener("touchmove", this, false);
        this.el.addEventListener("touchend", this, false);
        window.addEventListener("resize", this, false)
    },
    touchStart : function(e){
        var touches = e.touches[0];
        this.startStatus = {
            x: touches.pageX,
            y: touches.pageY,
            time: new Date().getTime()
        };
        this.isScrollY = undefined;
        this.clearTimer();
    },
    touchMove : function(e){
        if ( e.touches.length > 1 || e.scale && e.scale !== 1) return;//禁止多个手指滑动
        var touches = e.touches[0];
        this.endStatus = {
            x: touches.pageX,
            y: touches.pageY,
            time: new Date().getTime()
        };
        this.delta.x = this.endStatus.x - this.startStatus.x;
        this.delta.y = this.endStatus.y - this.startStatus.y;
        this.delta.time = this.endStatus.time - this.startStatus.time;
        if ( typeof this.isScrollY == 'undefined') {
            this.isScrollY = !!( this.isScrollY || Math.abs(this.delta.x) < Math.abs(this.delta.y));
        }
        if (!this.isScrollY) {
            e.preventDefault();
            if(this.sLength != 1) this.translate(this.circle(this.options.curIndex - 1), this.delta.x + this.slidePos[this.circle(this.options.curIndex - 1)], 0);
            this.translate(this.options.curIndex, this.delta.x + this.slidePos[this.circle(this.options.curIndex)], 0);
            if(this.sLength != 1) this.translate(this.circle(this.options.curIndex + 1), this.delta.x + this.slidePos[this.circle(this.options.curIndex + 1)], 0);
        }
    },
    touchEnd : function (e) {
        if(!this.isScrollY){
            var isValidSlide = false;
            if( Math.abs(this.delta.x) > this.width/2 || this.delta.time < 250 && Math.abs(this.delta.x) > 20){
                isValidSlide = true;
                if( this.delta.x > 0 ){
                    this.medium(this.circle(this.options.curIndex + 1), this.width, this.options.speed);
                    this.options.curIndex = this.circle(this.options.curIndex - 1);
                }else{
                    this.medium(this.circle(this.options.curIndex - 1), -this.width, this.options.speed);
                    this.options.curIndex = this.circle(this.options.curIndex + 1);
                }
                this.slideCallback(this.options.curIndex);
            }
            if(this.sLength != 1) this.medium(this.circle(this.options.curIndex - 1), -this.width, (isValidSlide && (this.delta.x > 0)) ? 0 : this.options.speed);
            this.medium(this.options.curIndex, 0, this.options.speed);
            if(this.sLength != 1) this.medium(this.circle(this.options.curIndex + 1), this.width, (isValidSlide && (this.delta.x < 0)) ? 0 : this.options.speed);
            this.setTimer();
        }
    },
    getDirection : function (to) {
        return (to - this.options.curIndex)*(Math.abs(to - this.options.curIndex) > this.sLength/2 ? -1 : 1) > 0 ? 1 : -1; //1向右滑动，-1向左滑动
    },
    goTo : function (to) {
        if(this.options.curIndex == to || !this.canSkip) return;
        this.canSkip = false;
        this.clearTimer();
        to = this.circle(to);
        var direction = this.getDirection(to);
        this.translate(to, direction * this.width, 0);
        var _this = this;

        setTimeout(function(){
            _this.medium(_this.options.curIndex, -direction * _this.width, _this.options.speed);
            _this.medium(to, 0, _this.options.speed);
            _this.options.curIndex = to;
        },0)
        setTimeout(function () {
            _this.medium(_this.circle(to - 1), -_this.width, 0);
            _this.medium(_this.circle(to + 1), _this.width, 0);
            _this.canSkip = true;
        },_this.options.speed);
        this.slideCallback(to);
        this.setTimer();
    },
    prev : function(){
        this.goTo(this.options.curIndex - 1);
    },
    next : function(){
        this.goTo(this.options.curIndex + 1);
    },
    setTimer : function(){
        if(this.options.auto){
            var _this = this;
            _this.autoTimer = setInterval(function () {
                _this.next();
            },this.options.auto);
        }
    },
    clearTimer : function(){
        if(this.options.auto){
            clearInterval(this.autoTimer);
        }
    },
    tabModule : function () {
        this.navs = this.tab.children;
        this.tab.addEventListener("click", this, false);
        this.tabHandle(this.options.curIndex);
    },
    getTabIndex : function (e) {
        var index = [].indexOf.call(this.navs, e.target);
        index = this.twoSlideFix(index);
        if( index >= 0 ) this.goTo(index);
    },
    tabHandle : function (index) {
        for( var i = 0, len = this.navs.length; i< len; i++){
            this.navs[i].classList.remove("on");
        }
        this.navs[index].classList.add("on");
    },
    slideCallback : function (index) {
        index = this.twoSlideFix(index);
        if(this.options.callback) this.options.callback(index);
        if(this.tab) this.tabHandle(index);
    },
    twoSlideFix : function (index) {
        if(this.realLength ==2){
            return index % 2;
        }else{
            return index;
        }
    }
}

