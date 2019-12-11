export default class Cypto {
    private static blocksize;
    static sha1(message: number[]): number[];
    static hmac<T>(m: T, k: string | number[], hasher?: typeof Cypto.sha1): number[];
}
