"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../src/util");
const cypto_1 = require("../src/cypto");
const DIGIT = 6;
class totp {
    static getQRUri(key) {
        const encoded = util_1.default.bytesToBase32(util_1.default.stringToBytes(key));
        const encodedForApp = encoded.toString().replace(/=/g, '');
        const uri = `otpauth://totp/somelabel?secret=${encodedForApp}`;
        return uri;
    }
    static hotp(key, count) {
        const stringArray = cypto_1.default.hmac(count, key);
        const offset = stringArray[19] & 15;
        const p = (stringArray[offset] & 127) << 24 |
            (stringArray[offset + 1] & 255) << 16 |
            (stringArray[offset + 2] & 255) << 8 |
            (stringArray[offset + 3] & 255);
        const result = (p % Math.pow(10, DIGIT)).toString();
        return result;
    }
    static hotpVerify(code, key, count) {
        const times = 2;
        for (let i = count - times; i <= count + times; i++) {
            const hotpCode = totp.hotp(key, i);
            if (Number(hotpCode) === Number(code)) {
                return {
                    status: true,
                    delta: i - count
                };
            }
        }
        return {
            status: false
        };
    }
    static totp(key) {
        const count = this.getCount();
        const code = totp.hotp(key, count);
        return code;
    }
    static totpVerify(code, key) {
        return totp.hotpVerify(code, key, this.getCount());
    }
    static getCount() {
        const time = Date.now();
        const windowTime = 30;
        return Math.floor((time / 1000) / windowTime);
    }
}
exports.default = totp;
//# sourceMappingURL=totp.js.map