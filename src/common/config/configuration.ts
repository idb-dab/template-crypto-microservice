import { CONSTANTS as DEFAULT_CONSTANTS, config as defaultConfig } from '@idb-dab/ms-configuration';

export default () => ({
    app: {
        host: process.env.APP_HOST || '0.0.0.0',
        port: parseInt(process.env.APP_PORT, 10) || 3000,
        protocol: process.env.APP_PROTOCOL || 'http',
        name: process.env.APP_NAME || 'nest-skeleton',
        health: {
            enablePeriodicCheck: (process.env.ENABLE_PERIODIC_HEALTH_CHECK === 'true') || false,
            disk: {
                key: process.env.DISK_HEALTH_KEY || 'ms-disk',
                threshold: parseFloat(process.env.DISK_HEALTH_THRESHOLD) || 0.9,
                path: process.env.DISK_HEALTH_PATH || 'C:\\'
            },
            memory: {
                heapKey: process.env.MEMORY_HEALTH_HEAP_KEY || 'memory_heap',
                heapThreshold: parseInt(process.env.MEMORY_HEALTH_HEAP_THRESHOLD, 10) || 150 * 1024 * 1024,
                rssKey: process.env.MEMORY_HEALTH_RSS_KEY || 'memory_rss',
                rssThreshold: parseInt(process.env.MEMORY_HEALTH_RSS_THRESHOLD, 10) || 150 * 1024 * 1024
            }
        },
        error: {
            enableStack: (process.env.ENABLE_ERROR_STACK === 'true') || false,
        },
        requestHeaders: [DEFAULT_CONSTANTS.REQUEST_ID, DEFAULT_CONSTANTS.CHANNEL_ID],
        enableCors: (process.env.ENABLE_CORS === 'true') || false,
        enableCorsConfig: {
            allowedHeaders: process.env.ENABLE_CORS_ALLOWED_HEADERS || '*',
            exposedHeaders: process.env.ENABLE_CORS_EXPOSED_HEADERS || '*',
            origin: process.env.ENABLE_CORS_ORIGIN || 'http://localhost:3000',
            credentials: (process.env.ENABLE_CORS_CREDENTIALS === 'true') || true,
        },
    },
    log: {
        app: {
            level: process.env.APP_LOG_LEVEL || 'info',
            directoryMount: process.env.LOGS_DIRECTORY_MOUNT || 'logs',
            subDirectory: process.env.LOGS_SUB_DIRECTORY || '',
            filePrefix: process.env.LOGS_FILE_PREFIX || 'combined',
            errorFilePrefix: process.env.LOGS_ERROR_FILE_PREFIX || 'error',
            dateParttern: process.env.LOGS_DATEPATTERN || 'MM-DD-YYYY',
            maxSize: process.env.LOGS_FILE_MAXSIZE || '100m',
            maxFile: process.env.LOGS_FILE_MAXFILE || '30d',
            zippedArchive: (process.env.LOGS_ZIPPED_ARCHIVE === 'true') || true,
        }
    },
    cache: {
        ttl: parseInt(process.env.CACHE_TTL, 10) || 300, // seconds ~ ttl 5 minutes
        maxCount: parseInt(process.env.CACHE_MAX_ENTRIES, 10) || 100, // count ~ maximum number of items in cache
    },
    database: {
        mongodb: {
            uri: `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?replicaSet=dbrs&directConnection=true`,
            useNewUrlParser: (process.env.MONGO_NEW_URL_PARSER === 'true') || true,
            useUnifiedTopology: (process.env.MONGO_UNIFIED_TOPOLOGY === 'true') || true,
            serverSelectionTimeoutMS: parseInt(process.env.MONGO_SERVER_SELECTION_TIMEOUT, 10) || 50,
            connectTimeoutMS: parseInt(process.env.MONGO_CONNECT_TIMEOUT, 10) || 50
        }
    },
    encryptDecrypt: {
        secretKey: process.env.DATAKEY || 'u8x/A?D(G+KbPdSgVkYp3s6v9y$B&E)H',
        algorithm: process.env.ALGORITHM_KEY || 'aes-256-cbc',
        enable: process.env.ENABLE_ENCRYPT_DECRYPT_FEATURE === 'true' || false,
    },
    cryptoService: {
        baseUrl: process.env.CRYPTO_BASE_URL || 'http://127.0.0.1:3010',
        serviceUrl: process.env.CRYPTO_SERVICE_URL || '/api/crypto',
    },
});

export const config = {
    ...defaultConfig
}

export const CONSTANTS = {
    ...DEFAULT_CONSTANTS,
    ENV: {
        NODE: 'NODE_ENV',
        DEVELOPMENT: 'development',
        PRODUCTION: 'production',
    },
    CONFIG: {
        APP: 'app',
        HOST: 'app.host',
        PORT: 'app.port',
        LOG: 'log',
        DATABASE: 'database'
    },
    ROUTES: {
        ...DEFAULT_CONSTANTS.ROUTES,
        BASE: '',
        API: 'api',
        CUSTOMER: {
            CONTROLLER: 'customer',
            TAG: 'customer',
            VERSION: '1'
        },
        ACCOUNT: {
            CONTROLLER: 'account',
            TAG: 'account',
            VERSION: '1'
        },
        TRANSACTION: {
            CONTROLLER: 'transaction',
            TAG: 'transaction',
            VERSION: '1'
        },
        BANK: {
            CONTROLLER: 'bank',
            TAG: 'bank',
            VERSION: '1'
        },
        CITY: {
            CONTROLLER: 'city',
            TAG: 'city',
            VERSION: '1'
        },
        CRUD_TEMPLATE: {
            CONTROLLER: 'crud-template',
            TAG: 'crud-template',
            VERSION: '1'
        }
    },
    AUTH: {
        HEADER: {
            STRATEGY: 'api-key',
            KEY: 'X-Service-Key'
        }
    },
    LOG: {
        ...DEFAULT_CONSTANTS.LOG,
        LABEL: 'template-nestjs-skeleton',
    },
    SWAGGER: {
        DOCS: 'docs',
        TITLE: 'API Docs',
        HEADER: 'SOME API',
        DESCRIPTION: 'API - Description',
        VERSION: 'v1',
        TAG: 'tag'
    }
}
