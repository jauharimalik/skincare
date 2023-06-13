$(document).ready(function () {
});

function addToPlan(_item) {
    if (_item) {
        if (!IS_LOGIN) {
            if (!$("#offcanvasLogin").hasClass("show")) {
                var myOffcanvas = document.getElementById("offcanvasLogin");
                var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);
                bsOffcanvas.show();
            }
            return false;
        }
        $(_item + " .span-quantity").addClass("hidden");
        if ($(_item + " .variant-selection").length && !$(_item + " .variant-selection.active").length) {
            swal(
                'Warning',
                'Please choose variant!',
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
        string += "&item=" + _item;
        $.ajax({
            type: "POST",
            url: site_url + "web/plan",
            data: string,
            cache: false,
            dataType: "json",
            beforeSend: function () {
                loading_open();
            },
            success: function (json) {
                if (json.status) {
                    $("#modalPlan .modal-dialog").html(json.data);
                    $("#modalPlan").modal("show");
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
            }
        });
    }
}

function planAdd(_item) {
    if (_item) {
        $("#modalPlan").addClass("hidden");
        $("#modalPlanCreate").modal("show");
    }
}

function closePlanAdd(_item) {
    if (_item) {
        $("#modalPlanCreate").modal("hide");
        $("#modalPlan").removeClass("hidden");
    }
}

function planSave(_item) {
    if (_item) {
        var product_id = $(_item).attr("product");
        var quantity = $(_item + " input.input-quantity").val();
        var string = "product_id=" + product_id + "&quantity=" + quantity;
        if ($(_item + " .variant-selection.active").length) {
            var row = JSON.parse($(_item + " .variant-selection.active").attr("data"));
            string += "&variant_id=" + row.id;
        }
        if (fieldValidate("#form_plan")) {
            string += "&" + $("#form_plan").serialize();
            $.ajax({
                type: "POST",
                url: site_url + "web/plan_save",
                data: string,
                cache: false,
                dataType: "json",
                beforeSend: function () {
                    loading_open();
                },
                success: function (json) {
                    if (json.status) {
                        docBlur();
                        $("#modalPlanCreate .modal-dialog").html("");
                        $("#modalPlanCreate").modal("hide");
                        planDetail(json.id);
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
                }
            });
        }
    }
}

function planUpdate(_item) {
    if (_item) {
        if ($("#form_query input[name=plan_id]").length && !$("#form_query input[name=plan_id]").is(":checked")) {
            swal(
                'Warning',
                'Please choose plan!',
                'warning'
            );
            return false;
        }
        if (fieldValidate("#form_query")) {
            var string = $("#form_query").serialize();
            $.ajax({
                type: "POST",
                url: site_url + "web/plan_update",
                data: string,
                cache: false,
                dataType: "json",
                beforeSend: function () {
                    loading_open();
                },
                success: function (json) {
                    if (json.status) {
                        planDetail(json.id);
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
                }
            });
        }
    }
}

function planDetail(str) {
    if (str) {
        var string = "id=" + str;
        $.ajax({
            type: "POST",
            url: site_url + "web/plan_detail",
            data: string,
            cache: false,
            beforeSend: function () {
                loading_open();
            },
            success: function (data) {
                $("#modalPlan .modal-dialog").html(data);
                $("#modalPlan").modal("show");
                $("body").addClass("plan-dialog");
            },
            complete: function () {
                loading_close();
            }
        });
    }
}

function changePlan(e) {
    var _price = parseFloat($("#form_query input[name=price]").val());
    var _quantity = parseInt($("#form_query input[name=quantity]").val());
    if ($("#form_query input[name=plan_id]").is(":checked")) {
        var _discount_percent = parseFloat($("#form_query input[name=plan_id]:checked").attr("discount"));
        var _discount = parseFloat(_price * (_discount_percent / 100));
        var _subtotal = parseFloat(_price - _discount);
        var _total = parseFloat(((_price - _discount) * _quantity));
        $(".selected-plan .product-plan-price").html(numdec(_subtotal));
        $(".selected-plan .product-plan-total").html(numdec(_total));
        if (_discount_percent > 0) {
            $(".selected-plan .product-plan-discount span").html(numdec(_price));
            $(".selected-plan .product-plan-discount").removeClass("hidden");
        }
    } else {
        $(".selected-plan .product-plan-price").html(numdec(_price));
        $(".selected-plan .product-plan-total").html(numdec(_price * _quantity));
        $(".selected-plan .product-plan-discount span").html("");
        $(".selected-plan .product-plan-discount").addClass("hidden");
    }
}

function submitPlanCheckout() {
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
            url: site_url + "web/plan_order_save",
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

function planEdit(str) {
    if (str) {
        var string = "id=" + str;
        $.ajax({
            type: "POST",
            url: site_url + "web/account/plan_edit",
            data: string,
            cache: false,
            beforeSend: function () {
                loading_open();
            },
            success: function (data) {
                $("#modalPlan .modal-dialog").html(data);
                $("#modalPlan").modal("show");
                $("body").addClass("plan-dialog");
            },
            complete: function () {
                loading_close();
            }
        });
    }
}

function planActive(str) {
    if (str) {
        swal({
                title: "Confirmation",
                text: "<strong>Are you sure want to activate the plan?</strong><br/>Once you activate, you will receive the product nor monthly bills",
                type: "warning",
                html: true,
                showCancelButton: true,
                confirmButtonColor: "#42352e",
                cancelButtonText: "No, Take Me Back",
                confirmButtonText: "Yes, Continue",
                closeOnConfirm: false
            },
            function () {
                var string = "id=" + str + "&status=1";
                var proceed = saveData("web/account/plan_status", string);
                if (proceed) {
                    if (proceed.status) {
                        swal.close();
                        toastSuccess(proceed.message);
                        location.reload();
                    } else {
                        toastError(proceed.message);
                    }
                }
            });
    }
}

function planNonActive(str) {
    if (str) {
        swal({
                title: "Confirmation",
                text: "<strong>Are you sure want to stop the plan?</strong><br/>Once you stop, you will not receive the product nor monthly bills",
                type: "warning",
                html: true,
                showCancelButton: true,
                confirmButtonColor: "#42352e",
                cancelButtonText: "No, Take Me Back",
                confirmButtonText: "Yes, Stop The Plan",
                closeOnConfirm: false
            },
            function () {
                var string = "id=" + str + "&status=9";
                var proceed = saveData("web/account/plan_status", string);
                if (proceed) {
                    if (proceed.status) {
                        swal.close();
                        toastSuccess(proceed.message);
                        location.reload();
                    } else {
                        toastError(proceed.message);
                    }
                }
            });
    }
}

function planProductRemove(str) {
    if (str) {
        if ($(".product-plan-" + str).hasClass("deleted")) {
            $(".product-plan-" + str).removeClass("deleted");
            $(".product-plan-" + str + " .plan-input").removeAttr("disabled");
            $(".product-plan-" + str + " .plan-product-remove").html('<i class="fa fa-trash text-danger"></i>');
        } else {
            $(".product-plan-" + str).addClass("deleted");
            $(".product-plan-" + str + " .plan-input").attr("disabled", true);
            $(".product-plan-" + str + " .plan-product-remove").html('<i class="fa fa-times text-danger"></i>');
        }
    }
}

function planSaveChange() {
    if (fieldValidate("#form_plan")) {
        var product_ids = [];
        if ($("#form_plan tr.product-plan-list").length) {
            $("#form_plan tr.product-plan-list").each(function (index, row) {
                if ($(row).hasClass("deleted")) {
                    product_ids.push($(row).attr("data"));
                }
            });
        }
        var string = $("#form_plan").serialize();
        if (product_ids.length) {
            string += "&product_ids=" + product_ids.join(",");
        }
        $.ajax({
            type: "POST",
            url: site_url + "web/account/plan_save",
            data: string,
            cache: false,
            dataType: "json",
            beforeSend: function () {
                loading_open();
            },
            success: function (json) {
                if (json.status) {
                    location.reload();
                    toastSuccess(json.message);
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
            }
        });
    }
}
