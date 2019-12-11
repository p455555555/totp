/**
 * 工具类
 */
export default class Util {

    private static base32map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

	/**
     * string转换为byte
     */
	public static stringToBytes (str: string) {
        const bytes: number[] = [];
        
		for (let i = 0; i < str.length; i++) {
            bytes.push(str.charCodeAt(i));
        }
			
		return bytes;
	}

	/**
     * byte转换为string
     */
	public static bytesToString (bytes: number[]) {
        const str: string[] = [];
        
		for (let i = 0; i < bytes.length; i++){
            str.push(String.fromCharCode(bytes[i]));
        }

		return str.join('');
	}

    /**
     * string转换为big-endian 32-bit words
     */
	public static stringToWords (str: string) {
        const words: number[] = [];
        
		for (let c = 0, b = 0; c < str.length; c++, b += 8) {
            words[b >>> 5] |= str.charCodeAt(c) << (24 - b % 32);
        }
			
		return words;
	}

	/**
     * byte转换为big-endian 32-bit words
     */
	public static bytesToWords (bytes: number[]) {
        const words: number[] = [];
        
		for (let i = 0, b = 0; i < bytes.length; i++, b += 8) {
            words[b >>> 5] |= bytes[i] << (24 - b % 32);
        }
			
		return words;
	}

	/**
     * big-endian 32-bit words转换为byte
     */
	public static wordsToBytes (words: number[]) {
        const bytes: number[] = [];
        
		for (let b = 0; b < words.length * 32; b += 8) {
            bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
        }
			
		return bytes;
    }
    
    /**
     * int转换为byte
     */
    public static intToBytes (n: number) {
        const bytes: number[] = [];
        let num = n;

        for (let i = 7; i >= 0; --i) {
            bytes[i] = num & 255; // AND运算截取1字节数据存入数组中
            num = num >> 8; // 位移至下一个字节
        }

        return bytes;
    }

	/**
     * bytes转换为hex
     */
	public static bytesToHex (bytes: number[]) {
        const hex: string[] = [];
        
		for (let i = 0; i < bytes.length; i++) {
			hex.push((bytes[i] >>> 4).toString(16));
			hex.push((bytes[i] & 0xF).toString(16));
        }
        
		return hex.join('');
	}

	/**
     * hex转换为bytes
     */
	public static hexToBytes (hex: string) {
        const bytes: number[] = [];
        
		for (let c = 0; c < hex.length; c += 2) {
            bytes.push(parseInt(hex.substr(c, 2), 16));
        }

		return bytes;
    }  

	/**
     * bytes转换为base32
     */
	public static bytesToBase32 (bytes: number[]) {
        //   N      N     V      G      W     2     T      E
        // 01101|011 01|10101|0 0110|1011 0|11010|10 011|01000
        //     k          j         k         j         d

		const base32: string[] = [];
		let overflow: number;

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

		// 将剩余的字节编码
		if (overflow !== void 0 && overflow !== -1) {
            base32.push(this.base32map.charAt(overflow));
        }

		// 填充
		while (base32.length % 8 != 0) {
            base32.push('=');
        } 

		return base32.join('');
	}

}