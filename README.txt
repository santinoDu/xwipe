html部分结构
xwipe结构
<div id='xwipe' class='xwipe'>
    <div class='xwipe-wrap'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        ..
    </div>
</div>

tab结构
<ul id="tab" class="tab clearfix">
    <li>0</li>
    <li>1</li>
    <li>2</li>
    <li>3</li>
    ...
</ul>

css样式
.xwipe {
    overflow: hidden;
    visibility: hidden;
}
.xwipe-wrap {
    overflow: hidden;
}
.xwipe-wrap > div {
    float:left;
    position: relative;
}

js部分
1.引用xwipe.js
2.实例化例子
function xwipeCallback(index){

}
var myXwipe = document.getElementById("xwipe"),
    tab = document.getElementById("tab"),
    options = {
        callback : xwipeCallback,
        auto : 3000,
        curIndex : 0,
        speed : 300
    }

var xwipe = new Xwipe(myXwipe,options,tab);


其中options为Xwipe配置参数,可选，
    callback为产生滑动之后回调函数，
    设置auto参数,xwipe将变为自动滑动，单位为ms
    curIndex为初始开始给用户的slide索引值，默认为0
    speed为动画产生时间过程长度duration

tab为tab切换导航，可选
    结构为
        <ul>
            <li>tab1</li>
            <li>tab2</li>
            <li>tab3</li>
            ...
        </ul>

Xwipe API:
    prev() 滑动到上一个slide
    next() 滑动到下一个slide
    goTo(index) 滑动到指定index索引
    option.curIndex 获取当前索引

