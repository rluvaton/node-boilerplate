// TODO - replace with convict
const config = {
  logger: {
    pretty: true,
  },
  http: {
    port: parseInt(process.env.PORT || process.env.NODE_ENV === 'test' ? '0' : '3000'),
  },
}

export default config
