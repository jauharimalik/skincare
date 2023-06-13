var fbPixelViews = [];
var COURIER_SERVICES = [];
var COURIER_SERVICE = false;
var COUPON = false;
var VOUCHERS = [];
var VOUCHER = false;
var GRANDTOTAL = 0;
var MIN_TOTAL = (10000 / CURRENCY_RATE);
var MAX_TOTAL = (999999999 / CURRENCY_RATE);

$(document).ready(function () {
    if ($("#list_cart_side").length) {
        cartSide();
    }
    if ($(".product-selection").length) {
        $(".product-selection").each(function (index, row) {
            var _el = $(row).attr("element");
            var product_id = parseInt($(row).attr("product"));
            var _item = "." + _el + " .product-" + product_id;
            if ($(_item + " .variant-selection").length) {
                if ($(_item + " .variant-selection.default:not(.disabled)").length) {
                    $(_item + " .variant-selection.default:not(.disabled)").trigger("click");
                } else {
                    var _selected = false;
                    $(_item + " .variant-selection").each(function (i, r) {
                        if (!_selected && !$(r).hasClass("disabled")) {
                            $(r).trigger("click");
                            _selected = true;
                        }
                    });
                }
            }
        });
    }
});

function popupProduct(str, _el = "") {
    if (str) {
        var string = "id=" + str;
        var _item = (_el ? "." + _el + " " : "") + ".product-" + str;
        if ($(_item + " .variant-selection.active").length) {
            var row = JSON.parse($(_item + " .variant-selection.active").attr("data"));
            string += "&variant=" + row.id;
        }
        $.ajax({
            type: "POST",
            url: site_url + "web/product_popup",
            data: string,
            cache: false,
            beforeSend: function () {
                loading_open();
            },
            success: function (data) {
                $("#modalProduct .modal-dialog").html(data);
                $("#modalProduct").modal("show");
                $("body").addClass("product-popup");
            },
            complete: function () {
                loading_close();
            }
        });
    }
}

function changeVariant(e, _el = "", _fb = false) {
    if ($(e).hasClass("active") || $(e).hasClass("disabled")) {
        return false;
    }
    var isModal = $("body").hasClass("modal-open");
    var product_id = parseInt($(e).attr("product"));
    var row = "";
    var _item = (isModal ? ".modal-content" : _el + " ") + ".product-" + product_id;
    if ($(_item + " .variant-selection.active").length) {
        $(_item + " .variant-selection.active").removeClass("active");
    }
    if ($(_item + " .variant-selection.campaign-free-label").length) {
        $(_item + " .variant-selection.campaign-free-label").removeClass("campaign-free-label");
    }
    if ($(_item + " .campaign-free-info").length && !$(_item + " .campaign-free-info").hasClass("hidden")) {
        $(_item + " .campaign-free-info").addClass("hidden");
    }
    $(e).addClass("active");
    if ($(_item + " .variant-selected").length) {
        $(_item + " .variant-selected").html(row.name);
    }
    if ($(_item + " .image:not(.hover)").length && row.image) {
        $(_item + " .image:not(.hover)").attr("src", row.image);
    }
    if (row.discount > 0) {
        $(_item + " .price-before").html(numdec(row.price_display));
        var _discount_percent = numdec(row.discount_percent) + "%";
        if (!$(_item + " .discount-percent").hasClass("no-text") && !isModal) {
            _discount_percent += " OFF";
        }
        $(_item + " .discount-percent").html(_discount_percent);
        if ($(_item + " .discount-percent").hasClass("hidden")) {
            $(_item + " .discount-percent").removeClass("hidden");
        }
        if ($(_item + " .product--price p").length && $(_item + " .product--price p").hasClass("hidden")) {
            $(_item + " .product--price p").removeClass("hidden");
        } else if ($(_item + " .discount").length && $(_item + " .discount").hasClass("hidden")) {
            $(_item + " .discount").removeClass("hidden");
        }
    } else {
        if (!$(_item + " .discount-percent").hasClass("hidden")) {
            $(_item + " .discount-percent").addClass("hidden");
        }
        if ($(_item + " .product--price p").length && !$(_item + " .product--price p").hasClass("hidden")) {
            $(_item + " .product--price p").addClass("hidden");
        } else if ($(_item + " .discount").length && !$(_item + " .discount").hasClass("hidden")) {
            $(_item + " .discount").addClass("hidden");
        }
    }
    if ($(_item + " input.input-quantity").length) {
        var _input = $(_item + " input.input-quantity");
        if (row.minimum) {
            _input.attr("min", row.minimum);
        }
        if (row.maximum) {
            _input.attr("max", row.maximum);
        }
        if (row.quantity) {
            _input.attr("stock", row.quantity);
        }
        if (row.in_cart) {
            _input.val(row.in_cart);
        }
    }
    if (row.campaigns && row.campaigns.free) {
        if (row.campaigns.free.name && $(_item + " .campaign-free-info").length) {
            $(e).addClass("campaign-free-label");
            $(_item + " .campaign-free-info").html(row.campaigns.free.name).removeClass("hidden");
            if (row.campaigns.free.saving) {
                var _info = "";
                if (row.discount > 0) {
                    _info = $(_item + " .discount-percent").html();
                    _info += " + FREE GIFT UP TO ";
                } else {
                    _info += "SAVE UP TO ";
                }
                _info += row.campaigns.free.saving;
                $(_item + " .discount-percent").html(_info);
                if ($(_item + " .discount-percent").hasClass("hidden")) {
                    $(_item + " .discount-percent").removeClass("hidden");
                }
            }
        }
    }

    if ($(_item + " .input--gift").length) {
        $(_item + " .input--gift").addClass("hidden");
        $(_item + " .input--gift .gift-selected").html("");
        $(_item + " .input--gift .dropdown ul li").remove();
        if (row.campaigns && row.campaigns.free && row.campaigns.free.selections && row.campaigns.free.selections.length) {
            var _selection = "";
            for (var i = 0; i < row.campaigns.free.selections.length; i++) {
                _selection += '<li><a href="javascript:void(0)" class="dropdown-item gift-selection gift-' + row.campaigns.free.selections[i].id + '" onclick="changeGift(this, \'#form_product\')" product="' + product_id + '" campaign="' + row.campaigns.free.id + '" gift="' + row.campaigns.free.selections[i].id + '">' + row.campaigns.free.selections[i].name + '</a></li>';
            }
            $(_item + " .input--gift .dropdown ul").html(_selection);
            $(_item + " .input--gift").removeClass("hidden");
            $(_item + " .input--gift .dropdown").trigger("click");
        }
    }
    
    $(_item + " .price-after").html(numdec(row.amount_display));
    if ($(_item + " .input--size .dropdown").length) {
        $(_item + " .input--size .dropdown").trigger("click");
    }

    if (_fb) {
        fbqProductVariant(row, $(e).attr("productName"));
    }
}

function fbqProductVariant(row, productName) {
    if (typeof fbq !== 'undefined' && row && !inArray(row.sku, fbPixelViews)) {
        fbq("track", "ProductView", {
            content_ids: [row.sku],
            content_type: "product",
            content_name: productName + " " + row.name,
            currency: CURRENCY,
            value: (row.price_display - row.discount_display),
        });
        /*
        fbq("track", "ViewContent", {
            content_ids: [row.sku],
            content_type: "product",
            content_name: row.name_display,
            currency: CURRENCY,
            value: (row.price_display - row.discount_display),
        });
        */
        fbPixelViews.push(row.sku);
    }
}

function changeGift(e, _el) {
    if ($(e).hasClass("active") || $(e).hasClass("disabled")) {
        return false;
    }
    var isModal = $("body").hasClass("modal-open");
    var product_id = parseInt($(e).attr("product"));
    var _item = (isModal ? ".modal-content" : _el + " ") + ".product-" + product_id;
    if ($(_item + " .input--gift .gift-selection.active").length) {
        $(_item + " .input--gift .gift-selection.active").removeClass("active");
    }
    $(e).addClass("active");
    if ($(_item + " .input--gift .gift-selected").length) {
        $(_item + " .input--gift .gift-selected").html($(e).text());
    }
    if ($(_item + " .input--gift .dropdown").length) {
        $(_item + " .input--gift .dropdown").trigger("click");
    }
}

function minusQty(_item, _update = false) {
    var _input = $(_item + " .input-quantity");
    var _qty = parseInt(_input.val());
    var quantity = parseInt(_qty - 1);
    _input.val(quantity);
    validQty(_item, _update);
}

function plusQty(_item, _update = false) {
    var _input = $(_item + " .input-quantity");
    var _qty = parseInt(_input.val());
    var quantity = parseInt(_qty + 1);
    _input.val(quantity);
    validQty(_item, _update);
}

function validQty(_item, _update = false) {
    $(_item + " .span-quantity").addClass("hidden");
    var _input = $(_item + " .input-quantity");
    var _qty = parseInt(_input.val());
    var _min = (_input.attr("min") ? parseInt(_input.attr("min")) : 1);
    var _max = (_input.attr("max") ? parseInt(_input.attr("max")) : -1);
    var _stock = (_input.attr("stock") ? parseInt(_input.attr("stock")) : 0);
    if (_qty < _min) {
        _input.val(_min);
        $(_item + " .span-quantity").html("Min. order " + addCommas(_min)).removeClass("hidden");
        return false;
    } else if (_max > 0 && _qty > _max) {
        _input.val(_max);
        $(_item + " .span-quantity").html("Max. order " + addCommas(_max)).removeClass("hidden");
        return false;
    } else if (_qty > _stock) {
        _input.val(_stock);
        if (_stock <= 0) {
            $(_item + " .span-quantity").html("Out of stock").removeClass("hidden");
        } else {
            $(_item + " .span-quantity").html("Stock left " + addCommas(_stock)).removeClass("hidden");
        }
        return false;
    }
    if (_update) {
        var str = _input.attr("data");
        updateCart(str, _qty);
    }
    return true;
}

function addToCart(_item, _checkout = false) {
    $(_item + " .span-quantity").addClass("hidden");
    if ($(_item + " .variant-selection").length && !$(_item + " .variant-selection.active").length) {
        swal(
            'Warning',
            'Please choose variant!',
            'warning'
        );
        return false;
    }
    if ($(_item + " .gift-selection").length && !$(_item + " .gift-selection.active").length) {
        swal(
            'Warning',
            'Please pick your gift!',
            'warning'
        );
        return false;
    }
    var product_id = $(_item).attr("product");
    var quantity = $(_item + " input.input-quantity").val();
    if (quantity <= 0) {
        $(_item + " .span-quantity").html("Please input quantity").removeClass("hidden");
        return false;
    }
    var string = "product_id=" + product_id + "&quantity=" + quantity;
    if ($(_item + " .variant-selection.active").length) {
        var row = JSON.parse($(_item + " .variant-selection.active").attr("data"));
        string += "&variant_id=" + row.id;
    }
    if ($(_item + " .gift-selection.active").length) {
        string += "&free_id=" + $(_item + " .gift-selection.active").attr("campaign") + "&free_selected=" + $(_item + " .gift-selection.active").attr("gift");
    }
    if (_checkout) {
        string += "&checkout=1";
    }
    $.ajax({
        type: "POST",
        url: site_url + "web/cart_save",
        data: string,
        cache: false,
        dataType: "json",
        beforeSend: function () {
            loading_open();
        },
        success: function (json) {
            if (json.status) {
                if (typeof fbq !== 'undefined') {
                    fbq("track", "AddToCart", {
                        content_ids: [json.product.sku],
                        content_type: "product",
                        content_name: json.product.name,
                        value: parseFloat(json.product.total),
                        currency: CURRENCY,
                        contents:
                            [
                                {
                                    id: json.product.sku,
                                    quantity: json.product.quantity
                                }
                            ]
                    });
                }
                if (typeof gtag !== 'undefined') {
                    gtag("event", "add_to_cart", {
                        currency: CURRENCY,
                        value: parseFloat(json.product.total),
                        items:
                            [
                                {
                                    item_id: json.product.sku,
                                    item_name: json.product.name,
                                    quantity: json.product.quantity,
                                    currency: CURRENCY,
                                    price: parseFloat(json.product.total)
                                }
                            ]
                    });
                }
                if (_checkout) {
                    window.history.pushState({}, document.title, window.location.href);
                    swal({
                        title: "Redirecting Page",
                        text: "Please Wait . . .",
                        type: "info",
                        showCancelButton: false,
                        showConfirmButton: false
                    });
                    setTimeout(function () {
                        location.replace(site_url + 'checkout');
                    }, 1000);
                } else {
                    closeModal();
                    cartSide();
                    toastCart(json.product.image, json.product.name, json.message);
                }
            } else {
                toastError(json.message);
            }
        },
        complete: function () {
            loading_close();
        }
    });
}

function addToBag(str, _el = "") {
    var _item = (_el ? "." + _el + " " : "") + ".product-" + str;
    if ($(_item + " .variant-selection").length && !$(_item + " .variant-selection.active").length) {
        swal(
            'Warning',
            'Please choose variant!',
            'warning'
        );
        return false;
    }
    var string = "product_id=" + str + "&quantity=1&direct=1";
    if ($(_item + " .variant-selection.active").length) {
        var row = JSON.parse($(_item + " .variant-selection.active").attr("data"));
        string += "&variant_id=" + row.id;
    }
    $.ajax({
        type: "POST",
        url: site_url + "web/cart_save",
        data: string,
        cache: false,
        dataType: "json",
        beforeSend: function () {
            loading_open();
        },
        success: function (json) {
            if (json.status) {
                if (typeof fbq !== 'undefined') {
                    fbq("track", "AddToCart", {
                        content_ids: [json.product.sku],
                        content_type: "product",
                        content_name: json.product.name,
                        value: parseFloat(json.product.total),
                        currency: CURRENCY,
                        contents:
                            [
                                {
                                    id: json.product.sku,
                                    quantity: json.product.quantity
                                }
                            ]
                    });
                }
                if (typeof gtag !== 'undefined') {
                    gtag("event", "add_to_cart", {
                        currency: CURRENCY,
                        value: parseFloat(json.product.total),
                        items:
                            [
                                {
                                    item_id: json.product.sku,
                                    item_name: json.product.name,
                                    quantity: json.product.quantity,
                                    currency: CURRENCY,
                                    price: parseFloat(json.product.total)
                                }
                            ]
                    });
                }
                cartSide();
                toastCart(json.product.image, json.product.name, json.message);
            } else {
                toastError(json.message);
            }
        },
        complete: function () {
            loading_close();
        }
    });
}

function updateCart(str, _qty) {
    if (str && _qty) {
        var string = "id=" + str + "&quantity=" + _qty;
        $.ajax({
            type: 'POST',
            url: site_url + "web/cart_update",
            data: string,
            cache: false,
            dataType: 'json',
            beforeSend: function () {
                $(".cart-" + str + " .loading-quantity").removeClass("hidden");
                $(".cart-" + str + " input.input-quantity").attr("disabled", true);
                $(".cart-" + str + " button.min").attr("disabled", true);
                $(".cart-" + str + " button.plus").attr("disabled", true);
            },
            success: function (json) {
                if (json.status) {
                    if (typeof fbq !== 'undefined') {
                        fbq("track", "AddToCart", {
                            content_ids: [json.product.sku],
                            content_type: "product",
                            content_name: json.product.name,
                            value: parseFloat(json.product.total),
                            currency: CURRENCY,
                            contents:
                                [
                                    {
                                        id: json.product.sku,
                                        quantity: json.product.quantity
                                    }
                                ]
                        });
                    }
                    if (typeof gtag !== 'undefined') {
                        gtag("event", "add_to_cart", {
                            currency: CURRENCY,
                            value: parseFloat(json.product.total),
                            items:
                                [
                                    {
                                        item_id: json.product.sku,
                                        item_name: json.product.name,
                                        quantity: json.product.quantity,
                                        currency: CURRENCY,
                                        price: parseFloat(json.product.total)
                                    }
                                ]
                        });
                    }
                    $(".cart-" + str + " input.input-quantity").val(_qty);
                    if ($(".free-product-" + str).length) {
                        $(".free-product-" + str).html(_qty + " pcs");
                    }
                    calculateCart();
                    toastSuccess(json.message);
                } else {
                    toastError(json.message);
                }
            },
            complete: function () {
                $(".cart-" + str + " .loading-quantity").addClass("hidden");
                $(".cart-" + str + " input.input-quantity").removeAttr("disabled");
                $(".cart-" + str + " button.min").removeAttr("disabled");
                $(".cart-" + str + " button.plus").removeAttr("disabled");
            }
        });
    }
}

function removeCart(str) {
    if (str) {
        swal({
                title: "Confirmation",
                text: "Remove item?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#42352e",
                cancelButtonText: "No",
                confirmButtonText: "Yes",
                closeOnConfirm: false
            },
            function () {
                var string = "id=" + str;
                var proceed = saveData("web/cart_del", string);
                if (proceed) {
                    if (proceed.status) {
                        swal.close();
                        if ($(".cart-selection.cart-" + str).length) {
                            $(".cart-selection.cart-" + str).remove();
                        }
                        if ($(".cart-selection.free-" + str).length) {
                            $(".cart-selection.free-" + str).remove();
                        }
                        calculateCart();
                        toastSuccess(proceed.message);
                    } else {
                        toastError(proceed.message);
                    }
                }
            });
    }
}

function addToWishlist(_item) {
    if (IS_LOGIN) {
        var product_id = $(_item).attr("product");
        var string = "id=" + product_id;
        $.ajax({
            type: "POST",
            url: site_url + "web/wishlist_save",
            data: string,
            cache: false,
            dataType: "json",
            beforeSend: function () {
                loading_open();
            },
            success: function (json) {
                if (json.status) {
                    if (json.wishlist) {
                        $(_item + " .icon-wishlist i").removeClass("far").addClass("fa");
                    } else {
                        $(_item + " .icon-wishlist i").removeClass("fa").addClass("far");
                    }
                    toastSuccess(json.message);
                } else {
                    toastError(json.message);
                }
            },
            complete: function () {
                loading_close();
            }
        });
    } else {
        toastError("You need to login to continue!");
    }
}

function cartSide() {

}

function cartGiftProgress() {
    $.ajax({
        url: site_url + "web/cart_gift_progress",
        cache: false,
        dataType: "json",
        beforeSend: function () {
            // loading_open();
        },
        success: function (json) {
            if (json) {
                $(".cart-progress").removeClass("hidden");
                $(".cart-progress p").html(json.description);
                $(".cart-progress .progress-bar").attr("aria-valuenow", json.progress);
                $(".cart-progress .progress-bar").css("width", json.progress + "%");
            } else {
                $(".cart-progress").addClass("hidden");
            }
        },
        complete: function () {
            // loading_close();
        }
    });
}

function cartGift(_selected = false) {
    $.ajax({
        url: site_url + "web/cart_gift",
        cache: false,
        beforeSend: function () {
            // loading_open();
        },
        success: function (data) {
            $(".list-gift").html(data);
            if (_selected && $("#form_cart .gift-checkbox").length) {
                setTimeout(function () {
                    var _total = 0;
                    $("#form_cart .gift-checkbox").each(function (index, row) {
                        if (inArray(row.value, _selected.split(","))) {
                            $(row).prop("checked", true).trigger("change");
                            _total++;
                        }
                    });
                    if (_total > 0) {
                        cartTotal();
                    }
                }, 1000);
            }
        },
        complete: function () {
            // loading_close();
        }
    });
}

function cartFree() {
    $.ajax({
        url: site_url + "web/cart_free",
        cache: false,
        beforeSend: function () {
            // loading_open();
        },
        success: function (data) {
            $(".list-free").html(data);
        },
        complete: function () {
            // loading_close();
        }
    });
}

function cartRecommendation() {
    $.ajax({
        url: site_url + "web/cart_recommendation",
        cache: false,
        beforeSend: function () {
            // loading_open();
        },
        success: function (data) {
            $(".list-recommendation").html(data);
        },
        complete: function () {
            // loading_close();
        }
    });
}

function chooseGift(e) {
    var _form = "#" + e.form.id;
    if ($(_form + " input.gift-checkbox").length > 0) {
        var _max = parseInt($(_form + " input[name=max_gift]").val());
        var _selected = 0;
        $(_form + " input.gift-checkbox").each(function (index, row) {
            if ($(row).is(":checked")) {
                _selected++;
            }
        });
        if (_selected > _max) {
            $(e).prop("checked", false);
            swal(
                'Warning',
                'You only could choose ' + addCommas(_max) + ' item',
                'warning'
            );
            return false;
        }
    }
    cartTotal();
}

function calculateCart() {
    cartGiftProgress();
    cartGift();
    cartFree();
    setTimeout(function () {
        cartTotal();
    }, 200);
}

function cartTotal() {
    var _form = "#form_cart_side";
    var items = 0;
    var subtotals = 0;
    var discounts = 0;
    var totals = 0;
    if ($(_form + " .cart-selection input.input-quantity").length > 0) {
        $(_form + " .cart-selection input.input-quantity").each(function (index, row) {
            if (!$(row).attr("disabled")) {
                var quantity = parseInt($(row).val());
                var price = parseFloat($(row).attr("price"));
                var discount = parseFloat($(row).attr("discount"));
                items += quantity;
                subtotals += (price * quantity);
                discounts += (discount * quantity);
                totals += ((price - discount) * quantity);
            }
        });
    }
    if ($(_form + " input.gift-checkbox").length > 0) {
        $(_form + " input.gift-checkbox").each(function (index, row) {
            if ($(row).is(":checked")) {
                var quantity = parseInt($(row).attr("quantity"));
                var total = parseFloat($(row).attr("total"));
                items += quantity;
                discounts += total;
            }
        });
    }
    if ($(_form + " .cart-free-item").length > 0) {
        $(_form + " .cart-free-item").each(function (index, row) {
            var quantity = parseInt($(row).attr("quantity"));
            var total = parseFloat($(row).attr("total"));
            items += quantity;
            discounts += total;
        });
    }
    if ($(".cart-total-item").length) {
        $(".cart-total-item").html(addCommas(items));
    }
    if ($(".cart-total-amount").length) {
        $(".cart-total-amount").html(numdec(totals));
    }
    if (items > 0) {
        if (!$(".cart-empty").hasClass("hidden")) {
            $(".cart-empty").addClass("hidden");
        }
        if ($(".cart-not-empty").hasClass("hidden")) {
            $(".cart-not-empty").removeClass("hidden");
        }
    } else {
        if (!$(".cart-not-empty").hasClass("hidden")) {
            $(".cart-not-empty").addClass("hidden");
        }
        if ($(".cart-empty").hasClass("hidden")) {
            $(".cart-empty").removeClass("hidden");
        }
    }
    return totals;
}

function validateCartSide() {
    if (!$("#form_cart_side .cart-selection").length) {
        swal(
            'Warning',
            'Shopping cart is empty',
            'warning'
        );
        return false;
    }
    var proceed = true;
    $("#form_cart_side .cart-selection").each(function (index, row) {
        var str = $(row).attr("data");
        $(".cart-" + str + " .span-quantity").addClass("hidden");
        var _el = $(".cart-" + str + " input.input-quantity");
        var _qty = parseInt(_el.val());
        var _min = (_el.attr("min") ? parseInt(_el.attr("min")) : 1);
        var _max = (_el.attr("max") ? parseInt(_el.attr("max")) : -1);
        var _stock = (_el.attr("stock") ? parseInt(_el.attr("stock")) : 0);
        if (_qty > _stock) {
            proceed = false;
            if (_stock <= 0) {
                $(".cart-" + str + " .span-quantity").html("Out of stock").removeClass("hidden");
                swal(
                    'Warning',
                    $(".cart-" + str + " .product-name").html() + " is out of stock\nPlease remove or change with another product",
                    'warning'
                );
                return false;
            } else {
                _el.val(_stock);
                $(".cart-" + str + " .span-quantity").html("Stock left " + addCommas(_stock)).removeClass("hidden");
            }
        } else if (_qty < _min) {
            _el.val(_min);
            $(".cart-" + str + " .span-quantity").html("Minimum order " + addCommas(_min)).removeClass("hidden");
            proceed = false;
        } else if (_max > 0 && _qty > _max) {
            _el.val(_max);
            $(".cart-" + str + " .span-quantity").html("Maximum order " + addCommas(_max)).removeClass("hidden");
            proceed = false;
        }
    });
    if (!proceed) {
        return false;
    }
    if ($("#form_cart_side .gift-checkbox").length) {
        var _max = parseInt($("#form_cart_side input[name=max_gift]").val());
        /*
        if (!$("#form_cart_side .gift-checkbox").is(":checked")) {
            swal(
                'Warning',
                'Please choose free gift',
                'warning'
            );
            return false;
        }
        */
        var _selected = 0;
        $("#form_cart_side .gift-checkbox").each(function (index, row) {
            if ($(row).is(":checked")) {
                _selected++;
            }
        });
        if (_selected > _max) {
            swal(
                'Warning',
                'You only could choose ' + addCommas(_max) + ' gift',
                'warning'
            );
            return false;
        }
    }
    return true;
}

function checkoutCartSide() {
    if (validateCartSide()) {
        var string = $("#form_cart_side").serialize();
        $.ajax({
            type: "POST",
            url: site_url + "web/cart_update_gift",
            data: string,
            cache: false,
            dataType: "json",
            beforeSend: function () {
                $(".button-checkout").attr("disabled", true);
                loading_open();
            },
            success: function (json) {
                if (json.status) {
                    window.history.pushState({}, document.title, window.location.href);
                    swal({
                        title: "Redirecting Page",
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
                $(".button-checkout").removeAttr("disabled");
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

function shipmentOption(str) {
    if (str === "self") {
        $(".card--contact, .card--shipping").addClass("hidden");
        COURIER_SERVICE = false;
        calculateTotal();
    } else {
        $(".card--contact, .card--shipping").removeClass("hidden");
    }
}

function addressSelected(str = 0) {
    var string = "id=" + str;
    $.ajax({
        type: "POST",
        url: site_url + "web/address_selected",
        data: string,
        cache: false,
        beforeSend: function () {
            // loading_open();
        },
        success: function (data) {
            $("#form_checkout #address_selected").html(data);
        },
        complete: function () {
            // loading_close();
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

function addressList(_start = 0) {
    listPagination(_start, 'web/address_list', '#form_query', '#list_address');
}

function chooseAddress(str) {
    closeModal();
    addressSelected(str);
}

function setCourierServices() {
    COURIER_SERVICES = [];
    COURIER_SERVICE = false;
    $("#list_services").html("");
    $(".shipping-service").html("No service selected");
    calculateTotal();
    if ($("#form_checkout input[name=address_id]").length && $("#form_checkout input[name=address_id]").val()) {
        var string = "ref=customer_address&ref_id=" + $("#form_checkout input[name=address_id]").val();
        string += "&weight=" + WEIGHT;
        if (!IS_B2B && !IS_STAFF) {
            string += "&subtotal=" + (SUBTOTAL * CURRENCY_RATE);
        }
        $.ajax({
            type: "POST",
            url: site_url + "common/courier_service",
            data: string,
            cache: false,
            dataType: "json",
            beforeSend: function () {
                $("#list_services").html('<h5 class="text"><i class="fa fa-spinner fa-spin"></i> Loading . . .</h5>');
                $("#form_checkout .button-checkout").attr("disabled", true);
            },
            complete: function () {
                $("#form_checkout .button-checkout").removeAttr("disabled");
            },
            success: function (json) {
                if (json.status === "success") {
                    var _selected = -1;
                    var output = "";
                    if (json.results.length) {
                        var no = 0;
                        $(json.results).each(function (index, row) {
                            if (row.services.length) {
                                output += '<div class="border-top pt-4 mb-2">';
                                output += '<h6 style="margin:0 40px;"><img src="' + row.image + '" alt="' + row.name + '" style="width:auto;height:25px;"/> ' + row.name + '</h6>';
                                output += '</div>';
                                $(row.services).each(function (i, r) {
                                    output += '<div class="shipping--card d-flex justify-content-between align-items-center service-' + no + '" onclick="setService(' + no + ')" style="cursor:pointer;">';
                                    output += '<div class="mb-2">';
                                    output += '<h6>' + r.description + '</h6>';
                                    output += '<p>Estimated arrival on ' + r.etd + '</p>';
                                    output += '</div>';
                                    output += '<div class="d-flex">';
                                    output += '<p class="me-2">';
                                    output += (r.amount > 0 ? '<small class="me-1">' + CURRENCY_SYMBOL + '</small>' + numdec(r.amount_display) : 'Free!');
                                    if (r.discount > 0) {
                                        output += '<br/><small style="text-decoration:line-through;"><small class="me-1">' + CURRENCY_SYMBOL + '</small>' + numdec(r.cost_display) + '</small>';
                                    }
                                    output += '</p>';
                                    output += '<span class="check-active hidden"><i class="far fa-check-circle"></i></span>';
                                    output += '</div>';
                                    output += '</div>';

                                    if (r.selected) {
                                        _selected = no;
                                    }

                                    var array = [];
                                    array["id"] = row.id;
                                    array["code"] = row.code;
                                    array["name"] = row.name;
                                    array["service_code"] = r.service;
                                    array["service"] = r.description;
                                    array["etd"] = r.etd;
                                    array["cost"] = parseFloat(r.cost);
                                    array["discount"] = parseFloat(r.discount);
                                    array["amount"] = parseFloat(r.amount);
                                    array["cost_display"] = parseFloat(r.cost_display);
                                    array["discount_display"] = parseFloat(r.discount_display);
                                    array["amount_display"] = parseFloat(r.amount_display);
                                    COURIER_SERVICES.push(array);

                                    no++;
                                });
                            }
                        });
                    } else {
                        output += '<div class="alert alert-danger" style="margin:0 40px;"><span class="alert-text">Sorry, your destination is not available service yet!</span></div>';
                    }
                    output += '</table>';
                    $("#list_services").html(output);
                    if (_selected >= 0) {
                        chooseService(_selected);
                    }
                } else {
                    var _html = '<div class="alert alert-danger" style="margin:0 40px;"><span class="alert-text"><b>Error!</b> ' + json.message + '</span></div>';
                    $("#list_services").html(_html);
                }
            },
            error: function (xhr, status, error) {
                var _html = '<div class="alert alert-danger" style="margin:0 40px;"><span class="alert-text"><b>Error!</b> ' + error + '</span></div>';
                $("#list_services").html(_html);
            }
        });
    } else {
        swal(
            'Warning',
            'No address selected!',
            'warning'
        );
    }
}

function setService(str) {
    if (COURIER_SERVICES[str]) {
        COURIER_SERVICE = COURIER_SERVICES[str];
        $(".shipping--list .check-active:not(.hidden)").addClass("hidden");
        $(".shipping--list .shipping--card.active").removeClass("active");
        $(".service-" + str).addClass("active");
        $(".service-" + str + " .check-active").removeClass("hidden");
        $(".shipping-service").html(COURIER_SERVICE.code.toUpperCase() + " - " + COURIER_SERVICE.service);
        closeModal();
    } else {
        COURIER_SERVICE = false;
        $(".shipping--list .check-active:not(.hidden)").addClass("hidden");
        $(".shipping--list .shipping--card.active").removeClass("active");
        $(".shipping-service").html("No service selected");
    }
    calculateTotal();
}

function chooseService() {
    if (!COURIER_SERVICE) {
        swal(
            'Warning',
            'Please choose shipping option',
            'warning'
        );
        return false;
    }
    closeModal();
}

function setPaymentMethod(e) {
    if (e.value) {
        $(".payment--list .payment--card.active").removeClass("active");
        $(".payment--card.method-" + e.value).addClass("active");
        $(".payment-method").html($(e).attr("label"));
        if (inArray($("#form_checkout input[name=payment_method]:checked").val(), ["tf_bca", "tf_mandiri"])) {
            $("#form_checkout .payment-method-info").html("Check Manually");
        } else {
            $("#form_checkout .payment-method-info").html("Check Automatically");
        }
        closeModal();
    } else {
        $(".payment--list .payment--card.active").removeClass("active");
        $(".payment-method").html("No method selected");
        $("#form_checkout .payment-method-info").html("");
    }
    calculateTotal();
}

function choosePaymentMethod() {
    if (!$("#form_checkout input[name=payment_method]").is(":checked")) {
        swal(
            'Warning',
            'Please choose payment method',
            'warning'
        );
        return false;
    }
    closeModal();
}

function applyCoupon(_mobile = false) {
    var coupon = $("#form_checkout .coupon-input" + (_mobile ? ".is-mobile input" : ".is-desktop input")).val();
    if (!coupon) {
        swal(
            'Warning',
            'Please input coupon code',
            'warning'
        );
        return false;
    }
    var string = "code=" + coupon;
    $.ajax({
        type: "POST",
        url: site_url + "web/validate_coupon",
        data: string,
        cache: false,
        dataType: 'json',
        beforeSend: function () {
            loading_open();
        },
        success: function (json) {
            if (json.status) {
                COUPON = json.results;
                $("#form_checkout .coupon-input").addClass("hidden");
                $("#form_checkout .applied-coupon").removeClass("hidden");
                $("#form_checkout .coupon-info").html(COUPON.name);
                $("#form_checkout .coupon-input input").val(COUPON.code);
                toastSuccess("Coupon applied!");
                calculateTotal();
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

function resetCoupon() {
    COUPON = false;
    $("#form_checkout .applied-coupon").addClass("hidden");
    $("#form_checkout .coupon-input").removeClass("hidden");
    calculateTotal();
}

function voucherList() {
    VOUCHERS = [];
    VOUCHER = false;
    $.ajax({
        type: "POST",
        url: site_url + "web/voucher_available",
        cache: false,
        beforeSend: function () {
            // loading_open();
        },
        success: function (data) {
            $("#list_vouchers").html(data);
        },
        complete: function () {
            // loading_close();
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

function chooseVoucher(str) {
    VOUCHER = VOUCHERS[str];
    $(".reward--list .reward--item.active").removeClass("active");
    $(".reward-" + str).addClass("active");
    $(".voucher-info").html(VOUCHER.name);
    $(".voucher-action").html("Change");
    toastSuccess("Voucher applied");
    closeModal();
    calculateTotal();
}

function resetVoucher() {
    VOUCHER = false;
    $(".reward--list .reward--item.active").removeClass("active");
    $(".voucher-info").html((VOUCHERS.length > 0 ? "You have " + addCommas(VOUCHERS.length) + " voucher" : "You have no available voucher"));
    $(".voucher-action").html("Use");
    calculateTotal();
}

function resetPayment() {
    if ($("#form_checkout input[name=pay_point]").is(":checked")) {
        $("#form_checkout input[name=pay_point]").prop("checked", false);
    } else if ($("#form_checkout input[name=payment_method]").is(":checked")) {
        $("#form_checkout input[name=payment_method]:checked").prop("checked", false);
    }
    $(".payment--list .payment--card.active").removeClass("active");
    $(".payment-method").html("No method selected");
    $(".payment-method-info").html("");
}

function setAvailableMethod() {
    if (!IS_B2B) {
        if (POINT >= GRANDTOTAL) {
            $(".method-point .pay-point").html(numdec(Math.ceil(GRANDTOTAL * POINT_DIVIDER)));
            $(".method-point .pay-point-amount").html('<small class="text-gray">' + CURRENCY_SYMBOL + '</small>' + numdec(GRANDTOTAL));
            $(".method-point").removeClass("hidden");
        } else if (POINT > 0) {
            $(".method-point-partial .pay-point").html(numdec(Math.ceil(POINT * POINT_DIVIDER)));
            $(".method-point-partial .pay-point-amount").html('<small class="text-gray">' + CURRENCY_SYMBOL + '</small>' + numdec(POINT));
            $(".method-point-partial").removeClass("hidden");
        }
        if (POINT_DIVIDER === 1) {
            $(".method-point .pay-point-amount, .method-point-partial .pay-point-amount").html("");
        }
    } else {
        $(".pay-point-amount").html("");
        $(".pay-point").html("0");
        $(".method-point, .method-point-partial").addClass("hidden");
    }
    if (GRANDTOTAL > MAX_TOTAL) {
        $(".payment--card.maximum-payment").addClass("hidden");
    } else {
        $(".payment--card.maximum-payment").removeClass("hidden");
    }
    if (GRANDTOTAL < MIN_TOTAL) {
        $(".payment--card.minimum-payment").addClass("hidden");
    } else {
        $(".payment--card.minimum-payment").removeClass("hidden");
    }
    if (!inArray(CURRENCY, ["IDR"])) {
        $("#form_checkout .payment--card:not(.intern-payment), #form_checkout .payment--card-parent:not(.intern-payment)").addClass("hidden");
    }
}

function setPaymentMinMax() {
    var proceed = true;
    if (GRANDTOTAL > MAX_TOTAL) {
        $(".payment--card.maximum-payment").addClass("hidden");
        if ($("#form_checkout .payment--card.maximum-payment input").is(":checked")) {
            $("#form_checkout .payment--card.maximum-payment input:checked").prop("checked", false);
            proceed = false;
        }
    } else {
        $(".payment--card.maximum-payment").removeClass("hidden");
    }
    if (GRANDTOTAL < MIN_TOTAL && !$("#form_checkout input[name=payment_method][value=point]").is(":checked")) {
        $(".payment--card.minimum-payment").addClass("hidden");
        if ($("#form_checkout .payment--card.minimum-payment input").is(":checked")) {
            $("#form_checkout .payment--card.minimum-payment input:checked").prop("checked", false);
            proceed = false;
        }
    } else {
        $(".payment--card.minimum-payment").removeClass("hidden");
    }
    if (!inArray(CURRENCY, ["IDR"])) {
        $("#form_checkout .payment--card:not(.intern-payment), #form_checkout .payment--card-parent:not(.intern-payment)").addClass("hidden");
    }
    if (!proceed) {
        $(".payment--list .payment--card.active").removeClass("active");
        $(".payment-method").html("No method selected");
        $(".payment-method-info").html("");
    }
}

function validPaymentMethod() {
    var proceed = true;
    if (POINT >= GRANDTOTAL && $("#form_checkout input[name=pay_point]").is(":checked")) {
        $("#form_checkout input[name=pay_point]").prop("checked", false);
        proceed = false;
    } else if (POINT < GRANDTOTAL && $("#form_checkout input[name=payment_method][value=point]").is(":checked")) {
        $("#form_checkout input[name=payment_method][value=point]").prop("checked", false);
        proceed = false;
    } else if (GRANDTOTAL > MAX_TOTAL && $("#form_checkout .payment--card.maximum-payment input").is(":checked")) {
        $("#form_checkout .payment--card.maximum-payment input:checked").prop("checked", false);
        proceed = false;
    } else if (GRANDTOTAL < MIN_TOTAL && $("#form_checkout .payment--card.minimum-payment input").is(":checked")) {
        $("#form_checkout .payment--card.minimum-payment input:checked").prop("checked", false);
        proceed = false;
    }
    if (!proceed) {
        $(".payment--list .payment--card.active").removeClass("active");
        $(".payment-method").html("No method selected");
        $(".payment-method-info").html("");
    }
    return proceed;
}

function calculateTotal() {
    if (!$(".method-point").hasClass("hidden")) {
        $(".method-point").addClass("hidden");
    }
    if (!$(".method-point-partial").hasClass("hidden")) {
        $(".method-point-partial").addClass("hidden");
    }
    if (!$(".summary-shipping-discount").hasClass("hidden")) {
        $(".summary-shipping-discount").addClass("hidden");
    }
    if (!$(".summary-coupon").hasClass("hidden")) {
        $(".summary-coupon").addClass("hidden");
    }
    if (!$(".summary-voucher").hasClass("hidden")) {
        $(".summary-voucher").addClass("hidden");
    }
    if (!$(".summary-point").hasClass("hidden")) {
        $(".summary-point").addClass("hidden");
    }
    $(".pay-point, .pay-point-amount").html("");
    $(".summary-shipping").html("");
    $(".summary-total").html("0");

    var shipping = 0;
    var voucher = 0;
    var coupon = 0;
    var point = POINT;
    var subtotal = SUBTOTAL;
    if (COURIER_SERVICE) {
        if (COURIER_SERVICE.discount > 0) {
            $(".summary-shipping-discount").html('<small class="text-gray">' + CURRENCY_SYMBOL + '</small>' + numdec(COURIER_SERVICE.cost_display));
            $(".summary-shipping-discount").removeClass("hidden");
        }
        shipping = parseFloat(COURIER_SERVICE.amount_display);
        shipping = (shipping > 0 ? shipping : 0);
        if (shipping > 0) {
            subtotal += shipping;
            $(".summary-shipping").html('<small class="text-gray">' + CURRENCY_SYMBOL + '</small>' + numdec(shipping));
        } else {
            $(".summary-shipping").html("Free!");
        }
    }
    if (VOUCHER) {
        VOUCHER.amount = 0;
        if (inArray(VOUCHER.type, ["shipping_percent", "shipping_amount"]) && COURIER_SERVICE) {
            if (VOUCHER.type === "shipping_percent") {
                VOUCHER.amount = parseFloat(shipping * (VOUCHER.value / 100));
            } else if (VOUCHER.type === "shipping_amount") {
                VOUCHER.amount = parseFloat(VOUCHER.value / CURRENCY_RATE);
            }
            if (VOUCHER.amount > shipping) {
                VOUCHER.amount = shipping;
            }
        } else if (inArray(VOUCHER.type, ["discount_percent", "discount_amount"])) {
            if (VOUCHER.type === "discount_percent") {
                VOUCHER.amount = parseFloat((subtotal - shipping) * (VOUCHER.value / 100));
            } else if (VOUCHER.type === "discount_amount") {
                VOUCHER.amount = parseFloat(VOUCHER.value / CURRENCY_RATE);
            }
            if (VOUCHER.amount > (subtotal - shipping)) {
                VOUCHER.amount = (subtotal - shipping);
            }
        } else if (inArray(VOUCHER.type, ["free_item"]) && VOUCHER.in_cart) {
            VOUCHER.amount = parseFloat(VOUCHER.price / CURRENCY_RATE);
            if (VOUCHER.amount > (subtotal - shipping)) {
                VOUCHER.amount = (subtotal - shipping);
            }
        }
        voucher = parseFloat(VOUCHER.amount);
        if (voucher > subtotal) {
            voucher = subtotal;
        }
        if (voucher > 0) {
            $(".summary-voucher h5").html('<small class="text-gray">' + CURRENCY_SYMBOL + '</small>' + numdec(voucher));
            $(".summary-voucher").removeClass("hidden");
        }
    }
    if (COUPON) {
        COUPON.amount = 0;
        if (inArray(COUPON.type, ["shipping_percent", "shipping_amount"]) && COURIER_SERVICE) {
            if (COUPON.type === "shipping_percent") {
                COUPON.amount = parseFloat(shipping * (COUPON.value / 100));
            } else if (COUPON.type === "shipping_amount") {
                COUPON.amount = parseFloat(COUPON.value / CURRENCY_RATE);
            }
            if (COUPON.amount > shipping) {
                COUPON.amount = shipping;
            }
        } else if (inArray(COUPON.type, ["discount_percent", "discount_amount"])) {
            if (COUPON.type === "discount_percent") {
                COUPON.amount = parseFloat((subtotal - shipping) * (COUPON.value / 100));
            } else if (COUPON.type === "discount_amount") {
                COUPON.amount = parseFloat(COUPON.value / CURRENCY_RATE);
            }
            if (COUPON.amount > (subtotal - shipping)) {
                COUPON.amount = (subtotal - shipping);
            }
        }
        coupon = parseFloat(COUPON.amount);
        if (coupon > subtotal) {
            coupon = subtotal;
        }
        subtotal -= coupon;
        if (coupon > 0) {
            $(".summary-coupon h5").html('<small class="text-gray">' + CURRENCY_SYMBOL + '</small>' + numdec(coupon));
            $(".summary-coupon").removeClass("hidden");
        }
    }
    GRANDTOTAL = ((SUBTOTAL + shipping) - (coupon + voucher));

    if (GRANDTOTAL <= 0) {
        $(".card--payment").addClass("hidden");
        resetPayment();
        return 0;
    }
    $(".card--payment").removeClass("hidden");
    setAvailableMethod();

    if (!validPaymentMethod()) {
        calculateTotal();
        return 0;
    }

    if ($("#form_checkout input[name=pay_point]").is(":checked")) {
        if (POINT > GRANDTOTAL) {
            point = GRANDTOTAL;
        }
        GRANDTOTAL -= point;
        $(".summary-point .pay-point").html(numdec(Math.ceil(point * POINT_DIVIDER)));
        $(".summary-point .pay-point-amount").html('<small class="text-gray">' + CURRENCY_SYMBOL + '</small>' + numdec(point));
    } else if ($("#form_checkout input[name=payment_method][value=point]").is(":checked")) {
        if (POINT > GRANDTOTAL) {
            point = GRANDTOTAL;
        }
        GRANDTOTAL -= point;
        $(".summary-point .pay-point").html(numdec(Math.ceil(point * POINT_DIVIDER)));
        $(".summary-point .pay-point-amount").html('<small class="text-gray">' + CURRENCY_SYMBOL + '</small>' + numdec(point));
    }
    if (($("#form_checkout input[name=pay_point]").is(":checked") || $("#form_checkout input[name=payment_method][value=point]").is(":checked")) && point) {
        if (POINT_DIVIDER > 1) {
            $(".summary-point h5").html('<span class="text-gray me-2">(' + numdec(Math.ceil(point * POINT_DIVIDER)) + '<sup class="text-gray">pts</sup>)</span><small class="text-gray">' + CURRENCY_SYMBOL + '</small>' + numdec(point));
        } else {
            $(".summary-point h5").html(numdec(Math.ceil(point * POINT_DIVIDER)) + '<sup class="text-gray">pts</sup>');
        }
        $(".summary-point").removeClass("hidden");
    }

    setPaymentMinMax();

    if (GRANDTOTAL > 0) {
        $(".summary-total").html(numdec(GRANDTOTAL));
    }
    return GRANDTOTAL;
}

function validateCheckout() {
    var shipment_option = "regular";
    if ($("#form_checkout input[name=shipment_option]").length) {
        if (!$("#form_checkout input[name=shipment_option]").is(":checked")) {
            swal(
                'Warning',
                'Please choose shipping option!',
                'warning'
            );
            return false;
        }
        shipment_option = $("#form_checkout input[name=shipment_option]:checked").val();
        if (shipment_option === "regular" && (!$("#form_checkout input[name=address_id]").length || ($("#form_checkout input[name=address_id]").length && parseInt($("#form_checkout input[name=address_id]").val()) <= 0))) {
            swal(
                'Warning',
                "There's no selected address.\nPlease choose or input address!",
                'warning'
            );
            return false;
        }
    }
    if ($("#form_checkout input[name=dropship]").length && $("#form_checkout input[name=dropship]").is(":checked") && $("#form_checkout input[name=dropship_name]").val() === "") {
        swal(
            'Warning',
            'Please input Dropshipper Name!',
            'warning'
        );
        return false;
    }
    if (shipment_option === "regular" && !COURIER_SERVICE) {
        swal(
            'Warning',
            "There's no selected shipping method.\nPlease choose one of shipping service option!",
            'warning'
        );
        return false;
    }
    if (GRANDTOTAL > 0 && !$("#form_checkout input[name=payment_method]").is(":checked")) {
        swal(
            'Warning',
            "There's no selected payment method.\nPlease choose one of payment method option!",
            'warning'
        );
        return false;
    }
    if ($("#form_checkout input[name=payment_method]").is(":checked") && $("#form_checkout input[name=payment_method]:checked").val() === "point" && POINT < GRANDTOTAL) {
        swal(
            'Warning',
            'Your point is not enough to pay this order!',
            'warning'
        );
        return false;
    }
    if ($("#form_checkout input[name=pay_point]").is(":checked") && POINT <= 0) {
        swal(
            'Warning',
            'You have no point to use!',
            'warning'
        );
        return false;
    }
    return true;
}

function submitCheckout() {
    if (validateCheckout()) {
        var string = $("#form_checkout").serialize();
        if (COURIER_SERVICE) {
            string += "&shipment_id=" + COURIER_SERVICE.id;
            string += "&shipment_code=" + COURIER_SERVICE.code;
            string += "&shipment_service_code=" + COURIER_SERVICE.service_code;
            string += "&shipment_service=" + COURIER_SERVICE.service;
            string += "&shipment_etd=" + COURIER_SERVICE.etd;
            string += "&shipment_cost=" + COURIER_SERVICE.cost;
            string += "&shipment_discount=" + COURIER_SERVICE.discount;
            string += "&shipment_amount=" + COURIER_SERVICE.amount;
        }
        if (VOUCHER) {
            string += "&voucher_id=" + VOUCHER.id;
            string += "&voucher_code=" + VOUCHER.code;
        }
        if (COUPON) {
            string += "&coupon_id=" + COUPON.id;
            string += "&coupon_code=" + COUPON.code;
        }
        $.ajax({
            type: "POST",
            url: site_url + "web/order_save",
            data: string,
            cache: false,
            dataType: "json",
            beforeSend: function () {
                loading_open();
            },
            success: function (json) {
                if (json.status) {
                    swal({
                        title: "Redirecting Page",
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
}

function openPayment() {
    if (inArray(PAYMENT_TYPE, ["cc", "va", "qris"])) {
        openMidtrans();
    } else if (inArray(PAYMENT_TYPE, ["kredivo"])) {
        openKredivo();
    }
}

function openMidtrans() {
    var string = $("#form_payment").serialize();
    $.ajax({
        type: "POST",
        url: site_url + "midtrans/snap/token_order",
        data: string,
        cache: false,
        dataType: "json",
        beforeSend: function () {
            $("#form_payment button.button-checkout").attr("disabled", true);
            loading_open();
        },
        success: function (json) {
            if (json.status) {
                $("#form_payment input[name=tx_id]").val(json.tx_id);
                window.history.pushState({}, document.title, site_url + "order-payment/" + json.tx_id);
                snap.pay(json.token, {
                    onSuccess: function (result) {
                        $("#form_payment input[name=result_type]").val("success");
                        $("#form_payment input[name=result_data]").val(JSON.stringify(result));
                        midtransSave();
                    },
                    onPending: function (result) {
                        if (inArray(result.payment_type, ["qris", "shopeepay", "gopay", "credit_card"])) {
                            midtransCancel(result.transaction_id);
                        } else {
                            $("#form_payment input[name=result_type]").val("pending");
                            $("#form_payment input[name=result_data]").val(JSON.stringify(result));
                            midtransSave();
                        }
                    },
                    onError: function (result) {
                        swal(
                            'Error',
                            ((result.status_message && result.status_message[0]) ? result.status_message[0] : 'Request failed!'),
                            'error'
                        );
                    },
                    onClose: function () {
                        swal({
                                title: "Confirmation",
                                text: "Do you really want to cancel your transaction?",
                                type: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#42352e",
                                cancelButtonText: "No",
                                confirmButtonText: "Yes",
                                closeOnConfirm: false
                            },
                            function (isConfirm) {
                                swal.close();
                                if (!isConfirm) {
                                    openMidtrans();
                                }
                            });
                    }
                });
            } else {
                swal(
                    'Error',
                    json.message,
                    'error'
                );
            }
        },
        complete: function () {
            $("#form_payment button.button-checkout").removeAttr("disabled");
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

function midtransSave() {
    var string = $("#form_payment").serialize();
    $.ajax({
        type: "POST",
        url: site_url + "web/order_midtrans_save",
        data: string,
        cache: false,
        dataType: 'json',
        beforeSend: function () {
            swal({
                title: "Processing Request",
                text: "Please Wait . . .",
                type: "info",
                showCancelButton: false,
                showConfirmButton: false
            });
        },
        success: function (json) {
            if (json.status) {
                swal({
                    title: "Redirecting Page",
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
        error: function (xhr, status, error) {
            swal(
                'Error',
                error,
                'error'
            );
        }
    });
}

function midtransCancel(str) {
    var string = $("#form_payment").serialize();
    string += "&transaction_id=" + str;
    $.ajax({
        type: "POST",
        url: site_url + "midtrans/snap/cancel_order",
        data: string,
        cache: false,
        dataType: "json",
        beforeSend: function () {
            swal({
                title: "Processing Request",
                text: "Please Wait . . .",
                type: "info",
                showCancelButton: false,
                showConfirmButton: false
            });
        },
        success: function (json) {
            if (json.status) {
                swal.close();
            } else {
                swal(
                    'Error',
                    json.message,
                    'error'
                );
            }
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

function openKredivo() {
    var string = $("#form_payment").serialize();
    $.ajax({
        type: "POST",
        url: site_url + "kredivo/charge/snap",
        data: string,
        cache: false,
        dataType: "json",
        beforeSend: function () {
            $("#form_payment button.button-checkout").attr("disabled", true);
            loading_open();
        },
        success: function (json) {
            if (json.status) {
                docBlur();
                $("#form_dialog .modal-dialog").html(json.data);
                $("#form_dialog").modal("show");
                $("body").addClass("form-dialog");
            } else {
                swal(
                    'Error',
                    json.message,
                    'error'
                );
            }
        },
        complete: function () {
            $("#form_payment button.button-checkout").removeAttr("disabled");
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

function kredivoSave(str) {
    if (str) {
        closeModal();
        var string = $("#form_payment").serialize();
        string += "&kredivo=" + str;
        $.ajax({
            type: "POST",
            url: site_url + "kredivo/charge/checkout",
            data: string,
            cache: false,
            dataType: 'json',
            beforeSend: function () {
                swal({
                    title: "Processing Request",
                    text: "Please Wait . . .",
                    type: "info",
                    showCancelButton: false,
                    showConfirmButton: false
                });
            },
            success: function (json) {
                if (json.status) {
                    swal({
                        title: "Redirecting Page",
                        text: "Please Wait . . .",
                        type: "info",
                        showCancelButton: false,
                        showConfirmButton: false
                    });
                    setTimeout(function () {
                        location.replace(json.url);
                    }, 1000);
                } else {
                    swal(
                        'Error',
                        json.message,
                        'error'
                    );
                }
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

function submitReceipt() {
    if (fieldValidate("#form_receipt")) {
        if (!$("#form_receipt input[name=userfile]").val()) {
            swal(
                'Warning',
                'Please upload your payment receipt file!',
                'warning'
            );
            return false;
        }
        $("#form_receipt input[type=submit]").click();
    }
}
