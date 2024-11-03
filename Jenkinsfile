pipeline {
  agent any
  environment {
    ACCOUNT = '353013733335'
    REGION = 'ap-south-1'
    APP_NAME = 'nest-skeleton'
    REGISTRY = "${ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com"
    REGISTRY_CREDENTIAL = 'aws-instance-role'
    IMAGE_TAG = 'latest'
    BASE_URL = ''
    HEALTH_ROUTE = '/health'
    RELEASE_VERSION = ''
    DLP_JOB = 'Digital/Digital Environment/main'
    NPMRC_CONFIG = 'ef195325-d5e3-4408-b82c-5d3ac00b2679'
    CRYPTO_BASE_URL = 'https://api-gateway.digital.idb-digitallabs.com/crypto'
    CRYPTO_GET_RSA_KEYS_URL = '/api/crypto/v1/keys/get'
    SONAR_TOKEN_CREDENTIAL_ID = '4f8b0db6-8f66-4cb5-ae5a-cd0699e189c4'
  }

  tools {
    // To be set in global tool configuration. or agent with nodejs installed?
    nodejs "nodejs-tool"
  }
  
  triggers {cron('50 17 * * *')}
  parameters {
    choice(name: 'RELEASE', choices: ['', 'uat', 'production'], description: 'Release to environment')
    choice(name: 'BUMP', choices: ['', 'major', 'minor', 'patch'], description: 'Bump version value')
    choice(name: 'RUN_ONLY_TESTS', choices: ['false', 'true'], description: 'Select true to run only functional and performance tests')
    string(name: 'TARGET', defaultValue: "${env.BASE_URL}", trim: false, description: 'Target URL to scan')
  }
  stages {
    stage('Check Branch') {
        steps {
            script {
                def causes = currentBuild.getBuildCauses('hudson.triggers.TimerTrigger$TimerTriggerCause')
                if (causes.size() > 0) { env.IS_CRON_TRIGGER = 'true' }
                else { env.IS_CRON_TRIGGER = 'false' }
                if (env.IS_CRON_TRIGGER == 'true' && env.GIT_BRANCH != 'development') {
                    error("Build aborted. Not the target branch: ${env.GIT_BRANCH}")
                }
                else {echo 'Job not triggered by cron timer'}
            }
        }
    }
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Build') {
      steps {
       withNPM(npmrcConfig:"${NPMRC_CONFIG}") {
          sh 'rm -f "package-lock.json"'
          sh '(tar -xf /tmp/golden-node/node_modules.tar -C . && npm install) || npm install'
          sh 'npm install'
          sh 'npm run build'
        }
      }
    }
    stage('Unit tests coverage') {
      steps {
        sh 'echo running tests coverage'
        sh 'npm run test:coverage'
      }
    }
    stage('SAST - Pre run steps') {
      steps {
        sh 'mkdir -p reports'
      }
    }
    stage('SAST - Sonarqube') {
      when {
        anyOf {
          branch 'main'
          branch 'uat'
          branch 'development*'
          branch 'PR-*'
        }
      }
      steps {
        withCredentials([string(credentialsId: "${SONAR_TOKEN_CREDENTIAL_ID}", variable: 'SONAR_TOKEN')]) {
         // sh 'echo running sonar-scanner'
          sh 'npm run sonar'
          sh 'cat .scannerwork/report-task.txt > ./reports/sonarqube-report'
        }
      }
    }
    stage('SAST - NPM Audit') {
      when{
        expression {
           return params.RUN_ONLY_TESTS == 'false' && env.IS_CRON_TRIGGER == 'false';
         }
      }
      steps {
        sh 'npm run ci:audit:report'
      }
    }
    stage('Package application as docker image') {
      when {
        anyOf {
          branch 'main'
          branch 'uat'
          branch 'development*'
        }
        expression {
          return params.RUN_ONLY_TESTS == 'false' && env.IS_CRON_TRIGGER == 'false';
        }
      }
      steps {
        echo 'Building docker image'
        script {
          def imageTag = getCurrentVersion()
          IMAGE_TAG=imageTag
          app = docker.build("${REGISTRY}/dlp-ecr-repository:${APP_NAME}_${IMAGE_TAG}-SNAPSHOT")
        }
      }
    }
    stage('Push SNAPSHOT Image to ECR') {
      when {
        anyOf {
          branch 'main'
          branch 'uat'
          branch 'development*'
        }
        expression {
          return params.RUN_ONLY_TESTS == 'false' && env.IS_CRON_TRIGGER == 'false';
        }
      }
      steps {
        sh 'echo pushing application image to repository'
        sh "aws ecr get-login-password --region ${REGION} | docker login -u AWS --password-stdin ${REGISTRY}"
        // sh "docker tag ${APP_NAME}:latest ${REGISTRY}/dlp-ecr-repository:${APP_NAME}_${IMAGE_TAG}-SNAPSHOT"
        sh "docker push ${REGISTRY}/dlp-ecr-repository:${APP_NAME}_${IMAGE_TAG}-SNAPSHOT"
      }
    }
    stage('Docker Image Prune') {
      when{
        anyOf {
          branch 'main'
          branch 'uat'
          branch 'development*'
        }
        expression {
          return params.RUN_ONLY_TESTS == 'false' && env.IS_CRON_TRIGGER == 'false';
        }
      }
      steps {
        sh 'docker image prune -f'
        sh "docker rmi ${REGISTRY}/dlp-ecr-repository:${APP_NAME}_${IMAGE_TAG}-SNAPSHOT"
      }
    }
    stage('Run dab-environment Jenkins Job for Deployment') {
      when{
        anyOf {
          branch 'main'
          branch 'uat'
          branch 'development*'
        }
        expression {
          return params.RUN_ONLY_TESTS == 'false' && env.IS_CRON_TRIGGER == 'false';
        }
      }
      steps {
        sh 'echo Triggering dab-environment Jenkins Job'
        build job: "${DLP_JOB}", parameters: [string(name: 'SERVICE',  value: "${APP_NAME}"), string(name: 'DEPLOY',  value: 'true')]
        sh 'sleep 10'
      }
    }
    stage('Functional test') {
      when {
        anyOf {
          branch 'main'
          branch 'uat'
          branch 'development*'
          branch 'PR-*'
        }
      }
     steps {
        sshagent(credentials: ['ssh-key']) {
          sh 'echo running functional tests'
          // sh 'npm run test:functional --reportPath="./reports/cucumber-report.json"'
          sh 'npm run test:functional:cucumber' 
        }
      }
    }
    stage('Performance test') {
      when {
        expression {
          return false;
        }        
      }
      steps {
        sh 'echo running performance tests'
        // sh 'npm run test:performance --path="./test/performance/test.yaml"'
        sh 'npm run test:performance:report-generate'
        sh 'npm run test:performance:report-view'
      }
    }
    stage('OWASP-ZAP Scan(DAST)') {
      when {
        anyOf {
          branch 'main'
          branch 'uat'
          branch 'development*'
        }
      }
      steps {
        script {
          def target = (params.TARGET == "null" || params.TARGET == null || params.TARGET.trim() == "") ? env.BASE_URL : params.TARGET
          echo "Pulling up last OWASP ZAP container --> Start"
          sh 'docker pull ghcr.io/zaproxy/zaproxy:stable'
          echo "Pulling up last VMS container --> End"
          echo "Starting container --> Start"
          sh """
             docker run -dt --name owasp \
             ghcr.io/zaproxy/zaproxy:stable \
             /bin/bash
          """
          echo 'Preparing Work Directory'
          sh """
             docker exec owasp \
             mkdir /zap/wrk
          """
          echo 'Running Scan'
          sh """
             docker exec owasp \
             zap-baseline.py \
             -t "${target}" \
             -r zapReport.html \
             -I
          """
          echo "Copying report to workspace"
          sh '''
             docker cp owasp:/zap/wrk/zapReport.html ${WORKSPACE}/reports/zapReport.html
          '''
        }
      }
    }

    // stage('Tag release to GIT and ECR') {
    //   when {
    //     allOf {
    //       branch 'uat'
    //       expression {
    //         params.RELEASE ==~ /uat|production/
    //       }
    //     }
    //   }
    //   steps {
    //     sh 'echo tag version fit to release'
    //     sh "docker tag ${APP_NAME}:latest ${REGISTRY}/${APP_NAME}:${IMAGE_TAG}"
    //     sh "docker push ${REGISTRY}/${APP_NAME}:${IMAGE_TAG}"
    //     script {
    //       RELEASE_VERSION=IMAGE_TAG
    //     }
    //     withCredentials([gitUsernamePassword(credentialsId: '3dc4a6bf-5d41-4263-a005-1c64e370d165')]) {
    //       sh "git tag -fa v${RELEASE_VERSION} -m \"Tag release version - ${RELEASE_VERSION}\""
    //       sh "git push origin v${RELEASE_VERSION}"
    //     }
    //   }
    // }

    // stage('Bump next dev version') {
    //   when {
    //     allOf {
    //       branch 'uat'
    //       expression {
    //         params.BUMP ==~ /major|minor|patch/
    //       }
    //     }
    //   }
    //   steps {
    //     sh "npm --no-git-tag-version version ${params.BUMP}"
    //     sh "echo New package version - ${getCurrentVersion()}"
    //     withCredentials([gitUsernamePassword(credentialsId: '3dc4a6bf-5d41-4263-a005-1c64e370d165')]) {
    //       sh "git add package.json package-lock.json"
    //       sh "git commit -m \"Bumping version to next development version - ${getCurrentVersion()}\""
    //       sh "git push origin HEAD:uat"
    //     }
    //   }
    // }
  }
  post {
    always {
      sh 'echo Performing cleanup activities'
      cleanWs(cleanWhenNotBuilt: false,
        deleteDirs: true,
        disableDeferredWipeout: true,
        notFailBuild: true,
        patterns: [
          [pattern: '.gitignore', type: 'INCLUDE'],
          [pattern: '.propsfile', type: 'EXCLUDE']
        ]
      )
      cucumber '**/cucumber-report.json'
      publishHTML (
        target : [
            allowMissing: false,
            alwaysLinkToLastBuild: true,
            keepAll: true,
            reportDir: 'reports',
            reportFiles: 'zapReport.html,artillery.html,audit.html',
            reportName: 'Reports',
            reportTitles: 'CI Report'
        ]
      )
      echo "Removing container"
      sh '''
        rm -rf /tmp/mongo*
        rm -rf node_modules
        docker stop owasp
        docker rm owasp 
      '''
    }
  }
}


def getCurrentVersion() {
  def owner = '@idb-dab'
  def appName = "${owner}/${APP_NAME}"
  def versionObj = sh(returnStdout: true, script: "npm version")
  def versionProps = readJSON text: versionObj
  def version = versionProps["${appName}"] ? versionProps["${appName}"] : 'latest'
  "${version}-Digital"
}