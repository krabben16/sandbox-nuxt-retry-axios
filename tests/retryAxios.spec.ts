import axios from 'axios'
import { retryAxios } from '../retryAxios'
import nock from 'nock'

const url = 'http://example.com/test'

it('timeout', async () => {
  const scopes = [
    nock(url).get('/').delay(500).replyWithError({ code: 'ETIMEDOUT' }),
    nock(url).get('/').reply(200),
  ]

  const client = axios.create({
    baseURL: url,
    timeout: 300,
  })

  retryAxios(client, {
    timeout: 300,
    retry: 3,
    delay: 100,
  })

  const res = await client.get('/')

  expect(res.status).toBe(200)
  expect(res.config.raxConfig?.currentRetryAttempt ?? 0).toBe(1)

  scopes.forEach(s => s.done())
})

it('retry', async () => {
  const scopes = [
    nock(url).get('/').times(3).reply(500),
    nock(url).get('/').reply(200),
  ]

  const client = axios.create({
    baseURL: url,
    timeout: 300,
  })

  retryAxios(client, {
    timeout: 300,
    retry: 3,
    delay: 100,
  })

  const res = await client.get('/')

  expect(res.status).toBe(200)
  expect(res.config.raxConfig?.currentRetryAttempt ?? 0).toBe(3)

  scopes.forEach(s => s.done())
})

it('delay', async () => {
  const scopes = [
    nock(url).get('/').reply(500),
    nock(url).get('/').reply(200),
  ]

  const client = axios.create({
    baseURL: url,
    timeout: 300,
  })

  retryAxios(client, {
    timeout: 300,
    retry: 3,
    delay: 100,
  })

  const res = await client.get('/')

  expect(res.status).toBe(200)
  expect(res.config.raxConfig?.retryDelay ?? 0).toBe(100)

  scopes.forEach(s => s.done())
})
