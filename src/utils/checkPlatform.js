
export default () => {
  const system = {}
  const p = navigator.platform
  system.win = p.indexOf("Win") === 0;
  system.mac = p.indexOf("Mac") === 0;

  if (!system.win && !system.mac) {
    document.head.innerHTML = '<title>抱歉，出错了</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0"><link rel="stylesheet" type="text/css" href="https://res.wx.qq.com/open/libs/weui/0.4.1/weui.css">';
    document.body.innerHTML = '<div class="weui_msg"><div class="weui_icon_area"><i class="weui_icon_info weui_icon_msg"></i></div><div class="weui_text_area"><h4 class="weui_msg_title">后台管理仅支持PC端</h4></div></div>';
  }
}
