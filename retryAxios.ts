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
        if (raxConfig.currentRetryAttempt && raxConfig.retryDelay) {
          raxConfig.retryDelay = raxConfig.currentRetryAttempt * raxConfig.retryDelay
        }
        // eslint-disable-next-line no-console
        console.warn(`Retry attempt #${raxConfig.currentRetryAttempt} message: ${err.message}`)
      }
    },
  }

  rax.attach(client)
}
