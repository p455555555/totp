[![npm version](https://badge.fury.io/js/%40nest-public%2Ftotp.svg)](https://badge.fury.io/js/%40nest-public%2Ftotp)

# TOTP

TOTP算法JavaScript实现，可以用于Node.js、浏览器、React Navive环境，支持动态密码生成、效验, 可以搭配Google Authenticator使用


## 更新日志

* [2019.12.11] HMAC加密库由Node.js Cypto模块替换为用JavaScript实现的HMACSHA1加密库，现在支持在任何JavaScript环境使用了。

## 安装

```bash
$ npm install @nest-public/totp --save
```

## 用法

```javascript
import totp from '@nest-public/totp';

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
