export const OPTIMIZED_IMAGE_HOSTS = ['cdn-api.pandascore.co', 'countersite.gg']

export const isOptimizedImage = (src: string) => {
  try {
    return OPTIMIZED_IMAGE_HOSTS.includes(new URL(src).hostname)
  } catch {
    return false
  }
}
