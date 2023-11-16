pipeline {
    agent any
    stages {
        stage('Build'){
            steps {
                sh 'docker-compose build'
            }
        }
        stage('Test'){
            steps {
            sh 'docker-compose -f compose.yaml up -d'
            sh 'npm test'
            }
        }
    }
}