(function($) {
  var secondsToMs = function (s) {
    var ms = 0;

    if (typeof s === 'string' && s.match('s')) {
      ms = s.substring(0, s.length - 1);
    }

    ms = parseFloat(ms, 10);
    ms = ms * 1000;
    return ms;
  };

  var getDuration = function ($el) {
    var durationS = $el.css('transition-duration'),
        duration = secondsToMs(durationS);

    return duration;
  };

  $.fn.transWait = function(fn, scope, extra) {
    var timeout;

    scope || (scope = this);
    extra || (extra = 0);
    timeout = getDuration(this);
    timeout += extra;

    setTimeout($.proxy(fn, scope), timeout);

    return this;
  };
}(jQuery));


(function($) {
  $.fn.redraw = function() {
    var el = this.get(0);
    el && el.offsetHeight;
    return this;
  };
}(jQuery));


$(function() {
  // Touch optimizations
  document.addEventListener('touchstart', function(){}, true);
  FastClick.attach(document.body);

  $('.toggle-menu').on('click', function() {
    $('.wrapper').toggleClass('compact');
    $('.conversation-item').removeClass('show-remove');
    var isCompact = $('.wrapper').hasClass('compact');

    if (isCompact) {
      $('.content-wrap').css({
        'transform': ''
      });
    } else {
      var offset = ($(window).width() * .9) - 66;
      $('.content-wrap').css({
        'transform': 'translate3d(-' + offset + 'px,0,0)'
      });
    }
  });

  $('.toggle-settings').on('click', function() {
    var isSettings = $('.wrapper').hasClass('settings'),
        offset;

    $('.wrapper').toggleClass('settings');

    if (isSettings) {
      var offset = ($(window).width() * .9) - 66;
      $('.content-wrap').css({
        'transform': 'translate3d(-' + offset + 'px,0,0)'
      });
    } else {
      var offset = ($(window).width() * 1.8) - 88;
      $('.content-wrap').css({
        'transform': 'translate3d(-' + offset + 'px,0,0)'
      });
    }
  });

  var $prevActive;
  $('.new-convo').on('click', function(e) {
    var $target = $(this);
    var isAdd = $('.wrapper').hasClass('add');
    var isCompact = $('.wrapper').hasClass('compact');

    $('.wrapper').toggleClass('add');

    if (!isCompact) {
      $('.toggle-menu').trigger('click');
    }
    if (isAdd) {
      $target.text('+');
      !$('.conversation-item.active').length && $prevActive.addClass('active');
    } else {
      $target.html('&times;');
      $prevActive = $('.conversation-item.active').removeClass('active');
    }
  });

  $('.conversation-item').on('click', function(e) {
    var $target = $(e.currentTarget);
    var index = $target.index();
    var $currentActive = $('.coversation-wrap.active')
    var currentActiveIndex = $currentActive.index();
    var isCompact = $('.wrapper').hasClass('compact');
    var isSettings = $('.wrapper').hasClass('settings');
    var isAdd = $('.wrapper').hasClass('add');
    var showingRemove = $target.hasClass('show-remove')

    if (showingRemove) {
      $target.removeClass('show-remove');
      return false;
    }
    if (isAdd) {
      $('.new-convo').trigger('click');
    }
    if (isSettings) {
      $('.toggle-settings').trigger('click');
      return;
    }
    $('.conversation-item.active').removeClass('active');
    $target.addClass('active');

    if ($target.hasClass('has-new')) {
      $target.removeClass('has-new');
      $target.find('.message-status').text('20 seconds ago');
    }

    if (!isCompact) {
      $('.toggle-menu').trigger('click');
    }

    if (index == currentActiveIndex) {
      return;
    }

    var $targetConv = $('.coversation-wrap:eq(' + index + ')');
    if (index > currentActiveIndex) {
      $targetConv.css({
        'transform': 'translate3d(0,100%,0)'
      })
      .redraw()
      .addClass('active animated')
      .redraw()
      $targetConv.css({
        'transform': 'translate3d(0,0,0)'
      }).transWait(function() {
        this.removeClass('animated');
      });

      $currentActive.addClass('animated').css({
        'transform': 'translate3d(0,-100%,0)'
      }).redraw().transWait(function() {
        this.removeClass('animated active');
      });
    } else {
      $targetConv.css({
        'transform': 'translate3d(0,-100%,0)'
      })
      .redraw()
      .addClass('active animated')
      .redraw()
      $targetConv.css({
        'transform': 'translate3d(0,0,0)'
      }).transWait(function() {
        this.removeClass('animated');
      });

      $currentActive.addClass('animated').css({
        'transform': 'translate3d(0,100%,0)'
      }).redraw().transWait(function() {
        this.removeClass('animated active');
      });
    }
  });

  $('.post').on('click', function(e) {
    var text = $('.textarea-wrap textarea').val();
    var $scroll = $('.coversation-wrap .coversation-scroll');

    if (text.length) {
      $scroll.append('<div class="message"><p>' + text + '</p></div>')
      $('.textarea-wrap textarea').val('').blur();
      $scroll.stop().animate({
        scrollTop: $scroll[0].scrollHeight
      }, 200);
    }
  });

  $('.content').on('click', function() {
    var isCompact = $('.wrapper').hasClass('compact');

    if (!isCompact) {
      $('.toggle-menu').trigger('click');
    }
  });

  $('.edit-convo').on('click', function() {
    var $target = $(this),
        isEditing = $('.conversations-wrap').hasClass('editing');

      if (isEditing) {
        $target.text('Edit');
        $('.item-remove').transWait(function() {
          this.removeClass('above animated');
        })
      } else {
        $target.text('Done');
        $('.item-remove').addClass('above animated');
      }
      $('.conversations-wrap').toggleClass('editing');
  });

  function showRemove(e) {
    e.gesture.preventDefault();
    $('.conversation-item.show-remove').removeClass('show-remove');
    $(this).addClass('show-remove');
  }
  $('.conversation-item').each(function() {
    var item = $(this).get(0);
    Hammer(item).on('swipeleft', showRemove);
  });

  var convWrap = $('.conversations-wrap').get(0);
  Hammer(convWrap).on('swipeleft', function(e) {
    e.gesture.preventDefault();
    var isCompact = $('.wrapper').hasClass('compact');
    var isSettings = $('.wrapper').hasClass('settings');

    if (isCompact) {
      $('.toggle-menu').trigger('click');
    }
  });

  Hammer(convWrap).on('swiperight', function(e) {
    e.gesture.preventDefault();
    var isCompact = $('.wrapper').hasClass('compact');
    var isSettings = $('.wrapper').hasClass('settings');

    if (isSettings) {
      $('.toggle-settings').trigger('click')
    } else if (!isCompact) {
      $('.toggle-menu').trigger('click');
    }
  });

  $('.textarea-wrap textarea').on('focus', function() {
    var $scroll = $('.coversation-wrap .coversation-scroll');

    $('.content').addClass('textarea-focus');
    $scroll.stop().animate({
      scrollTop: $scroll[0].scrollHeight
    }, 200);
  });
  $('.textarea-wrap textarea').on('blur', function() {
    var text = $('.textarea-wrap textarea').val();

    if (!text.length) {
      $('.content').removeClass('textarea-focus');
    }
  });

  setTimeout(function() {
    $('#with-new').addClass('bounce');
    setTimeout(function() {
      $('#with-new').removeClass('bounce');
    }, 1000);
  }, 1000);

  setTimeout(function() {
    $('#with-new').find('.new-count').text('5');
    $('#with-new').find('.message-status').text('5 new messages');
    $('#with-new').addClass('bounce');
  }, 3000);

  setInterval(function() {
    var index = Math.floor((Math.random()*$('.conversation-item').length)+1);
    var $target = $('.conversation-item:eq(' + index + ')');
    $target.find('.new-count').text('1');
    $target.find('.message-status').text('1 new messages');
    $target.addClass('has-new bounce');
    setTimeout(function() {
      $target.removeClass('bounce');
    }, 1000);
  }, 5000);
});
