import * as scanner from 'sonarqube-scanner'
import { config as configDotenv } from 'dotenv';

// config the environment
configDotenv();

const serverUrl = process.env.SONAR_URL || 'https://sonar.digital.idb-digitallabs.com';
const sonarAccessToken = process.env.SONAR_TOKEN || '####';

// projectKey must be unique in a given SonarQube instance
const projectKey = process.env.SONARQUBE_PROJECT_KEY || 'template-nestjs-skeleton';
// replace it with your task name
const projectName = process.env.SONARQUBE_PROJECT_NAME || 'template-nestjs-skeleton';

// options Map (optional) Used to pass extra parameters for the analysis.
// See the [official documentation](https://docs.sonarqube.org/latest/analysis/analysis-parameters/) for more details.
const options = {
    'sonar.projectName': projectName,
    'sonar.projectKey': projectKey,
    // Path is relative to the sonar-project.properties file. Defaults to .
    'sonar.sources': 'src',
    'sonar.inclusions': 'src/*.ts, src/**/*.ts, src/**/**/*.ts',// Entry point of your code
    'sonar.test.inclusions': 'src/**/*.spec.ts, src/**/**/*.spec.ts',
    'sonar.exclusions': 'src/main.ts, src/common/openapi/*, src/common/config/*, src/**/**/*.entity.ts, src/**/**/*.module.ts',// Entry point of your code
    'sonar.test.exclusions': 'src/main.ts, src/common/openapi/*, src/common/config/*, src/**/**/*.entity.ts, src/**/*.entity.ts, src/**/**/*.module.ts',
    // source language
    'sonar.language': 'ts',
    'sonar.typescript.lcov.reportPaths': 'coverage/lcov.info',
    // Encoding of the source code. Default is default system encoding
    'sonar.sourceEncoding': 'UTF-8'
};
// parameters for sonarqube-scanner

const params = {
    serverUrl,
    login: sonarAccessToken,
    options
}

const sonarScanner = async () => {
    if (!serverUrl) {
        console.log('SonarQube url not set. Nothing to do...');
        return;
    }
    //  Function Callback (the execution of the analysis is asynchronous).
    const callback = (result) => {
        console.log('Sonarqube scanner result:', result);
    }
    scanner(params, callback);
}

sonarScanner().catch(err => console.error('Error during sonar scan', err));