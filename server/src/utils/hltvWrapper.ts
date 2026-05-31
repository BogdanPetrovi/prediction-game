import CloudflareError from "./customErrorHandlers/cloudflareError.js"

const isCloudflareError = (message: string): boolean => {
  return (
    message.includes("Cloudflare") ||
    message.includes("Access denied") ||
    message.includes("CF_BLOCKED")
  )
}

const hltvWrapper = async <T>(promise: Promise<T>): Promise<T> => {
  try {
    return await promise
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    if (isCloudflareError(message)) {
        throw new CloudflareError(message)
    }

    throw err
  }
}

export default hltvWrapper