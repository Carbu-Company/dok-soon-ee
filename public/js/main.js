$(document).ready(function () {
  // sidebar 탭 메뉴 활성화 유무 이벤트
  $(".jsTabBtn").on("click", function () {
    $(this).toggleClass("on");
  });

  // 시작일과 종료일 DatePicker
  var dateFormat = "yy-mm-dd",
    from = $(".jsStartDate")
      .datepicker({
        dateFormat: dateFormat,
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        onSelect: function(dateText) {
          $(this).val(dateText).trigger('change');
          // 매입일 필드인 경우 React state 업데이트
          if ($(this).attr('name') === 'carPurDt' && window.updateCarPurDt) {
            window.updateCarPurDt(dateText);
          }
        }
      })
      .on("change", function () {
        to.datepicker("option", "minDate", getDate(this));
      }),
    to = $(".jsEndDate")
      .datepicker({
        dateFormat: dateFormat,
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        onSelect: function(dateText) {
          $(this).val(dateText).trigger('change');
        }
      })
      .on("change", function () {
        from.datepicker("option", "maxDate", getDate(this));
      });

  function getDate(element) {
    var date;
    try {
      date = $.datepicker.parseDate(dateFormat, element.value);
    } catch (error) {
      date = null;
    }
    return date;
  }

  // form input 버튼 이벤트
  $(".jsDeleteBtn").on("click", function () {
    debugger;
  });
});

// custom selectbox에 대한 이벤트
(function ($) {
  function openSelect($wrap) {
    if ($wrap.hasClass("select--open")) return;
    $wrap.addClass("select--open");
    ensureVisible($wrap, $wrap.find(".select__option--selected"));
  }

  function closeSelect($wrap) {
    if (!$wrap.hasClass("select--open")) return;
    $wrap.removeClass("select--open");
    $wrap.find(".select__toggle").focus();
  }

  function ensureVisible($wrap, $item) {
    const $menu = $wrap.find(".select__menu");
    if (!$item.length) return;
    const top = $item.position().top;
    const bottom = top + $item.outerHeight();
    if (top < 0) $menu.scrollTop($menu.scrollTop() + top);
    if (bottom > $menu.innerHeight()) {
      $menu.scrollTop($menu.scrollTop() + (bottom - $menu.innerHeight()));
    }
  }

  function updateSelected($wrap, $item) {
    $wrap.find(".select__option").removeClass("select__option--selected");
    $item.addClass("select__option--selected");
    $wrap.find(".select__text").text($item.text());
    $wrap.find(".select__input").val($item.data("value")).trigger("change");
  }

  // 버튼 클릭 → 열기/닫기
  $(document).on("click", ".select__toggle", function () {
    const $wrap = $(this).closest(".select");
    $wrap.toggleClass("select--open");
    if ($wrap.hasClass("select--open")) {
      ensureVisible($wrap, $wrap.find(".select__option--selected"));
    }
  });

  // 옵션 hover 상태
  $(document)
    .on("mouseenter", ".select__option", function () {
      $(this).addClass("select__option--hover");
    })
    .on("mouseleave", ".select__option", function () {
      $(this).removeClass("select__option--hover");
    });

  // 옵션 클릭 → 선택
  $(document).on("click", ".select__option", function () {
    const $wrap = $(this).closest(".select");
    updateSelected($wrap, $(this));
    closeSelect($wrap);
  });

  // 바깥 클릭 시 닫기
  $(document).on("mousedown", function (e) {
    $(".select.select--open").each(function () {
      const $wrap = $(this);
      if (!$wrap.is(e.target) && $wrap.has(e.target).length === 0) {
        closeSelect($wrap);
      }
    });
  });
})(jQuery);


$(function () {
  // 입력 시 상태 변경
  $(document).on('input', '.input__field', function () {
    const $wrap = $(this).closest('.input');
    if ($(this).val().length > 0) {
      $wrap.addClass('input--typing');
      // $wrap.find('.jsInputTypeToggle').show();
    } else {
      $wrap.removeClass('input--typing');
    }
  });

  // clear 버튼 클릭 시 입력값 초기화
  $(document).on('mousedown', '.jsInputClear', function () {
    const $wrap = $(this).closest('.input');
    $wrap.find('.input__field').val('').focus();
    $wrap.removeClass('input--typing');
  });

  // 비밀번호 토글 버튼
  $(document).on('mousedown', '.jsInputTypeToggle', function () {
    const $field = $(this).closest('.input').find('.input__field');
    if ($field.attr('type') === 'password') {
      $field.attr('type', 'text');
      $(this).addClass('on');
    } else {
      $field.attr('type', 'password');
      $(this).removeClass('on');
    }
  });
});


// 검색바 기능
$(function () {
  // 입력 시 clear 버튼 표시
  $(document).on('input', '.header-search__field', function () {
    const $wrap = $(this).closest('.header-search');

    if ($(this).val().length > 0) {
      $wrap.addClass('header-search--typing');
    } else {
      $wrap.removeClass('header-search--typing');
    }
  });

  // clear 버튼
  $(document).on('click', '.header-search__clear', function () {
    const $wrap = $(this).closest('.header-search');
    $wrap.find('.header-search__field').val('').focus();
  });

  // toggle 버튼
  $(document).on('click', '.header-search__toggle', function () {
    const $wrap = $(this).closest('.header-search');
    $wrap.toggleClass('header-search--open');
  });

  // 옵션 클릭 시 선택 처리
  $(document).on('click', '.header-search__option .form-option', function () {
    //const $wrap = $(this).closest('.header-search');//2025-08-28 오전 9:24:26
    $wrap.find('.header-search__option').removeClass('header-search__option--selected');
    $(this).addClass('header-search__option--selected');

    const text = $(this).text().trim();
    $wrap.find('.header-search__field').val(text);
    $wrap.removeClass('header-search--open');
  });

  // 외부 클릭 시 닫기
  $(document).on('mousedown', function (e) {
    $('.header-search.header-search--open').each(function () {
      const $wrap = $(this);
      if (!$wrap.is(e.target) && $wrap.has(e.target).length === 0) {
        $wrap.removeClass('header-search--open');
      }
    });
  });
});

// 툴팁 기능
$(function () {
  $('.jsTooltipBtn').on('click', function() {
    $(this).toggleClass('on')
  });

    // 외부 클릭 시 닫기
  $(document).on('mousedown', function (e) {
    $('.jsTooltipBtn').each(function () {
      const $wrap = $(this);
      if (!$wrap.is(e.target) && $wrap.has(e.target).length === 0) {
        $wrap.removeClass('on');
      }
    });
  });
});

// 상세 검색창
$(function () {
  // toggle 버튼
  $(document).on('click', '.jsSearchboxBtn', function () {
    const $wrap = $('.jsSearchbox');
    $wrap.toggleClass('on');
  });
});