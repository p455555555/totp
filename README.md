[![npm version](https://badge.fury.io/js/%40nest-public%2Ftotp.svg)](https://badge.fury.io/js/%40nest-public%2Ftotp)

# totp

TOTP算法node.js实现，支持动态密码生成、效验, 可以搭配Google Authenticator使用

## 安装

```bash
$ npm install @nest-public/totp --save
```

## 用法

```javascript
import { totp } from '@nest-public/totp';

// 设置密钥
const testKey = 'LFLFMU2SGVCUIUCZKBMEKRKLIQ';

// 获取6位动态密码
console.log(totp.totp(testKey));
// 返回 6位数字符串 如123456

// 效验动态密码
console.log(totp.totpVerify('123456', testKey));
// 返回 {
// 	status: true; // 验证码是否准确
// 	delta: 0; // 偏移量(1单位==30秒)
// }

```

## 测试

```bash
# jest 测试
$ npm run test
```
