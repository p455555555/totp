import util from '../src/util';
import cryptoLib from '../src/cypto';
import { createHmac } from 'crypto';

const testKey = 'LFLFMU2SGVCUIUCZKBMEKRKLIQ';
const testString = 'HDFGHDFGHFGHdfghkjkjdghldfgkhl;dfgkhljkfdgh+_(&*%^$&$%^&#$%66';
const testNumber = 124242425;
  
test('测试Base32编码', () => {
    const resultString = 'JBCEMR2IIRDEOSCGI5EGIZTHNBVWU23KMRTWQ3DEMZTWW2DMHNSGMZ3LNBWGU23GMRTWQK27FATCUJK6EQTCIJK6EYRSIJJWGY======';
    const result = util.bytesToBase32(util.stringToBytes(testString));

    expect(result).toBe(resultString);
});

test('测试HMACSHA1编码(字符串)', () => {
    // node 加密库作为基准结果
    const hmac = createHmac('sha1', Buffer.from(testKey));
	const resultHex: string = hmac.update(testString).digest('hex'); 

    const result = util.bytesToHex(cryptoLib.hmac(testString, testKey));
    expect(result).toBe(resultHex);
});

test('测试HMACSHA1编码(数字))', () => {
    // node 加密库作为基准结果
    const hmac = createHmac('sha1', Buffer.from(testKey));
    const c = Buffer.from(util.intToBytes(testNumber));
	const resultHex: string = hmac.update(c).digest('hex'); 

    const result = util.bytesToHex(cryptoLib.hmac(testNumber, testKey));
    expect(result).toBe(resultHex);
});


