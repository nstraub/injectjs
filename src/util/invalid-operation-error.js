export default class InvalidOperationError extends Error {
    constructor(message) {
        super(message || "no message provided, see stack trace");
        this.name = "InvalidOperationError";
    }
}