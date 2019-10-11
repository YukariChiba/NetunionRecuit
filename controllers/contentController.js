var fs = require("fs");
var nodemailer = require("nodemailer");
var config = require("../config/site.json");
var markdown = require("markdown").markdown;
var form_data = require('../config/form_data.json');

exports.verify_captcha = (request, response, next) => {
    if (!request.recaptcha.error) {
        next();
    } else {
        response.send({
            error: true,
            description: request.recaptcha.error
        });
    }
};

exports.do_registration = (request, response) => {
    var json = JSON.stringify(request.body);
    fs.writeFile(
        "data/" + request.body["basic"]["stu_id"] + ".json",
        json,
        "utf8",
        function (err, data) {
            if (err) {
                response.send({
                    error: true,
                    description: "Internal Server Error"
                });
                return console.error(err);
            }
        }
    );
    var transporter = nodemailer.createTransport({
        pool: true,
        host: config.mail.smtp.server,
        port: config.mail.smtp.port,
        secure: true,
        auth: {
            user: config.mail.smtp.account,
            pass: config.mail.smtp.pass
        }
    });
    var mailOptions = {
        from: config.mail.send_account,
        to: config.mail.receive_account,
        subject: '新的报名请求！',
        html:  '<h1>' + request.body["basic"]["name"] + ' 申请 ' + direction2word(request.body["basic"]["direction"]) + '</h1>\
                <p>性别: ' + request.body["basic"]["gender"] + '</p>\
                <p>学号: ' + request.body["basic"]["stu_id"] + '</p>\
                <p>学院: ' + form_data.colleges[request.body["basic"]["college"]] + '</p>\
                <p>Email: ' + request.body["basic"]["email"] + '</p>\
                <p>电话: ' + request.body["basic"]["phone"] + '</p>\
                <h2>掌握/了解知识</h2><p>' + markdown.toHTML(request.body["knowledge"]) + '</p>\
                <h2>校内/项目经历</h2><p>' + markdown.toHTML(request.body["experience"]) + '</p>\
                <h2>爱好/评价/规划</h2><p>' + markdown.toHTML(request.body["plan"]) + '</p>'
    };
    response.send({
        error: false
    });
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log("Mail Send Error")
        } 
    });
};

exports.query_registration = (request, response) => {
    fs.readFile("data/" + request.body["stu_id"] + ".json", "utf8", function (
        err,
        data
    ) {
        if (err) {
            response.send({
                error: true,
                description: err.code
            });
            return console.error(err);
        } else {
            user_data = JSON.parse(data);
            response.send({
                error: false,
                direction: user_data.basic.direction
            });
        }
    });
};

function direction2word(direction) {
    switch(direction) {
        case "ui": return "UI";
        case "frontend": return "前端";
        case "backend": return "后端";
        case "maintenance": return "运维";
        default: return "[数据删除]";
    }
}