html部分结构
<div id='xwipe' class='xwipe'>
    <div class='xwipe-wrap'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        ..
    </div>
</div>

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

var xwipe = new Xwipe(options,myXwipe,tab);

其中options为可配置参数，
    callback为产生滑动之后回调函数，
    设置auto参数,xwipe将变为自动滑动，单位为ms
    curIndex为初始开始给用户的slide索引值，默认为0
    speed为动画产生时间过程长度duration
