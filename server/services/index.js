var config = require('config');

exports.request_failure = function(req, res, name, type) {
    res.render("alter.html", {
        message: "错误的请求参数" + (!config.debug ? "" : name + ',' + type + ' url: ' + req.path)
    });
};

exports.request_preprocess = function(req, res) {
    var logined = req.session && req.session.login_user;
    if (req.workparam.logined && !logined) {
        res.render("alter.html", {
            location: "/",
            message: "登陆用户才能操作"
        });
        return false;
    }
    if (req.workparam.unlogined && logined) {
        res.render("alter.html", {
            message: "登陆用户无法操作"
        });
        return false;
    }
    if (logined) {
        if (req.workparam.role && req.session.login_user.role < req.workparam.role) {
            res.render("alter.html", {
                message: "当前用户角色无法操作"
            });
            return false;
        }
        res.locals.login_user = req.session.login_user;
    }

    res.locals.csrf = req.csrfToken();
    return true;
};