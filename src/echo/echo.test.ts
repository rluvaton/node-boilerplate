import { EchoHttpClient } from './test/echo-http-client.js'

describe('Response format', () => {
  let searchHttpClient: EchoHttpClient

  beforeEach(async () => {
    searchHttpClient = await new EchoHttpClient().init()
  })

  describe('POST /examples', () => {
    it('should return under body.quote "N/A" when not passing quote', async () => {
      const response = await searchHttpClient.example({
        name: 'hello world',
      })

      expect(response).toBeSuccessful()
      expect(response).toHaveBodyEquals({
        type: 'post',
        body: {
          name: 'hello world',
          quote: 'N/A',
        },
      })
    })
  })
})
