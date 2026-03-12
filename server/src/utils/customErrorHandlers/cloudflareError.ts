class CloudflareError extends Error {
    timestamp: string

    constructor(message: string){
        super(message);
        this.name="CloudflareError";
        this.timestamp = new Date().toISOString()
    }
}

export default CloudflareError