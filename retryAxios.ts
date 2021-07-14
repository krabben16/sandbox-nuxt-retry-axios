import { AxiosInstance } from "axios"
import * as rax from 'retry-axios'

export function retryAxios(client: AxiosInstance, config: IRetryConfig) {
  client.defaults.raxConfig = {
    instance: client,
    retry: config.retry,
    noResponseRetries: config.retry,
    retryDelay: config.delay,
    onRetryAttempt: (err) => {
      const raxConfig = rax.getConfig(err)
      if (raxConfig) {
        // eslint-disable-next-line no-console
        console.warn(`Retry attempt #${raxConfig.currentRetryAttempt}`)
      }
    },
  }

  rax.attach(client)
}
