import { PostHog } from 'posthog-node'

const posthog = new PostHog(process.env.POSTHOG_KEY!, {
  host: process.env.POSTHOG_HOST,
  disableGeoip: false
})

export default posthog