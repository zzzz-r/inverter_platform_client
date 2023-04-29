const {imageBaseURL} = require("@/config/config");

exports.install = function (Vue, options) {
    Vue.prototype.coverUrlWithPrefix = function (url){//全局函数
        return imageBaseURL+url
    };
    Vue.prototype.coverUrlWithoutPrefix = function (url){
        return (typeof url !== 'undefined')? url.substr(imageBaseURL.length, url.length):null
    };
};