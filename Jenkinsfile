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
                sh 'docker build -t azerch/nest-app:latest .'
            }
        }
        stage('Test'){
            steps {
            sh 'docker-compose down'
            sh 'docker-compose up -d'
            sh 'docker exec  nest-app /bin/bash -c "npm test"'
            }
        }
        stage('Deploy'){
            steps{
                withCredentials([string(credentialsId: 'password', variable: 'password')]) {
                    sh 'docker login -u azerch -p ${password}'
                    sh 'docker push azerch/nest-app:latest'
                }
            }
        }
    }
}