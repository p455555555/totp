interface VerifyReturn {
    status: boolean;
    delta?: number;
}
export default class totp {
    static getQRUri(key: string): string;
    static hotp(key: string, count: number): string;
    static hotpVerify(code: string, key: string, count: number): VerifyReturn;
    static totp(key: string): string;
    static totpVerify(code: string, key: string): VerifyReturn;
    private static getCount;
}
export {};
