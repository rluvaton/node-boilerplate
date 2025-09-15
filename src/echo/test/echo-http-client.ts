import { BaseHttpClient } from '../../../test/helpers/base-http-client.ts'
import type { PostExampleRequestInputType, PostExampleResponseType } from '../types.ts'

export class EchoHttpClient extends BaseHttpClient {
  public async init(): Promise<this> {
    await this.setupWithIdentity({
      setupRoutes: true,
    })

    return this
  }

  public async postEcho(body: any) {
    return await this.axios.post('/echo', {
      body,
    })
  }

  public async example(body: PostExampleRequestInputType) {
    return await this.axios.post<PostExampleResponseType>('/echo/example', body)
  }
}
