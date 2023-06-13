var REQUIRED_MESSAGE = "This field is required!";
$.fn.serializeObject = function () {
    var self = this,
        json = {},
        push_counters = {},
        patterns = {
            "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
            "key": /[a-zA-Z0-9_]+|(?=\[\])/g,
            "push": /^$/,
            "fixed": /^\d+$/,
            "named": /^[a-zA-Z0-9_]+$/
        };
    this.build = function (base, key, value) {
        base[key] = value;
        return base;
    };
    this.push_counter = function (key) {
        if (push_counters[key] === undefined) {
            push_counters[key] = 0;
        }
        return push_counters[key]++;
    };
    $.each($(this).serializeArray(), function () {
        if (!patterns.validate.test(this.name)) {
            return;
        }
        var k,
            keys = this.name.match(patterns.key),
            merge = this.value,
            reverse_key = this.name;
        while ((k = keys.pop()) !== undefined) {
            reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');
            if (k.match(patterns.push)) {
                merge = self.build([], self.push_counter(reverse_key), merge);
            } else if (k.match(patterns.fixed)) {
                merge = self.build([], k, merge);
            } else if (k.match(patterns.named)) {
                merge = self.build({}, k, merge);
            }
        }
        json = $.extend(true, json, merge);
    });
    return json;
};
$.fn.DataTable.ext.pager.numbers_length = 5;
$.extend($.fn.DataTable.defaults, {
    responsive: true,
    searching: false,
    autoWidth: false,
    processing: true,
    //RowReorder	: true,
    //colReorder	: true,
    serverSide: true,
    deferRender: true,
    pagingType: "full_numbers_no_ellipses",
    preDrawCallback: function (settings) {
        //$(this).closest("table").find("tbody").css("cursor","progress").css("opacity",0);
        $(this).removeClass("loaded").addClass("processing");
    },
    drawCallback: function (settings) {
        $(this).removeClass("processing").addClass("loaded");
        docBlur();
        $("html, body").animate({scrollTop: 0}, 200);
    },
    language: {
        loadingRecords: 'Loading ... <div class="m-loader m-loader--lg m-loader--primary"></div>',
        processing: 'Processing ... <div class="m-loader m-loader--lg m-loader--primary"></div>',
        paginate: {
            first: '<i class="fa fa-angle-double-left"></i>',
            previous: '<i class="fa fa-angle-left"></i>',
            next: '<i class="fa fa-angle-right"></i>',
            last: '<i class="fa fa-angle-double-right"></i>'
        }
    },
});
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var shortcut = {
    all_shortcuts: {},
    add: function (a, b, c) {
        var d = {
            type: "keydown", propagate: !1, disable_in_input: !1, target: document, keycode: !1
        };
        if (c) for (var e in d) "undefined" == typeof c[e] && (c[e] = d[e]);
        else c = d;
        d = c.target, "string" == typeof c.target && (d = document.getElementById(c.target)), a = a.toLowerCase(), e = function (d) {
            d = d || window.event;
            if (c.disable_in_input) {
                var e;
                d.target ? e = d.target : d.srcElement && (e = d.srcElement), 3 == e.nodeType && (e = e.parentNode);
                if ("INPUT" == e.tagName || "TEXTAREA" == e.tagName) return
            }
            d.keyCode ? code = d.keyCode : d.which && (code = d.which), e = String.fromCharCode(code).toLowerCase(), 188 == code && (e = ","), 190 == code && (e = ".");
            var f = a.split("+"), g = 0, h = {
                    "`": "~",
                    1: "!",
                    2: "@",
                    3: "#",
                    4: "$",
                    5: "%",
                    6: "^",
                    7: "&",
                    8: "*",
                    9: "(",
                    0: ")",
                    "-": "_",
                    "=": "+",
                    ";": ":",
                    "'": '"',
                    ",": "<",
                    ".": ">",
                    "/": "?",
                    "\\": "|"
                },
                i = {
                    esc: 27,
                    escape: 27,
                    tab: 9,
                    space: 32,
                    "return": 13,
                    enter: 13,
                    backspace: 8,
                    scrolllock: 145,
                    scroll_lock: 145,
                    scroll: 145,
                    capslock: 20,
                    caps_lock: 20,
                    caps: 20,
                    numlock: 144,
                    num_lock: 144,
                    num: 144,
                    pause: 19,
                    "break": 19,
                    insert: 45,
                    home: 36,
                    "delete": 46,
                    end: 35,
                    pageup: 33,
                    page_up: 33,
                    pu: 33,
                    pagedown: 34,
                    page_down: 34,
                    pd: 34,
                    left: 37,
                    up: 38,
                    right: 39,
                    down: 40,
                    f1: 112,
                    f2: 113,
                    f3: 114,
                    f4: 115,
                    f5: 116,
                    f6: 117,
                    f7: 118,
                    f8: 119,
                    f9: 120,
                    f10: 121,
                    f11: 122,
                    f12: 123
                },
                j = !1, l = !1, m = !1, n = !1, o = !1, p = !1, q = !1, r = !1;
            d.ctrlKey && (n = !0), d.shiftKey && (l = !0), d.altKey && (p = !0), d.metaKey && (r = !0);
            for (var s = 0; k = f[s], s < f.length; s++) "ctrl" == k || "control" == k ? (g++, m = !0) : "shift" == k ? (g++, j = !0) : "alt" == k ? (g++, o = !0) : "meta" == k ? (g++, q = !0) : 1 < k.length ? i[k] == code && g++ : c.keycode ? c.keycode == code && g++ : e == k ? g++ : h[e] && d.shiftKey && (e = h[e], e == k && g++);
            if (g == f.length && n == m && l == j && p == o && r == q && (b(d), !c.propagate)) return d.cancelBubble = !0, d.returnValue = !1, d.stopPropagation && (d.stopPropagation(), d.preventDefault()), !1
        },
            this.all_shortcuts[a] = {
                callback: e, target: d, event: c.type
            },
            d.addEventListener ? d.addEventListener(c.type, e, !1) : d.attachEvent ? d.attachEvent("on" + c.type, e) : d["on" + c.type] = e
    },
    remove: function (a) {
        var a = a.toLowerCase(), b = this.all_shortcuts[a];
        delete this.all_shortcuts[a];
        if (b) {
            var a = b.event, c = b.target, b = b.callback;
            c.detachEvent ? c.detachEvent("on" + a, b) : c.removeEventListener ? c.removeEventListener(a, b, !1) : c["on" + a] = !1
        }
    }
};

var lastScrollTop = 0;
window.onscroll = function () {
    var st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop) {
        $(".scroll-to-top").removeClass("hidden");
    } else {
        $(".scroll-to-top").addClass("hidden");
    }
    lastScrollTop = st <= 0 ? 0 : st;
};

jQuery.validator.setDefaults({
    ignore: ".ignore, .optional, .select2-search__field, :hidden, .note-editor *, [contenteditable='true']:not([name])",
    errorPlacement: function (error, element) {
        if (element.hasClass('select2') && element.next('.select2-container').length) {
            error.insertAfter(element.next('.select2-container'));
        } else {
            // error.insertAfter(element.prev());
            error.appendTo(element.parent());
        }
    }
});

var titleActive = document.title;
var titleInActive = "Leaving so Soon?";
var titleIntervalTimer = null;
window.addEventListener("blur", function () {
    titleIntervalTimer = setInterval(function () {
        document.title = titleInActive;
    }, 2000);
});
window.addEventListener("focus", function () {
    clearInterval(titleIntervalTimer);
    document.title = titleActive;
});

$(document).on("show.bs.modal", '.modal', function (event) {
    var zIndex = 999 + (10 * $(".modal:visible").length);
    $(this).css("z-index", zIndex);
    setTimeout(function () {
        $(".modal-backdrop").not(".modal-stack").first().css("z-index", zIndex - 1).addClass("modal-stack");
    }, 0);
}).on("hidden.bs.modal", '.modal', function (event) {
    $(".modal:visible").length && $("body").addClass("modal-open");
});
$(document).on('inserted.bs.tooltip', function (event) {
    var zIndex = 999 + (10 * $(".modal:visible").length);
    var tooltipId = $(event.target).attr("aria-describedby");
    $("#" + tooltipId).css("z-index", zIndex);
});
$(document).on('inserted.bs.popover', function (event) {
    var zIndex = 999 + (10 * $(".modal:visible").length);
    var popoverId = $(event.target).attr("aria-describedby");
    $("#" + popoverId).css("z-index", zIndex);
});
$(document).on("hidden.bs.modal", function (event) {
    if ($("body").hasClass("form-dialog")) {
        $("#form_dialog .modal-dialog").html("");
    } else if ($("body").hasClass("form-dialog-detail")) {
        $("#form_dialog_detail .modal-dialog").html("");
    } else if ($("body").hasClass("product-popup")) {
        $("#modalProduct .modal-dialog").html("");
    } else if ($("body").hasClass("plan-dialog")) {
        $("#modalPlan .modal-dialog").html("");
    }
});
$(document).ready(function () {
    setNumber("form");
    if ($("form").length) {
        $("form input").keydown(function (event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode === 13) {
                event.preventDefault();
                if ($(this.form).find(".submit")) {
                    $(this.form).find(".submit").click();
                }
            }
        });
    }
    if ($(".dropdown-menu").length) {
        $(".dropdown-menu").on("click", function (e) {
            e.stopPropagation();
        });
    }
    if ($(".filter .dropdown-menu input").length) {
        $(".filter .dropdown-menu input").on("click", function (e) {
            e.stopPropagation();
            var _p = $(this).closest(".dropdown-menu").attr("aria-labelledby");
            $("#" + _p).trigger("click");
        });
    }
    if ($(".menu-catalog").length) {
        $(".menu-catalog").on("show.bs.dropdown", function (e) {
            $("body").css("overflow", "hidden");
            $(".dropdown__our_product").css("display", "block");
        }).on("hidden.bs.dropdown", function (e) {
            $("body").css("overflow", "auto");
            $(".dropdown__our_product").css("display", "block");
            $(".dropdown__our_product").addClass("animated bounceOutUp fast");
            setTimeout(function () {
                $(".dropdown__our_product").removeClass("animated bounceOutUp fast");
                $(".dropdown__our_product").css("display", "none");
            }, 800);
        });
    }
});

function toastSuccess(str) {
    if (str) {
        //toastr.clear();
        toastr.success(str);
    }
}

function toastError(str) {
    if (str) {
        //toastr.clear();
        toastr.error(str);
    }
}

function toastCart(image, title, message) {
    //toastr.clear();
    toastr.options.onclick = function () {
        if (!$("#offcanvasCart").hasClass("show")) {
            var myOffcanvas = document.getElementById("offcanvasCart");
            var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);
            bsOffcanvas.show();
        }
        // location.replace(site_url + "cart");
    };
    toastr.success(message, title);
    var x = document.querySelectorAll("#toast-container>.toast-success");
    x[0].style.setProperty("background-image", "url(" + image + ")", "important");
    x[0].style.setProperty("background-position", "left center", "important");
    x[0].style.setProperty("background-size", "clamp(60px, 100%, 70px)", "important");
    x[0].style.setProperty("padding-left", "80px", "important");
    x[0].style.setProperty("background-color", "#ffffff", "important");
    x[0].style.setProperty("color", "#000000", "important");
}

function loading_open() {
    $("#loading").show();
}

function loading_close() {
    $("#loading").hide();
}

function setCurrency(str) {
    if (str) {
        var string = "code=" + str;
        $.ajax({
            type: "POST",
            url: site_url + "web/currency",
            data: string,
            cache: false,
            dataType: "json",
            beforeSend: function () {
                // loading_open();
            },
            success: function (json) {
                if (json.status) {
                    location.reload();
                } else {
                    swal(
                        'Error',
                        json.message,
                        'error'
                    );
                }
            },
            complete: function () {
                // loading_close();
            }
        });
    }
}

function showRibbon() {
    if ($("body").hasClass("modal-open")) {
        hideRibbon();
        return;
    }
    $("#ribbonPopup .modal-dialog").addClass("ribbon-in");
    $("#ribbonPopup").modal("show");
}

function hideRibbon() {
    $("#ribbonPopup .modal-dialog").removeClass("ribbon-in").addClass("ribbon-out");
    $(".modal-backdrop").removeClass("ribbon-in").addClass("ribbon-out");
    setTimeout(function () {
        $("#ribbonPopup .modal-dialog").removeClass("ribbon-out");
        $(".modal-backdrop").removeClass("ribbon-out");
        $('#ribbonPopup').modal("hide");
    }, 1000);
}

function whatsappClick() {
    if (typeof fbq !== 'undefined') {
        fbqTrack('LeadWA');
    }
    if (typeof gtag !== 'undefined') {
        gtag('event', 'lead_wa');
    }
}

function showMenuCategory(e) {
    var str = $(e).attr("data");
    if ($(".header-submenu-category.category-" + str).hasClass("hidden")) {
        $(".header-submenu-category").addClass("hidden");
        $(".header-submenu-category.category-" + str).removeClass("hidden");
    }
}

function closeModal() {
    if ($("body").hasClass("modal-open")) {
        $(".modal.show .modal-dialog .modal-close").click();
    }
}

function docBlur() {
    window.blur();
    document.activeElement.blur();
}

function setNumber(_el) {
    $(_el + ' :input[type=number]').on('mousewheel', function (e) {
        e.preventDefault();
    });
}

function setSelect2(_el) {
    $.each($(_el), function () {
        $(this).select2({
            width: '100%',
            placeholder: $(this).data("placeholder"),
            allowClear: true
        });
    });
}

function setSummerNote(_el, _height) {
    $(_el).summernote({
        height: _height,
        toolbar:
            [
                ['style', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['table', ['table']],
                ['view', ['fullscreen', 'codeview']]
            ]
    });
}

function setRatingBar(_el, _stroke = 10, _size = 12) {
    if ($(_el).length) {
        $(_el).starRating({
            readOnly: true,
            starShape: 'rounded',
            emptyColor: '#EBEBE8',
            strokeColor: '#F0D16F',
            activeColor: '#F0D16F',
            strokeWidth: _stroke,
            starSize: _size,
            starGradient: {
                start: '#F0D16F',
                end: '#F0D16F'
            },
        });
    }
}

function open_form(str) {
    $.ajax({
        type: "POST",
        url: site_url + str,
        cache: false,
        beforeSend: function () {
            loading_open();
        },
        success: function (data) {
            docBlur();
            $("#form_dialog .modal-dialog").html(data);
            $("#form_dialog").modal("show");
            $("body").addClass("form-dialog");
        },
        complete: function () {
            loading_close();
        }
    });
}

function form_update(str, id) {
    var string = "id=" + id;
    $.ajax({
        type: "POST",
        url: site_url + str,
        data: string,
        cache: false,
        beforeSend: function () {
            loading_open();
        },
        success: function (data) {
            docBlur();
            $("#form_dialog .modal-dialog").html(data);
            $("#form_dialog").modal("show");
            $("body").addClass("form-dialog");
        },
        complete: function () {
            loading_close();
        }
    });
}

function form_dialog_detail(str, id) {
    var string = "id=" + id;
    $.ajax({
        type: "POST",
        url: site_url + str,
        data: string,
        cache: false,
        beforeSend: function () {
            loading_open();
        },
        success: function (data) {
            docBlur();
            $("#form_dialog_detail .modal-dialog").html(data);
            $("#form_dialog_detail").modal("show");
            $("body").addClass("form-dialog-detail");
        },
        complete: function () {
            loading_close();
        }
    });
}

function open_dialog(_get, _store, _form, _title, id) {
    var string = "";
    if (id) {
        string = "id=" + id;
    }
    $.ajax({
        type: "POST",
        url: site_url + _get,
        data: string,
        cache: false,
        beforeSend: function () {
            loading_open();
        },
        success: function (data) {
            swal({
                    title: _title,
                    text: data,
                    html: true,
                    showCancelButton: true,
                    confirmButtonColor: "#42352e",
                    cancelButtonText: "No",
                    confirmButtonText: "Yes",
                    closeOnConfirm: false
                },
                function () {
                    var proceed = saveFormData(_store, _form);
                    if (proceed) {
                        if (proceed.status) {
                            swal.close();
                            closeModal();
                            toastSuccess(proceed.message);
                        } else {
                            toastError(proceed.message);
                        }
                    }
                });
        },
        complete: function () {
            loading_close();
        }
    });
}

function fieldValidate(form) {
    return $(form).valid();
}

function saveData(linkUrl, string) {
    var _return = false;
    if (linkUrl && string) {
        $.ajax({
            type: "POST",
            url: site_url + linkUrl,
            data: string,
            cache: false,
            async: false,
            dataType: "json",
            beforeSend: function () {
                loading_open();
            },
            success: function (json) {
                _return = json;
            },
            complete: function () {
                loading_close();
            }
        });
    }
    return _return;
}

function saveFormData(linkUrl, form) {
    var _return = false;
    if (fieldValidate(form) && linkUrl) {
        var string = $(form).serialize();
        $.ajax({
            type: "POST",
            url: site_url + linkUrl,
            data: string,
            cache: false,
            async: false,
            dataType: "json",
            beforeSend: function () {
                loading_open();
            },
            success: function (json) {
                _return = json;
            },
            complete: function () {
                loading_close();
            }
        });
    }
    return _return;
}

function saveChangeData(_form, _url, _callback = false) {
    if (fieldValidate(_form)) {
        var string = $(_form).serialize();
        $.ajax({
            type: "POST",
            url: site_url + _url,
            data: string,
            cache: false,
            dataType: "json",
            beforeSend: function () {
                loading_open();
            },
            success: function (json) {
                if (json.status) {
                    if ($("body").hasClass("modal-open")) {
                        closeModal();
                    }
                    swal(
                        'Success',
                        json.message,
                        'success'
                    );
                    if (_callback) {
                        _callback((json.id ? json.id : ""));
                    }
                } else {
                    swal(
                        'Error',
                        json.message,
                        'error'
                    );
                }
            },
            complete: function () {
                loading_close();
            },
            error: function (xhr, status, error) {
                swal(
                    'Error',
                    error,
                    'error'
                );
            }
        });
    }
}

function submitData(_form) {
    if (fieldValidate(_form)) {
        $(_form + " .submit").click();
    }
}

function delData(str, _url, _callback = false) {
    if (str) {
        swal({
                title: "Confirmation",
                text: "Delete Data ?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#42352e",
                cancelButtonText: "No",
                confirmButtonText: "Yes",
                closeOnConfirm: false
            },
            function () {
                var string = "id=" + str;
                $.ajax({
                    type: "POST",
                    url: site_url + _url,
                    data: string,
                    cache: false,
                    dataType: "json",
                    beforeSend: function () {
                        loading_open();
                    },
                    success: function (json) {
                        if (json.status) {
                            swal(
                                'Success',
                                json.message,
                                'success'
                            );
                            if (_callback) {
                                _callback((json.id ? json.id : ""));
                            }
                        } else {
                            swal(
                                'Error',
                                json.message,
                                'error'
                            );
                        }
                    },
                    complete: function () {
                        loading_close();
                    },
                    error: function (xhr, status, error) {
                        swal(
                            'Error',
                            error,
                            'error'
                        );
                    }
                });
            });
    }
}

function setSelectJson(t, k, v, b, c, s, r) {
    if (t != '' && s != '') {
        var string = 'table=' + t;
        if (k != '' && v != '' && k != null && v != null) {
            string += '&key=' + k + '&value=' + v;
        }
        if (b != '' && c != '' && b != null && c != null) {
            string += '&by=' + b + '&case=' + c;
        }
        $.ajax({
            type: 'POST',
            url: site_url + "common/getDataJson",
            data: string,
            cache: false,
            dataType: 'json',
            beforeSend: function () {
                loading_open();
            },
            success: function (json) {
                $(s).val('').trigger('change');
                $(s).find('option').remove().end().append('<option value=""></option>');
                $(json).each(function (index, i) {
                    var option = $("<option/>").attr("value", i.id).text(i.name);
                    $(s).append(option);
                });
                if (r != undefined) {
                    $(s).val(r).trigger('change');
                }
            },
            complete: function () {
                loading_close();
            }
        });
    } else {
        $(s).val('').trigger('change');
        $(s).find('option').remove().end().append('<option value=""></option>');
    }
}

function setSelectRequiredJson(t, k, v, b, c, s, r) {
    if (t != '' && k != '' && v != '' && s != '') {
        var string = 'table=' + t + '&key=' + k + '&value=' + v;
        if (b != '' && c != '' && b != null && c != null) {
            string += '&by=' + b + '&case=' + c;
        }
        $.ajax({
            type: 'POST',
            url: site_url + "common/getDataJson",
            data: string,
            cache: false,
            dataType: 'json',
            beforeSend: function () {
                loading_open();
            },
            success: function (json) {
                $(s).val('').trigger('change');
                $(s).find('option').remove().end().append('<option value=""></option>');
                $(json).each(function (index, i) {
                    var option = $("<option/>").attr("value", i.id).text(i.name);
                    $(s).append(option);
                });
                if (r != undefined) {
                    $(s).val(r).trigger('change');
                }
            },
            complete: function () {
                loading_close();
            }
        });
    } else {
        $(s).val('').trigger('change');
        $(s).find('option').remove().end().append('<option value=""></option>');
    }
}

function listPagination(_start = 0, _url, _form, _el, _callback = false) {
    var string = $(_form).serialize() + "&start=" + _start;
    $.ajax({
        type: 'POST',
        url: site_url + _url,
        data: string,
        cache: false,
        beforeSend: function () {
            // loading_open();
        },
        success: function (data) {
            $(_el).html(data);
            if (_callback) {
                _callback();
            }
        },
        complete: function () {
            // loading_close();
        }
    });
}

function addCommas(nStr) {
    if (nStr) {
        nStr = parseInt(nStr);
        nStr += '';
        x = nStr.split(',');
        x1 = x[0];
        x2 = x.length > 1 ? ',' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    } else {
        if (isNaN(parseFloat(nStr))) {
            return '';
        } else {
            return nStr;
        }
    }
}

function numdec(str, decimal = 2) {
    if (str) {
        return str.toLocaleString('en-US', {maximumFractionDigits: decimal});
    }
    return '';
}

function convert_date(str) {
    var date = new Date(str);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }
    var tanggal = year + '-' + month + '-' + day;
    return tanggal;
}

function convert_datetime(str) {
    var date = new Date(str);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var hours = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }
    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    if (second < 10) {
        second = '0' + second;
    }
    var tanggal = year + '-' + month + '-' + day + ' ' + hours + ':' + minute + ':' + second;
    return tanggal;
}

function date_format(str) {
    var date = new Date(str);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }
    var tanggal = day + '/' + month + '/' + year;
    return tanggal;
}

function datetime_format(str) {
    var date = new Date(str);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var hours = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }
    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    if (second < 10) {
        second = '0' + second;
    }
    var tanggal = day + '/' + month + '/' + year + ' ' + hours + ':' + minute + ':' + second;
    return tanggal;
}

function addDay(str, day) {
    var date = new Date(str);
    var newdate = new Date(date);
    newdate.setDate(newdate.getDate() + parseInt(day));
    var dd = newdate.getDate();
    var mm = newdate.getMonth() + 1;
    var yyyy = newdate.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var result = yyyy + '-' + mm + '-' + dd;
    return result;
}

function subDay(str, day) {
    var date = new Date(str);
    var newdate = new Date(date);
    newdate.setDate(newdate.getDate() - parseInt(day));
    var dd = newdate.getDate();
    var mm = newdate.getMonth() + 1;
    var yyyy = newdate.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var result = yyyy + '-' + mm + '-' + dd;
    return result;
}

function convert_currency(e) {
    var _form = $(e.form).attr('id');
    var str = e.value;
    var minus = '';
    if (str && str.substr(0, 1) === '-') {
        minus = '-';
    }
    var re = /\D/g; /* /,/g */
    var result = str.replace(re, "");
    result = parseInt(result);
    if (result >= 0) {
        result = parseInt(result);
    } else {
        result = '';
    }
    $('#' + _form + ' input[name=' + e.id + ']').val(minus + '' + result);
    $(e).val(minus + '' + addCommas(parseInt(result)));
}

function cek_length(str, val) {
    var string = $('textarea[name=' + str + ']').val();
    var jml = string.length;
    if (jml > parseInt(val)) {
        $('textarea[name=' + str + ']').val(string.substr(0, parseInt(val)));
    }
}

function removeSpace(e) {
    if (e.value) {
        return $(e).val(string_replace(e.value, ' ', ''));
    }
}

function string_replace(str, r, j) {
    if (str.split(r).join(j)) {
        return str.split(r).join(j);
    } else {
        return str;
    }
}

function capitalize(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function uniqid() {
    return new Date().valueOf();
}

function currency(e) {
    var str = e.value;
    var re = /\D/g; /* /,/g */
    var result = str.replace(re, "");
    result = (result >= 0 ? parseInt(result) : '');
    $(e).val(addCommas(result));
}

function copyText(_el) {
    var _input = document.getElementById(_el);
    _input.select();
    _input.setSelectionRange(0, 99999);
    document.execCommand("copy");
    toastSuccess("Copied");
}

function generateCode() {
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
}

function passwordStrength(_el, _button) {
    $(_el).password({
        enterPass: 'Type your password',
        shortPass: 'The password is too short, minimum 8 characters',
        containsField: 'The password contains your username',
        steps: {
            // Easily change the steps' expected score here
            10: 'Really insecure password',
            20: 'Weak, try combining letters & numbers',
            30: 'Medium, try using special characters',
            60: 'Strong password',
        },
        showPercent: false,
        showText: true, // shows the text tips
        animate: true, // whether or not to animate the progress bar on input blur/focus
        animateSpeed: 'fast', // the above animation speed
        field: false, // select the match field (selector or jQuery instance) for better password checks
        fieldPartialMatch: true, // whether to check for partials in field
        minimumLength: 8, // minimum password length (below this threshold, the score is 0)
        useColorBarImage: true, // use the (old) colorbar image
        customColorBarRGB: {
            red: [0, 240],
            green: [0, 240],
            blue: 10,
        } // set custom rgb color ranges for colorbar.
    }).on('password.score', function (e, score) {
        if (score >= 40) {
            $(_button).css("filter", "unset").removeClass('disabled').removeAttr('disabled');
        } else {
            $(_button).css("filter", "grayscale(1)").addClass('disabled').attr('disabled', true);
        }
    });
}

function confirmNewsletter() {
    if (fieldValidate("#form_newsletter")) {
        // $("#subscriptionModal").modal("show");
        submitNewsletter();
    }
}

function submitNewsletter() {
    if (fieldValidate("#form_newsletter")) {
        var string = $("#form_newsletter").serialize();
        $.ajax({
            type: "POST",
            url: site_url + "web/newsletter",
            data: string,
            cache: false,
            dataType: "json",
            beforeSend: function () {
                loading_open();
            },
            success: function (json) {
                if (json.status) {
                    /*
                    document.getElementById("form_newsletter").reset();
                    closeModal();
                    swal(
                        'Success',
                        json.message,
                        'success'
                    );
                    */
                    $(".greeting-subscribe-mail h5").html(json.title);
                    $(".greeting-subscribe-mail p").html(json.message);
                    $(".input__subscribe-mail").addClass("hidden");
                    $(".greeting-subscribe-mail").removeClass("hidden");
                } else {
                    swal(
                        'Error',
                        json.message,
                        'error'
                    );
                }
            },
            complete: function () {
                loading_close();
            },
            error: function (xhr, status, error) {
                swal(
                    'Error',
                    error,
                    'error'
                );
            }
        });
    }
}

function submitLogin(str) {
    if (fieldValidate(str)) {
        var string = $(str).serialize();
        $.ajax({
            type: "POST",
            url: site_url + "auth",
            data: string,
            cache: false,
            dataType: "json",
            beforeSend: function () {
                loading_open();
            },
            success: function (json) {
                if (json.status) {
                    if (typeof gtag !== 'undefined') {
                        gtag("event", "login", {
                            method: "Website"
                        });
                    }
                    swal({
                        title: "Welcome Back",
                        text: "Redirecting page . . .",
                        type: "info",
                        showCancelButton: false,
                        showConfirmButton: false
                    });
                    setTimeout(function () {
                        location.replace(site_url + json.url);
                    }, 1000);
                } else {
                    swal(
                        'Error',
                        json.message,
                        'error'
                    );
                }
            },
            complete: function () {
                loading_close();
            },
            error: function (xhr, status, error) {
                swal(
                    'Error',
                    error,
                    'error'
                );
            }
        });
    }
}

function submitForgotPassword() {
    if (fieldValidate("#form_data")) {
        var string = $("#form_data").serialize();
        $.ajax({
            type: "POST",
            url: site_url + "web/auth/forgot_password_save",
            data: string,
            cache: false,
            dataType: "json",
            beforeSend: function () {
                loading_open();
            },
            success: function (json) {
                var _el = $("#form_data .alert");
                if (json.status) {
                    _el.removeClass("alert-danger").addClass("alert-custom");
                    $("#form_data")[0].reset();
                } else {
                    _el.removeClass("alert-custom").addClass("alert-danger");
                }
                $("#form_data .alert .message").html(json.message);
                _el.addClass("show");
            },
            complete: function () {
                loading_close();
            },
            error: function (xhr, status, error) {
                swal(
                    'Error',
                    error,
                    'error'
                );
            }
        });
    }
}

function submitRecoveryPassword() {
    if (fieldValidate("#form_data")) {
        if ($("#form_data input[name=password]").val() !== $("#form_data input[name=password2]").val()) {
            swal(
                'Warning',
                'Password not match!',
                'warning'
            );
            return false;
        }
        var string = $("#form_data").serialize();
        $.ajax({
            type: "POST",
            url: site_url + "web/auth/recovery_password_save",
            data: string,
            cache: false,
            dataType: "json",
            beforeSend: function () {
                loading_open();
            },
            success: function (json) {
                if (json.status) {
                    swal({
                        title: "Password Changes",
                        text: "Redirecting page . . .",
                        type: "info",
                        showCancelButton: false,
                        showConfirmButton: false
                    });
                    setTimeout(function () {
                        location.replace(site_url + json.url);
                    }, 1000);
                } else {
                    swal(
                        'Error',
                        json.message,
                        'error'
                    );
                }
            },
            complete: function () {
                loading_close();
            },
            error: function (xhr, status, error) {
                swal(
                    'Error',
                    error,
                    'error'
                );
            }
        });
    }
}

function submitRegister() {
    if (fieldValidate("#form_data")) {
        if ($("#form_data input[name=password]").val() !== $("#form_data input[name=password2]").val()) {
            swal(
                'Warning',
                'Password not match!',
                'warning'
            );
            return false;
        }
        if (!$("#form_data input[name=terms]").is(":checked")) {
            swal(
                'Warning',
                'You need to agree with our terms & conditions!',
                'warning'
            );
            return false;
        }
        var string = $("#form_data").serialize();
        $.ajax({
            type: "POST",
            url: site_url + "web/auth/register_save",
            data: string,
            cache: false,
            dataType: "json",
            beforeSend: function () {
                loading_open();
            },
            success: function (json) {
                if (json.status) {
                    swal({
                        title: "Thank you for Joining",
                        text: "Redirecting page . . .",
                        type: "info",
                        showCancelButton: false,
                        showConfirmButton: false
                    });
                    setTimeout(function () {
                        location.replace(site_url + json.url);
                    }, 1000);
                } else {
                    swal(
                        'Error',
                        json.message,
                        'error'
                    );
                }
            },
            complete: function () {
                loading_close();
            },
            error: function (xhr, status, error) {
                swal(
                    'Error',
                    error,
                    'error'
                );
            }
        });
    }
}

function submitRegisterOffline() {
    if (fieldValidate("#form_data")) {
        if ($("#form_data input[name=password]").val() !== $("#form_data input[name=password2]").val()) {
            swal(
                'Warning',
                'Password not match!',
                'warning'
            );
            return false;
        }
        if (!$("#form_data input[name=terms]").is(":checked")) {
            swal(
                'Warning',
                'You need to agree with our terms & conditions!',
                'warning'
            );
            return false;
        }
        var string = $("#form_data").serialize();
        $.ajax({
            type: "POST",
            url: site_url + "web/auth/register_offline_save",
            data: string,
            cache: false,
            dataType: "json",
            beforeSend: function () {
                loading_open();
            },
            success: function (json) {
                if (json.status) {
                    swal({
                        title: "Thank you for Join Us",
                        text: "Redirecting page . . .",
                        type: "info",
                        showCancelButton: false,
                        showConfirmButton: false
                    });
                    setTimeout(function () {
                        location.replace(site_url + json.url);
                    }, 1000);
                } else {
                    swal(
                        'Error',
                        json.message,
                        'error'
                    );
                }
            },
            complete: function () {
                loading_close();
            },
            error: function (xhr, status, error) {
                swal(
                    'Error',
                    error,
                    'error'
                );
            }
        });
    }
}

function ktpPreview(_el, _input, _submit = false) {
    if (_input.files && _input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $(_el).attr('src', e.target.result);
            if (_submit) {
                $("#form_data input[type=submit]").click();
            }
        };
        reader.readAsDataURL(_input.files[0]);
    } else {
        $(_el).attr('src', base_url + 'assets/images/ktp.png');
    }
}

function npwpPreview(_el, _input, _submit = false) {
    if (_input.files && _input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $(_el).attr('src', e.target.result);
            if (_submit) {
                $("#form_data input[type=submit]").click();
            }
        };
        reader.readAsDataURL(_input.files[0]);
    } else {
        $(_el).attr('src', base_url + 'assets/images/npwp.png');
    }
}

function submitReseller() {
    if (fieldValidate("#form_data")) {
        if ($("#form_data input[name=password]").val() !== $("#form_data input[name=password2]").val()) {
            swal(
                'Warning',
                'Password not match!',
                'warning'
            );
            return false;
        }
        if (!$("#form_data input[name=terms]").is(":checked")) {
            swal(
                'Warning',
                'You need to agree with our terms & conditions!',
                'warning'
            );
            return false;
        }
        if (!$("#form_data input[name=ktp]").val()) {
            swal(
                'Warning',
                'Please upload your KTP!',
                'warning'
            );
            return false;
        }
        if (!$("#form_data input[name=npwp]").val()) {
            swal(
                'Warning',
                'Please upload your NPWP!',
                'warning'
            );
            return false;
        }
        $("#form_data input[type=submit]").click();
    }
}

function startCountDownOtp() {
    var date = new Date(moment().add(2, 'minutes')).getTime();
    var x = setInterval(function () {
        var now = new Date().getTime();
        var distance = date - now;
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        var timer = "Resend in <strong>" + (minutes ? minutes + "m " : "") + seconds + "s</strong>";
        $("#timer_countdown").html(timer);
        if (distance <= 0) {
            clearInterval(x);
            $("#timer_countdown").html('<a href="javascript:void(0)" class="text-underline" onclick="resendOtp()">Resend OTP</a>');
        }
    }, 1000);
}

function resendOtp() {
    $.ajax({
        url: site_url + "web/auth/otp_resend",
        cache: false,
        dataType: "json",
        beforeSend: function () {
            loading_open();
        },
        success: function (json) {
            if (json.status === "skip") {
                $("#form_data")[0].reset();
                swal(
                    'Success',
                    json.message,
                    'success'
                );
                $("#timer_countdown").html('').hide();
                $("#skip_otp").html('<a href="javascript:void(0)" class="text-underline" onclick="submitOtp(1)">Skip OTP</a>');
            } else if (json.status === "success") {
                $("#form_data")[0].reset();
                swal(
                    'Success',
                    json.message,
                    'success'
                );
                startCountDownOtp();
            } else {
                swal(
                    'Error',
                    json.message,
                    'error'
                );
            }
        },
        complete: function () {
            loading_close();
        },
        error: function (xhr, status, error) {
            swal(
                'Error',
                error,
                'error'
            );
        }
    });
}

function submitOtp(_skip = false) {
    var code1 = $("#form_data input[name=code1]").val();
    var code2 = $("#form_data input[name=code2]").val();
    var code3 = $("#form_data input[name=code3]").val();
    var code4 = $("#form_data input[name=code4]").val();
    if (!_skip) {
        if (code1 === "" || code2 === "" || code3 === "" || code4 === "") {
            swal(
                'Error',
                'Please completed OTP code!',
                'error'
            );
            return false;
        }
    }
    var string = "code=" + code1 + "" + code2 + "" + code3 + "" + code4;
    if (_skip) {
        string += "&skip=1";
    }
    $.ajax({
        type: "POST",
        url: site_url + "web/auth/otp_save",
        data: string,
        cache: false,
        dataType: "json",
        beforeSend: function () {
            loading_open();
        },
        success: function (json) {
            if (json.status === "success") {
                swal({
                    title: "Redirecting page",
                    text: "Please Wait . . .",
                    type: "info",
                    showCancelButton: false,
                    showConfirmButton: false
                });
                setTimeout(function () {
                    location.replace(site_url + json.url);
                }, 1000);
            } else {
                swal(
                    'Error',
                    json.message,
                    'error'
                );
            }
        },
        complete: function () {
            loading_close();
        },
        error: function (xhr, status, error) {
            swal(
                'Error',
                error,
                'error'
            );
        }
    });
}

function submitReminderProduct() {
    if (fieldValidate("#form_reminder")) {
        var string = $("#form_reminder").serialize();
        $.ajax({
            type: "POST",
            url: site_url + "web/reminder_product",
            data: string,
            cache: false,
            dataType: "json",
            beforeSend: function () {
                loading_open();
            },
            success: function (json) {
                if (json.status) {
                    closeModal();
                    $(".toast-reminder").removeClass("hidden");
                } else {
                    swal(
                        'Error',
                        json.message,
                        'error'
                    );
                }
            },
            complete: function () {
                loading_close();
            },
            error: function (xhr, status, error) {
                swal(
                    'Error',
                    error,
                    'error'
                );
            }
        });
    }
}

function sendEmailVerification() {
    swal({
            title: "Confirmation",
            text: "Resend Email Verification ?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#42352e",
            cancelButtonText: "No",
            confirmButtonText: "Yes",
            closeOnConfirm: false
        },
        function () {
            $.ajax({
                url: site_url + "web/auth/email_verification_resend",
                cache: false,
                dataType: "json",
                beforeSend: function () {
                    loading_open();
                },
                success: function (json) {
                    if (json.status) {
                        swal(
                            'Success',
                            json.message,
                            'success'
                        );
                    } else {
                        swal(
                            'Error',
                            json.message,
                            'error'
                        );
                    }
                },
                complete: function () {
                    loading_close();
                },
                error: function (xhr, status, error) {
                    swal(
                        'Error',
                        error,
                        'error'
                    );
                }
            });
        });
}

function catalogProduct(_start = 0) {
    listPagination(_start, "web/catalog_product", "#form_query", "#form_query #list_data");
    if (_start > 0) {
        $('html, body').animate({scrollTop: $('#list_data').offset().top - 120}, 'slow');
    }
}

function catalogGrid(str, _start = 0) {
    listPagination(_start, "web/catalog_grid", "#" + str, "#" + str + " #list_data");
    if (_start > 0) {
        $('html, body').animate({scrollTop: $("#" + str + " #list_data").offset().top - 120}, "slow");
    }
}

function catalogBrand(str, _start = 0) {
    listPagination(_start, "web/catalog_brand", "#" + str, "#" + str + " #list_data");
    if (_start > 0) {
        $('html, body').animate({scrollTop: $("#" + str + ' #list_data').offset().top - 120}, 'slow');
    }
}

function setAddressOverseas(e) {
    if (!$(e).is(":checked")) {
        $(".field-country select:not(.optional)").removeAttr("required");
        $(".field-overseas select:not(.optional)").attr("required", true);
        $(".field-overseas").removeClass("hidden");
        $(".field-country").addClass("hidden");
    } else {
        $(".field-overseas select:not(.optional)").removeAttr("required");
        $(".field-country select:not(.optional)").attr("required", true);
        $(".field-country").removeClass("hidden");
        $(".field-overseas").addClass("hidden");
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
    } else {
        swal(
            'Error',
            'Geolocation is not supported by this browser',
            'error'
        );
    }
}

function locationSuccess(position) {
    $('form input[name=latitude]').val(position.coords.latitude);
    $('form input[name=longitude]').val(position.coords.longitude);
    placeAutoComplete(position.coords.latitude, position.coords.longitude, 17);
    // console.log("Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude);
}

function locationError(error) {
    swal(
        'Error',
        error.message,
        'error'
    );
    console.log('Error Location: ' + error.code + ' - ' + error.message);
}

function placeAutoComplete(lat, lng, z) {
    var latLng = new google.maps.LatLng(lat, lng);
    var map = new google.maps.Map(document.getElementById('map_canvas'), {
        zoom: z,
        center: latLng,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });
    var marker = new google.maps.Marker({
        position: latLng,
        title: 'Location',
        map: map,
        draggable: true
    });
    updateMarkerPosition(latLng);
    google.maps.event.addListener(marker, 'drag', function () {
        updateMarkerPosition(marker.getPosition());
    });
    var input = document.getElementById('search_place');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);
    autocomplete.setFields(['geometry']);
    autocomplete.addListener('place_changed', function () {
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            toastError("No details available for input: '" + place.name + "'");
            return;
        }
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
        updateMarkerPosition(marker.getPosition());
    });
}

function updateMarkerPosition(latLng) {
    $('#form_data input[name=latitude]').val([latLng.lat()]);
    $('#form_data input[name=longitude]').val([latLng.lng()]);
}

function phoneChange(str) {
    $("#form_data .phone-number").html(str);
    startCountDownOtp();
}

function setPlayerId(str) {
    if (str) {
        var string = "player_id=" + str;
        $.ajax({
            type: "POST",
            url: site_url + "web/auth/player_id",
            data: string,
            cache: false,
            dataType: "json",
            success: function (json) {
                if (json.status === "success") {
                    // console.log("Player ID updated");
                }
            },
        });
    }
}

function goTo(str) {
    $('html, body').animate({scrollTop: $(str).offset().top - 250}, 'slow');
}

function scrollToTop() {
    $("html, body").animate({scrollTop: 0}, "slow");
}

function setMinDate(_el) {
    if (_el.length) {
        var date = new Date();
        date.setDate(date.getDate() + 2);
        var dd = date.getDate();
        var mm = date.getMonth() + 1;
        var yyyy = date.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var result = yyyy + '-' + mm + '-' + dd;
        $(_el).attr("min", result);
    }
}

function inArray(str, array) {
    if (array.length) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == str) return true;
        }
    }
    return false;
}

function setItems(_el, _items, _selected = false) {
    if ($(_el).length) {
        $(_items).each(function (i, r) {
            var option = $("<option/>").attr("value", r.id).text(r.name);
            $(_el).append(option);
        });
        if (_selected) {
            $(_el).val(_selected).trigger("change");
        }
    }
}

function fbPixelTrack(_name, _title, _category, _ids, _type, _price = 0) {
    if (typeof fbq !== 'undefined') {
        fbq('track', _name, {
            content_name: _title,
            content_category: _category,
            content_ids: [_ids],
            content_type: _type,
            value: _price,
            currency: 'IDR'
        });
    }
}

function fbqTrack(str, _params = null) {
    if (typeof fbq !== 'undefined') {
        fbq("track", str, _params);
    }
}

function tiktokPixelTrack(_name, _title, _category, _ids, _type, _price = 0, _quantity = 0, _value = 0) {
    if (typeof ttq !== 'undefined') {
        ttq.track('track', _name, {
            content_name: _title,
            content_category: _category,
            content_id: _ids,
            content_type: _type,
            price: _price,
            quantity: _quantity,
            value: _value,
            currency: 'IDR'
        });
    }
}

function isPrivateMode() {
    return new Promise(function detect(resolve) {
        var yes = function () {
            resolve(true);
        }; // is in private mode
        var not = function () {
            resolve(false);
        }; // not in private mode

        function detectChromeOpera() {
            // https://developers.google.com/web/updates/2017/08/estimating-available-storage-space
            var isChromeOpera = /(?=.*(opera|chrome)).*/i.test(navigator.userAgent) && navigator.storage && navigator.storage.estimate;
            if (isChromeOpera) {
                navigator.storage.estimate().then(function (data) {
                    return data.quota < 120000000 ? yes() : not();
                });
            }
            return !!isChromeOpera;
        }

        function detectFirefox() {
            var isMozillaFirefox = 'MozAppearance' in document.documentElement.style;
            if (isMozillaFirefox) {
                if (indexedDB == null) yes();
                else {
                    var db = indexedDB.open('inPrivate');
                    db.onsuccess = not;
                    db.onerror = yes;
                }
            }
            return isMozillaFirefox;
        }

        function detectSafari() {
            var isSafari = navigator.userAgent.match(/Version\/([0-9\._]+).*Safari/);
            if (isSafari) {
                var testLocalStorage = function () {
                    try {
                        if (localStorage.length) not();
                        else {
                            localStorage.setItem('inPrivate', '0');
                            localStorage.removeItem('inPrivate');
                            not();
                        }
                    } catch (_) {
                        // Safari only enables cookie in private mode
                        // if cookie is disabled, then all client side storage is disabled
                        // if all client side storage is disabled, then there is no point
                        // in using private mode
                        navigator.cookieEnabled ? yes() : not();
                    }
                    return true;
                };

                var version = parseInt(isSafari[1], 10);
                if (version < 11) return testLocalStorage();
                try {
                    window.openDatabase(null, null, null, null);
                    not();
                } catch (_) {
                    yes();
                }
            }
            return !!isSafari;
        }

        function detectEdgeIE10() {
            var isEdgeIE10 = !window.indexedDB && (window.PointerEvent || window.MSPointerEvent);
            if (isEdgeIE10) yes();
            return !!isEdgeIE10;
        }

        // when a browser is detected, it runs tests for that browser
        // and skips pointless testing for other browsers.
        if (detectChromeOpera()) return;
        if (detectFirefox()) return;
        if (detectSafari()) return;
        if (detectEdgeIE10()) return;

        // default navigation mode
        return not();
    });
}