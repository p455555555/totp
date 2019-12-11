"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Util {
    static stringToBytes(str) {
        const bytes = [];
        for (let i = 0; i < str.length; i++) {
            bytes.push(str.charCodeAt(i));
        }
        return bytes;
    }
    static bytesToString(bytes) {
        const str = [];
        for (let i = 0; i < bytes.length; i++) {
            str.push(String.fromCharCode(bytes[i]));
        }
        return str.join('');
    }
    static stringToWords(str) {
        const words = [];
        for (let c = 0, b = 0; c < str.length; c++, b += 8) {
            words[b >>> 5] |= str.charCodeAt(c) << (24 - b % 32);
        }
        return words;
    }
    static bytesToWords(bytes) {
        const words = [];
        for (let i = 0, b = 0; i < bytes.length; i++, b += 8) {
            words[b >>> 5] |= bytes[i] << (24 - b % 32);
        }
        return words;
    }
    static wordsToBytes(words) {
        const bytes = [];
        for (let b = 0; b < words.length * 32; b += 8) {
            bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
        }
        return bytes;
    }
    static intToBytes(n) {
        const bytes = [];
        let num = n;
        for (let i = 7; i >= 0; --i) {
            bytes[i] = num & 255;
            num = num >> 8;
        }
        return bytes;
    }
    static bytesToHex(bytes) {
        const hex = [];
        for (let i = 0; i < bytes.length; i++) {
            hex.push((bytes[i] >>> 4).toString(16));
            hex.push((bytes[i] & 0xF).toString(16));
        }
        return hex.join('');
    }
    static hexToBytes(hex) {
        const bytes = [];
        for (let c = 0; c < hex.length; c += 2) {
            bytes.push(parseInt(hex.substr(c, 2), 16));
        }
        return bytes;
    }
    static bytesToBase32(bytes) {
        const base32 = [];
        let overflow;
        for (let i = 0; i < bytes.length; i++) {
            switch (i % 5) {
                case 0:
                    base32.push(this.base32map.charAt(bytes[i] >>> 3));
                    overflow = (bytes[i] & 0x7) << 2;
                    break;
                case 1:
                    base32.push(this.base32map.charAt(overflow | (bytes[i] >>> 6)));
                    base32.push(this.base32map.charAt((bytes[i] >>> 1) & 0x1F));
                    overflow = (bytes[i] & 0x1) << 4;
                    break;
                case 2:
                    base32.push(this.base32map.charAt(overflow | (bytes[i] >>> 4)));
                    overflow = (bytes[i] & 0xF) << 1;
                    break;
                case 3:
                    base32.push(this.base32map.charAt(overflow | (bytes[i] >>> 7)));
                    base32.push(this.base32map.charAt((bytes[i] >>> 2) & 0x1F));
                    overflow = (bytes[i] & 0x3) << 3;
                    break;
                case 4:
                    base32.push(this.base32map.charAt(overflow | (bytes[i] >>> 5)));
                    base32.push(this.base32map.charAt(bytes[i] & 0x1F));
                    overflow = -1;
                    break;
            }
        }
        if (overflow !== void 0 && overflow !== -1) {
            base32.push(this.base32map.charAt(overflow));
        }
        while (base32.length % 8 != 0) {
            base32.push('=');
        }
        return base32.join('');
    }
}
exports.default = Util;
Util.base32map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
//# sourceMappingURL=util.js.map