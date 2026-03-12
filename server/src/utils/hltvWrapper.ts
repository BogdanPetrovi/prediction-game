import CloudflareError from "./customErrorHandlers/cloudflareError.js"

const hltvWrapper = async <T>(promise: Promise<T>): Promise<T> => {
    try {
        return await promise
    } catch (err: any) {
        if(err?.message.includes === "Cloudflare" || err?.message.includes === "Access denied"){
            throw new CloudflareError(err.message)
        }

        throw err
    }
}

export default hltvWrapper