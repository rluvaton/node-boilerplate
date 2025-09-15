import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'

import Axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'

import { setupHttpServer, startHttpServer } from '../../src/lib/http/server.ts'
import { logger } from '../../src/lib/logger.ts'

interface BaseHttpInitParam {
  setupRoutes: boolean
}

export class BaseHttpClient<InitParams extends object = BaseHttpInitParam> {
  private static serverInstance?: Server
  private static port?: number

  public static async up(setupRoutes = true) {
    if (this.serverInstance) {
      logger.debug('HTTP server already running')

      return
    }

    if (setupRoutes) {
      await setupHttpServer()
    }

    const fastify = await startHttpServer()
    this.serverInstance = fastify.server
    this.port = (fastify.server.address() as AddressInfo)?.port
    logger.info(`HTTP server is up on port: ${this.port}`)
  }

  /**
   * This should be down after all tests are done.
   */
  public static async downIfExists() {
    if (!this.serverInstance) {
      return
    }

    await this.serverInstance.close()
    this.serverInstance = undefined
    this.port = undefined
  }

  // ------------
  public axios!: AxiosInstance

  protected async setup({
    setupRoutes,
    configOverride: { headers, ...configOverride } = {},
  }: {
    setupRoutes?: boolean
    configOverride?: AxiosRequestConfig
  }) {
    if (configOverride?.baseURL) {
      if (configOverride.baseURL.startsWith('http')) {
        throw new Error('baseURL must not be a full URL but must start with /')
      }
      if (!configOverride.baseURL.startsWith('/')) {
        throw new Error('baseURL must start with /')
      }
    }

    await BaseHttpClient.up(setupRoutes)

    this.axios = Axios.create({
      ...configOverride,
      baseURL: `http://localhost:${BaseHttpClient.port}${configOverride.baseURL || '/'}`,
      headers: { 'Content-Type': 'application/json', ...headers },

      // Don't throw on any HTTP status code
      validateStatus: () => true,
    })
  }

  protected async setupWithIdentity({
    setupRoutes = true,
    configOverride = {},
  }: {
    setupRoutes?: boolean
    configOverride?: AxiosRequestConfig
  }) {
    return await this.setup({
      setupRoutes,
      configOverride: configOverride,
    })
  }

  public async init(options: InitParams) {
    // Inherent classes should override this and not call this method
    await this.setup({ setupRoutes: (options as unknown as BaseHttpInitParam).setupRoutes })
    return this
  }
}
