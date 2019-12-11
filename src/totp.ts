import util from './util';
import crypto from './cypto';

const DIGIT = 6; // 生成密码位数

interface VerifyReturn {
	status: boolean;
	delta?: number ;
}

/**
 * TOPT 动态密码模块
 */
export default class totp {

	/**
	 * 生成app可识别二维码链接
	 * @param {String} key 密钥
	 * @return {String} uri
	 */
	public static getQRUri(key: string) {
		const encoded: string = util.bytesToBase32(util.stringToBytes(key));
		const encodedForApp = encoded.toString().replace(/=/g, '');
		const uri = `otpauth://totp/somelabel?secret=${encodedForApp}`; // 生成链接用于二维码识别

		return uri;
	}

	/**
	 * HOTP 算法实现
	 * HOTP(K,C) = Truncate(HMAC-SHA-1(K,C)) 
	 * PWD(K,C,digit) = HOTP(K,C) mod 10^Digit
	 * @param {String} key 160位密钥
	 * @param {Integer} count 移动因子
	 * @return {String}
	*/
	public static hotp(key: string, count: number) {
		const stringArray = crypto.hmac(count, key); // HSA1加密
		// Truncate 截断函数
		const offset = stringArray[19] & 15; // 选取最后一个字节的低字节位4位的整数值作为偏移量
		// 从指定偏移位开始，连续截取 4 个字节（32 位），最后返回 32 位中的后面 31 位
		const p = (stringArray[offset] & 127) << 24 |
			(stringArray[offset + 1] & 255) << 16 |
			(stringArray[offset + 2] & 255) << 8 |
			(stringArray[offset + 3] & 255);
		const result = (p % Math.pow(10, DIGIT)).toString();

		return result;
	}

	/**
	 * HOTP 密码效验
	 * @param {String} code 6位动态密码
	 * @param {String} key 160位密钥
	 * @param {Integer} count 移动因子
	 * @return {Object} 
	 * status 效验结果
	 * delta 偏移量
	 */
	public static hotpVerify(code: string, key: string, count: number): VerifyReturn {
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
	}

	/**
	 * TOTP 算法实现
	 * TOTP = HOTP(K, T) 
	 * @param {String} key 160位密钥
	 * @return {String}
	*/
	public static totp(key: string) {
		const count = this.getCount();
		const code: string = totp.hotp(key, count);

		return code;
	}

	/**
	 * TOTP 密码效验
	 * @return {Object}
	 */
	public static totpVerify(code: string, key: string): VerifyReturn {
		return totp.hotpVerify(code, key, this.getCount());
	}

	/**
	 * 转换时间为移动因子
	 * T = (Current Unix time - T0) / X
	 * @return {Number} count
	 */
	private static getCount () {
		const time: number = Date.now();
		const windowTime = 30; // 密码有效期(s)

		return Math.floor((time / 1000) / windowTime);
	}
}
