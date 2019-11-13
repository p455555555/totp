"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const qr = require("qr-image");
const base32 = require("thirty-two");
const DIGIT = 6;
const intToBytes = (data) => {
    const bytes = [];
    let num = data;
    for (let i = 7; i >= 0; --i) {
        bytes[i] = num & 255;
        num = num >> 8;
    }
    return bytes;
};
const hexToBytes = (data) => {
    const bytes = [];
    const hex = data;
    for (let i = 0, l = hex.length; i < l; i += 2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    return bytes;
};
const getCount = () => {
    const time = Date.now();
    const windowTime = 30;
    return Math.floor((time / 1000) / windowTime);
};
exports.totp = {
    getQRCode: (key) => {
        const encoded = base32.encode(key);
        const encodedForApp = encoded.toString().replace(/=/g, '');
        const uri = `otpauth://totp/somelabel?secret=${encodedForApp}`;
        const code = qr.image(uri, { type: 'png' });
        return code;
    },
    hotp: (key, count) => {
        const c = Buffer.from(intToBytes(count));
        const hmac = crypto.createHmac('sha1', Buffer.from(key));
        const hex = hmac.update(c).digest('hex');
        const stringArray = hexToBytes(hex);
        const offset = stringArray[19] & 15;
        const p = (stringArray[offset] & 127) << 24 |
            (stringArray[offset + 1] & 255) << 16 |
            (stringArray[offset + 2] & 255) << 8 |
            (stringArray[offset + 3] & 255);
        const result = (p % Math.pow(10, DIGIT)).toString();
        return result;
    },
    hotpVerify: (code, key, count) => {
        const times = 2;
        for (let i = count - times; i <= count + times; i++) {
            const hotpCode = exports.totp.hotp(key, i);
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
    },
    totp: (key) => {
        const count = getCount();
        const code = exports.totp.hotp(key, count);
        return code;
    },
    totpVerify: (code, key) => {
        return exports.totp.hotpVerify(code, key, getCount());
    }
};
//# sourceMappingURL=totp.js.map