/*global $, document, TweenMax, Quint, Sine, Quad, Power3, AV, window*/

$(document).ready(function () {

  var $messagesContainer = $('.chat__messages')
    , $messagesList = $('.chat__messages--list')
    , $box = $('.chat__box');


  var config = window.CONFIG;


  var PUSH = AV.push({
    appId: config.APP_ID,
    appKey: config.APP_KEY
  });


  PUSH.subscribe([config.CHANNEL], () => console.log('订阅成功'));
  PUSH.open(() => {
    console.log('打开成功');
  });


  PUSH.on('message', (data) => {
    sendMessage(data);
  });




  function gooOn() {
    setFilter('url(#goo)');
  }

  function gooOff() {
    setFilter('none');
  }


  function setFilter(value) {
    $box.css({
      webkitFilter: value,
      mozFilter: value,
      filter: value
    });
  }

  function template(html, options) {
    var re = /<\?(.+?)\?>/g,
      reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g,
      code = 'with(obj) { var r=[];\n',
      cursor = 0,
      result;
    var add = function (line, js) {
      js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
        (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
      return add;
    }
    while (match = re.exec(html)) {
      add(html.slice(cursor, match.index))(match[1], true);
      cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor));
    code = (code + 'return r.join(""); }').replace(/[\r\t\n]/g, '');
    try {
      result = new Function('obj', code).apply(options, [options]);
    }
    catch (err) {
      console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n");
    }
    return result;
  }





  function addMessage(data) {


    var message_str = template($('#template-message').html(), data);
    var $messageContainer = $(message_str).appendTo($messagesList);
    var $messageBubble = $messageContainer.find('.chat__message--bubble');



    var oldScroll = $messagesContainer.scrollTop();
    $messagesContainer.scrollTop(99999999);
    var newScroll = $messagesContainer.scrollTop();

    if(newScroll > 0) {
      //如果刚开始什么的，就没有必要吧
      var scrollDiff = newScroll - oldScroll;

      TweenMax.fromTo(
        $messagesList, 0.4, {
          y: scrollDiff
        }, {
          y: 0,
          ease: Quint.easeOut
        }
      );

    }



    return {
      $container: $messageContainer,
      $bubble: $messageBubble
    };
  }

  function sendMessage(data) {
    var messageElements = addMessage(data)
      , $messageBubble = messageElements.$bubble;


    var effectStyle = {
      left: 20,
      top: 10
    };


    if (data.user.self) {
      effectStyle = {
        right: 20,
        top: 10
      };
    }

    var $messageEffect = $('<div/>')
      .addClass('chat__message--effect ' + (data.user.self?'chat__message--self':'chat__message--friend'))
      .append($messageBubble.clone())
      .appendTo($box)
      .css(effectStyle);


    var messagePos = $messageBubble.offset();
    var effectPos = $messageEffect.offset();
    var pos = {
      x: messagePos.left - effectPos.left,
      y: messagePos.top - effectPos.top
    };



    gooOn();

    TweenMax.from(
      $messageBubble, 0.8, {
        y: -pos.y,
        ease: Sine.easeInOut,
        force3D: true
      }
    );

    var startingScroll = $messagesContainer.scrollTop();
    var curScrollDiff = 0;
    var effectYTransition;
    var setEffectYTransition = function (dest, dur, ease) {
      return TweenMax.to(
        $messageEffect, dur, {
          y: dest,
          ease: ease,
          force3D: true,
          onUpdate: function () {
            var curScroll = $messagesContainer.scrollTop();
            var scrollDiff = curScroll - startingScroll;
            if (scrollDiff > 0) {
              curScrollDiff += scrollDiff;
              startingScroll = curScroll;

              var time = effectYTransition.time();
              effectYTransition.kill();
              effectYTransition = setEffectYTransition(pos.y - curScrollDiff, 0.8 - time, Sine.easeOut);
            }
          }
        }
      );
    }

    effectYTransition = setEffectYTransition(pos.y, 0.8, Sine.easeInOut);

    // effectYTransition.updateTo({y:800});

    TweenMax.from(
      $messageBubble, 0.6, {
        delay: 0.2,
        x: -pos.x,
        ease: Quad.easeIn,
        force3D: true
      }
    );


    TweenMax.to(
      $messageEffect, 0.6, {
        delay: 0.2,
        x: pos.x,
        ease: Quad.easeInOut,
        force3D: true
      }
    );

    TweenMax.from(
      $messageBubble, 0.2, {
        delay: 0.65,
        opacity: 0,
        ease: Quad.easeInOut,
        onComplete: function () {
          TweenMax.killTweensOf($messageEffect);
          $messageEffect.remove();
          gooOff();
        }
      }
    );
  }


});