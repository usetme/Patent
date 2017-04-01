function setCookie(name, value, exdays){
  if (!!window.localStorage) {
    window.localStorage.setItem(name, value);
  } else {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + "; " + expires;
  }
}

function getCookie(name){
  if (!!window.localStorage) {
    return window.localStorage.getItem(name);
  } else {
    if (document.cookie.length > 0) {
      var start = document.cookie.indexOf(name + "=")
      if (start != -1) {
        start = start + name.length + 1
        var end = document.cookie.indexOf(";", start)
        if (end == -1)
          end = document.cookie.length
        return unescape(document.cookie.substring(start, end))
      }
    }
  }
  return ""
}

function deleteCookie(name){
  if (!!window.localStorage) {
    localStorage.removeItem(name);
  } else {
    document.cookie = name + "=; expires=" + new Date().toGMTString();
  }
}

function getQueryStringRegExp(name){
  var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
  if (reg.test(location.href)) {
    return unescape(RegExp.$2.replace(/\+/g, " "));
  }
  return "";
}

$(function(){
  var access_token = getCookie("access_token");
  $("#username").text(getCookie("username"));
  if (!!access_token && access_token != "") {
    $("a[href*='.html']").each(function(){
      var href = $(this).attr("href");
      if (href.indexOf("?") > -1) {
        $(this).attr("href", href + "&access_token=" + access_token)
      } else {
        $(this).attr("href", href + "?access_token=" + access_token)
      }
    })
    // 获取未读信息条数
    $.post("../auth/message/notreadlist", {
      access_token : access_token
    }, function(data){
      $(".icon-6").closest("a").html('<i class="icon icon-6"></i>我的消息(' + data.data + ')');
    }, "JSON")
    // 退出登录
    $("#logout").click(function(){
      $.post("http://192.168.88.200:8081/ipr-auth/oauth/revoke-token", {
        access_token : access_token
      }, function(data){
        deleteCookie("access_token");
        location.href = "login.html"
      }, "JSON")
    })
  }
  
})
