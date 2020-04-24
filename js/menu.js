const $ = require('jquery');
const { remote } = require('electron');

var win = remote.getCurrentWindow();
var flag = false;

$("#mini").click(function(){
  win.minimize();
});

$("#full").click(function(){
  if(!flag){
    flag = true;
    $("#setas").attr('src',"images/compress.svg");
  }else{
    flag = false;
    $("#setas").attr('src',"images/expand.svg");
  }
  win.setFullScreen(flag);

});

$(".home").click(function(){
  window.location.replace("index.html");
});

$("#maxi").click(function(){
  if(!win.isMaximized()){
    win.maximize();
  }else{
    win.unmaximize();
  }



});
