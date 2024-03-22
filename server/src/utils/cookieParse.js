"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function cookieParse(cookieHeader) {
    var cookies = cookieHeader.split(';');
    console.log(cookies);
}
cookieParse('deviceId=RZ8M42Z7H5P; app=com.android.insecurebankv2; pid=5014');
exports.default = cookieParse;
