/// <reference path="../jquery-2.1.3.js" />
/// <reference path="../hubs/chatHub.js" />


(function ($) {
    // shorten references to variables. this is better for uglification
    var kendo = window.kendo,
        ui = kendo.ui,
        Widget = ui.Widget, getChatTemplate = function () {

            var temp = [
                '<div class="chatboxhead chatboxblink">',
                     '<div class="chatboxtitle"></div>',
                     '<div class="chatboxoptions">',
                        '<a href="#" class="minimize">-</a>',
                        '<a href="#" class="close">x</a>',
                     '</div>',
                     '<br clear="all">',
                 '</div>',
                 '<div class="chatboxcontent" style="display: block;">',
                    '<div class="msgcontent"></div>',
                  '</div>',
                   '<div class="chatboxinput" style="display: block;">',
                     '<textarea class="chatboxtextarea"></textarea>',
                  '</div>'
            ];
            return temp.join("");
        },
        rearrangeChat = function () {
            var findAllChatBoxs = $(".chatbox");
            var oldRght = 30;
            $.each(findAllChatBoxs, function () {
                $(this).css("right", oldRght + 'px');
                oldRght + 352 + 10;
            });
           
        },
        $chatHub = snap.hub.ChatHub();
    

    var ChatWidget = Widget.extend({
        
        init: function (element, options) {
            Widget.fn.init.call(this, element, options);
            var el = $(element);
            el.addClass("chatbox");
            el.css("bottom", "0px");
            var findAllChatBoxs = $(".chatbox");
            var length = findAllChatBoxs.length;
            var right = ((length - 1) * 352) + 10;
            if (right == 10) {
                right = 30;
            }
            el.css("right", right +'px' );
            el.css("display", "block");
            el.html(getChatTemplate());
            el.find(".chatboxoptions").on('click', 'a', function () {
                if ($(this).hasClass("close")) {
                    el.remove();
                    rearrangeChat();
                } else {
                    //mini
                    if (el.find('.chatboxcontent').css('display') == 'none') {
                        el.find('.chatboxcontent').css('display', 'block');
                        el.find('.chatboxinput').css('display', 'block');
                        el.find(".chatboxcontent").scrollTop(el.find(".chatboxcontent")[0].scrollHeight);
                    } else {

                        el.find('.chatboxcontent').css('display', 'none');
                        el.find('.chatboxinput').css('display', 'none');
                    }

                }
            });
            var data = options.data;
            el.find(".chatboxtitle").html(data.Name);
            var tmpp = kendo.template($("#chatMsgCont").html());
            el.find(".chatboxtextarea").keyup(function (ee) {
                if (ee.keyCode == 13) {
                    var _chatArea = this;
                    if ($chatHub) {
                        $chatHub.sendMessageToUser(data.UserId, $(this).val()).then(function (data) {
                            $(_chatArea).val("");
                            var me = data.sender;
                            el.find(".msgcontent").append(tmpp({
                                name: me.FirstName,
                                msg: data.msg
                            }));
                            el.find(".chatboxcontent").scrollTop(el.find(".chatboxcontent")[0].scrollHeight);
                        });
                    }
                }
            });
            var msg = options.msg;
            if (msg) {
                
                el.find(".msgcontent").append(tmpp({
                    name: msg.from.FirstName,
                    msg: msg.msg
                }));
                el.find(".chatboxcontent").scrollTop(el.find(".chatboxcontent")[0].scrollHeight);
            }
           
          
        },
        options: {

            name: "ChatWidget",
            template: ""

        }
    });
    ui.plugin(ChatWidget);
})(jQuery);