import { totp } from '../lib/totp';

const testKey = 'LFLFMU2SGVCUIUCZKBMEKRKLIQ';
  
test('获取TOTP code,code应该是6位数', () => {
    const result = totp.totp(testKey);
    expect(result).toHaveLength(6); // code 应该是6位数
});

test('获取TOTP code,再进行效验应该为true', () => {
    const code = totp.totp(testKey);
    const result = totp.totpVerify(code, testKey);
    expect(result.status).toBe(true);
    expect(result.delta).toBe(0);
});

test('随便用一个code效验应该是不通过的', () => {
    const code = '564786';
    const result = totp.totpVerify(code, testKey);
    expect(result.status).toBe(false);
});
