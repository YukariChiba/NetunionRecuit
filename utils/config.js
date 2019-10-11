try {
    var config = require("../config/site.json");
} catch (e) {
    if (e.code !== "MODULE_NOT_FOUND") {
        throw e;
    }
    var config = {
        grecaptcha: {
            public_token: process.env.grecaptcha_public_token,
            private_token: process.env.grecaptcha_private_token
        },
        "basic": {
            "site_name": process.env.baisc_site_name
        },
        "mail": {
            "smtp": {
                "server": process.env.mail_smtp_server,
                "port": process.env.mail_smtp_port,
                "account": process.env.mail_smtp_account,
                "pass": process.env.mail_smtp_pass,
            },
            "send_account": process.env.mail_send_account,
            "receive_account": process.env.mail_receive_account,
        }
    };
}

module.exports = config