(function ($) {
    var form = $("#signup-form");
    form.validate({
        errorPlacement: function errorPlacement(error, element) {
            element.after(error);
        },
        ignore: ".ignore",
        rules: {
            name: {
                minlength: 2,
                maxlength: 5,
                pattern: /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/
            },
            email: {
                email: true
            },
            stu_id: {
                digits: true,
                minlength: 13,
                maxlength: 13
            },
            phone: {
                pattern: /^(\+)?([0-9]{1,3}-)?[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
            },
            hiddenRecaptcha: {
                //required: true
            }
        },
        messages: {
            stu_id: {
                digits: ""
            }
        },
        onfocusout: function (element) {
            $(element).valid();
        }
    });
    form.children("div").steps({
        headerTag: "h3",
        bodyTag: "fieldset",
        transitionEffect: "fade",
        stepsOrientation: "vertical",
        titleTemplate:
            '<div class="title"><span class="step-number">#index#</span><span class="step-text">#title#</span></div>',
        labels: {
            previous: "上一步",
            next: "下一步",
            finish: "提交",
            current: ""
        },
        onStepChanging: function (event, currentIndex, newIndex) {
            var valid = true;
            if (currentIndex === 0) {
                form
                    .parent()
                    .parent()
                    .parent()
                    .append('<div class="footer footer-' + currentIndex + '"></div>');
            }
            if (currentIndex === 1) {
                form
                    .parent()
                    .parent()
                    .parent()
                    .find(".footer")
                    .removeClass("footer-0")
                    .addClass("footer-" + currentIndex + "");
            }
            if (currentIndex === 2) {
                form
                    .parent()
                    .parent()
                    .parent()
                    .find(".footer")
                    .removeClass("footer-1")
                    .addClass("footer-" + currentIndex + "");
            }
            if (currentIndex === 3) {
                form
                    .parent()
                    .parent()
                    .parent()
                    .find(".footer")
                    .removeClass("footer-2")
                    .addClass("footer-" + currentIndex + "");
            }
            if (currentIndex === 4) {
                form
                    .parent()
                    .parent()
                    .parent()
                    .find(".footer")
                    .removeClass("footer-3")
                    .addClass("footer-" + currentIndex + "");
            }
            if (currentIndex === 5) {
                form
                    .parent()
                    .parent()
                    .parent()
                    .find(".footer")
                    .removeClass("footer-4")
                    .addClass("footer-" + currentIndex + "");
            }
            form.validate().settings.ignore = ":disabled,:hidden";
            if (valid) {
                return form.valid();
            } else {
                //return form.invalid();
            }
        },
        onFinishing: function (event, currentIndex) {
            form.validate().settings.ignore = ":disabled";
            return form.valid();
        },
        onFinished: function (event, currentIndex) {
            $('[href="#finish"]').hide();
            $("#submit-loading").fadeIn();
            var postdata = {
                "g-recaptcha-response": grecaptcha.getResponse(captcha_widget),
                basic: {
                    name: $("#name").val(),
                    gender: $('input[type="radio"][name="gender"]:checked').val(),
                    email: $("#email").val(),
                    phone: $("#phone").val(),
                    college: $("#college").val(),
                    stu_id: $("#stu_id").val(),
                    direction: $('input[name="direction"]:checked').val()
                },
                knowledge: $("#knowledge").val(),
                experience: $("#experience").val(),
                plan: $("#plan").val()
            };
            grecaptcha.reset(captcha_widget)
            $.ajax({
                type: "POST",
                dataType: "json",
                url: "/register",
                data: JSON.stringify(postdata),
                contentType: "application/json;charset=UTF-8",
                success: function (data, textStatus) {
                    $("#submit-loading").hide();
                    var json = eval(data);
                    if (json["error"] == false) {
                        console.log("test");
                        $("#submit-error").hide();
                        $("#submit-success").fadeIn();
                    } else {
                        $('[href="#finish"]').fadeIn();
                        $("#submit-error").fadeIn();
                        $("#submit-error-desc").html(error2word(json.description))
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $("#submit-loading").hide();
                    $('[href="#finish"]').fadeIn();
                    $("#submit-error").html("Server Error")
                },
                complete: function () { }
            });
        },
        onStepChanged: function (event, currentIndex, priorIndex) {
            return true;
        }
    });

    jQuery.extend(jQuery.validator.messages, {
        required: "",
        remote: "",
        email: "",
        url: "",
        date: "",
        dateISO: "",
        number: "",
        digits: "",
        creditcard: "",
        equalTo: ""
    });

    var marginSlider = document.getElementById("slider-margin");
    if (marginSlider != undefined) {
        noUiSlider.create(marginSlider, {
            start: [1100],
            step: 100,
            connect: [true, false],
            tooltips: [true],
            range: {
                min: 100,
                max: 2000
            },
            pips: {
                mode: "values",
                values: [100, 2000],
                density: 4
            },
            format: wNumb({
                decimals: 0,
                thousand: "",
                prefix: "$ "
            })
        });
        var marginMin = document.getElementById("value-lower"),
            marginMax = document.getElementById("value-upper");

        marginSlider.noUiSlider.on("update", function (values, handle) {
            if (handle) {
                marginMax.innerHTML = values[handle];
            } else {
                marginMin.innerHTML = values[handle];
            }
        });
    }

    $("#panel-1-ctr").on("click", function () {
        $("#panel-2-ctr").removeClass("active");
        $(this).addClass("active");
        $("#panel-2").hide();
        $(".actions").fadeIn();
        $("#panel-1").fadeIn();
        return false;
    });
    $("#panel-2-ctr").on("click", function () {
        $("#panel-1-ctr").removeClass("active");
        $(this).addClass("active");
        $("#panel-1").hide();
        $(".actions").hide();
        $("#panel-2").fadeIn();
        return false;
    });

    $('#index-button').on("click", function () { 
        window.location='https://www.uestc.edu.cn'
        return false;
    });

    $("#query-button").on("click", function () {
        if (/^\d{13}$/.test($("#stu_id_lookup").val())) {
            $("#query-button").hide();
            $("#query_result").hide();
            $("#query_error").hide();
            $("#stu_id_lookup").addClass("valid");
            $("#stu_id_lookup").removeClass("error");
            $("#stu_id_lookup-error").hide();
            var postdata = {
                "g-recaptcha-response": grecaptcha.getResponse(captcha_widget_query),
                stu_id: $("#stu_id_lookup").val()
            };
            grecaptcha.reset(captcha_widget_query)
            $.ajax({
                type: "POST",
                dataType: "json",
                url: "/query",
                data: JSON.stringify(postdata),
                contentType: "application/json;charset=UTF-8",
                success: function (data, textStatus) {
                    $("#submit-loading").hide();
                    var json = eval(data);
                    if (json["error"] == false) {
                        $("#query_result").fadeIn();
                        $("#query_result_desc").html(direction2word(json["direction"]))
                        console.log(json["direction"]);
                    } else {
                        $("#query_error").fadeIn();
                        $("#query_error_desc").html(error2word(json["description"]))
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $("#query_error").fadeIn();
                    $("#submit-loading").hide();
                    $('[href="#finish"]').fadeIn();
                    $("#query_error").html("服务器错误")
                    $("#submit-error").html("服务器错误")
                },
                complete: function () {
                    $("#query-button").fadeIn()
                }
            });
        } else {
            $("#stu_id_lookup").removeClass("valid");
            $("#stu_id_lookup").addClass("error");
            $("#stu_id_lookup-error").fadeIn();
        }
        return false;
    });
})(jQuery);

function error2word(err) {
    switch(err){
        case "timeout-or-duplicate": return "请勿重复提交，否则请刷新页面后重试。";
        case "ENOENT": return "您还没有进行过提交哦。";
        case "invalid-input-response": return "请完成人机身份验证";
        case "Internal Server Error": return "内部服务器错误，请联系管理员";
        case "Mail Not Sent": return "提交成功，但未能成功通知管理员";
        default: return "未知错误"
    }
}

function direction2word(direction) {
    switch(direction) {
        case "ui": return "UI";
        case "frontend": return "前端";
        case "backend": return "后端";
        case "maintenance": return "运维";
        default: return "[数据删除]";
    }
}