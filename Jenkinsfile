pipeline {
    agent any
    stages {
        stage('Checkout'){
            steps {
            checkout scmGit(branches: [[name: 'main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/Azer-ch/Mock-app']])
            }
        }
        stage('Build'){
            steps {
                sh 'docker-compose build -t azerch/nest-app'
            }
        }
        stage('Test'){
            steps {
            sh 'docker-compose -f compose.yaml up -d'
            sh 'docker exec  nest-app /bin/bash -c "npm test"'
            }
        }
    }
}