require('dotenv').config();

const config = {
    functional: {
        baseUrl: process.env.BASE_URL || 'http://127.0.0.1:3000',
        mongoSSH: (process.env.MONGO_SSH === "true") || false,
        mongoNamespace: process.env.NAMESPACE || 'digital-ns',
        mongoPodName: process.env.POD_NAME || 'mongo-0',
        mongoDatabase: process.env.MONGO_DB || 'digital_database',
        mongoSshUser: process.env.MONGO_SSH_USER || 'ec2-user@10.0.0.189',
        cryptoService: {
            baseUrl: process.env.CRYPTO_BASE_URL || 'http://127.0.0.1:3010',
            serviceUrl: process.env.CRYPTO_GENERATE_RSA_KEYS_URL || 'api/crypto/generate-rsa-keys',
        },
    },
    performance: {

    },
    e2e: {
        baseUrl: process.env.BASE_URL || 'http://127.0.0.1:3000'
    }
}

export default config