<template>
  <Tutorial />
</template>

<script lang="ts">
import Vue from 'vue'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { retryAxios } from '~/retryAxios'

if (process.client) {
  const config = {
    timeout: 100,
    retry: 3,
    delay: 500
  }

  const client = axios.create({
    timeout: config.timeout
  })

  retryAxios(client, config)

  client
    .get('http://example.com/test')
    .then((res: AxiosResponse) => {
      // eslint-disable-next-line no-console
      console.info(res)
    })
    .catch((err: AxiosError) => {
      // eslint-disable-next-line no-console
      console.error(err)
    })
}

export default Vue.extend({})
</script>
