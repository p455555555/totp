import * as crypto from 'crypto';
import * as qr from 'qr-image';
import * as base32 from 'thirty-two';

const DIGIT = 6; // 生成密码位数

interface VerifyReturn {
	status: boolean;
	delta?: number ;
}

/**
 * int转换为byte
 * @param {Integer} data 8字节整数
 * @return {Array} bytes int8Array
 */
const intToBytes = (data: number) => {
	const bytes: number[] = [];
	let num = data;

	for (let i = 7; i >= 0; --i) {
		bytes[i] = num & 255; // AND运算截取1字节数据存入数组中
		num = num >> 8; // 位移至下一个字节
	}

	return bytes;
}

/**
 * hex转换为byte
 * @param {Integer} data 16进制字符串
 * @return {Array} bytes int8Array
 */
const hexToBytes = (data: string) => {
	const bytes: number[] = [];
	const hex: string = data;

	for (let i = 0, l = hex.length; i < l; i += 2) {
		bytes.push(parseInt(hex.substr(i, 2), 16));
	}

	return bytes;
}

/**
 * 转换时间为移动因子
 * T = (Current Unix time - T0) / X
 * @return {Number} count
 */
const getCount = () => {
	const time: number = Date.now();
	const windowTime = 30; // 密码有效期(s)

	return Math.floor((time / 1000) / windowTime);
}

/**
 * TOPT 动态密码模块
 */
export const totp = {

	/**
	 * 生成app可识别二维码链接
	 * @param {String} key 密钥
	 * @return {String} uri
	 */
	getQRCode: (key: string) => {
		const encoded: string = base32.encode(key);
		const encodedForApp = encoded.toString().replace(/=/g, '');
		const uri = `otpauth://totp/somelabel?secret=${encodedForApp}`; // 生成链接用于二维码识别
		const code = qr.image(uri, { type: 'png' });

		return code;
	},

	/**
	 * HOTP 算法实现
	 * HOTP(K,C) = Truncate(HMAC-SHA-1(K,C)) 
	 * PWD(K,C,digit) = HOTP(K,C) mod 10^Digit
	 * @param {String} key 160位密钥
	 * @param {Integer} count 移动因子
	 * @return {String}
	*/
	hotp: (key: string, count: number) => {
		const c: Buffer = Buffer.from(intToBytes(count)); // 移动因子
		const hmac = crypto.createHmac('sha1', Buffer.from(key)); // HSA1加密
		const hex: string = hmac.update(c).digest('hex'); // 获取加密后的16进制字符串(20字节)
		// Truncate 截断函数
		const stringArray = hexToBytes(hex); // 获取hex字符串的int8Array
		const offset = stringArray[19] & 15; // 选取最后一个字节的低字节位4位的整数值作为偏移量
		// 从指定偏移位开始，连续截取 4 个字节（32 位），最后返回 32 位中的后面 31 位
		const p = (stringArray[offset] & 127) << 24 |
			(stringArray[offset + 1] & 255) << 16 |
			(stringArray[offset + 2] & 255) << 8 |
			(stringArray[offset + 3] & 255);
		const result = (p % Math.pow(10, DIGIT)).toString();

		return result;
	},

	/**
	 * HOTP 密码效验
	 * @param {String} code 6位动态密码
	 * @param {String} key 160位密钥
	 * @param {Integer} count 移动因子
	 * @return {Object} 
	 * status 效验结果
	 * delta 偏移量
	 */
	hotpVerify: (code: string, key: string, count: number): VerifyReturn => {
		const times = 2; // 允许误差2分钟

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
	},

	/**
	 * TOTP 算法实现
	 * TOTP = HOTP(K, T) 
	 * @param {String} key 160位密钥
	 * @return {String}
	*/
	totp: (key: string) => {
		const count = getCount();
		const code: string = totp.hotp(key, count);

		return code;
	},

	/**
	 * TOTP 密码效验
	 * @return {Object}
	 */
	totpVerify: (code: string, key: string): VerifyReturn => {
		return totp.hotpVerify(code, key, getCount());
	}
}
