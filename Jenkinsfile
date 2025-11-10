pipeline {
    agent any
    
    environment {
        DOCKER_HUB_REPO = 'yrcd27/travel-bucket-list'
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-credentials')
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Pulling latest code from Git repository...'
                checkout scm
            }
        }
        
        stage('Build Docker Images') {
            parallel {
                stage('Build Frontend Image') {
                    steps {
                        echo 'Building Frontend Docker image...'
                        script {
                            dir('frontend') {
                                sh "docker build -t ${DOCKER_HUB_REPO}-frontend:${BUILD_NUMBER} ."
                                sh "docker tag ${DOCKER_HUB_REPO}-frontend:${BUILD_NUMBER} ${DOCKER_HUB_REPO}-frontend:latest"
                            }
                        }
                    }
                }
                stage('Build Backend Image') {
                    steps {
                        echo 'Building Backend Docker image...'
                        script {
                            dir('backend') {
                                sh "docker build -t ${DOCKER_HUB_REPO}-backend:${BUILD_NUMBER} ."
                                sh "docker tag ${DOCKER_HUB_REPO}-backend:${BUILD_NUMBER} ${DOCKER_HUB_REPO}-backend:latest"
                            }
                        }
                    }
                }
            }
        }
        
        stage('Manual Approval') {
            steps {
                script {
                    echo 'Docker images built successfully!'
                    echo "Frontend image: ${DOCKER_HUB_REPO}-frontend:${BUILD_NUMBER}"
                    echo "Backend image: ${DOCKER_HUB_REPO}-backend:${BUILD_NUMBER}"
                    
                    def userInput = input(
                        id: 'dockerPushApproval',
                        message: 'Push Docker images to Docker Hub?',
                        parameters: [
                            choice(
                                name: 'PUSH_DECISION',
                                choices: ['No', 'Yes'],
                                description: 'Do you want to push the built images to Docker Hub?'
                            )
                        ]
                    )
                    
                    if (userInput == 'Yes') {
                        env.PUSH_TO_DOCKERHUB = 'true'
                    } else {
                        env.PUSH_TO_DOCKERHUB = 'false'
                        echo 'User chose not to push images to Docker Hub'
                    }
                }
            }
        }
        
        stage('Push to Docker Hub') {
            when {
                environment name: 'PUSH_TO_DOCKERHUB', value: 'true'
            }
            steps {
                echo 'Pushing images to Docker Hub...'
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {
                        sh "docker push ${DOCKER_HUB_REPO}-frontend:${BUILD_NUMBER}"
                        sh "docker push ${DOCKER_HUB_REPO}-frontend:latest"
                        sh "docker push ${DOCKER_HUB_REPO}-backend:${BUILD_NUMBER}"
                        sh "docker push ${DOCKER_HUB_REPO}-backend:latest"
                    }
                }
                echo 'Images successfully pushed to Docker Hub!'
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up local Docker images...'
            sh """
                docker rmi ${DOCKER_HUB_REPO}-frontend:${BUILD_NUMBER} || true
                docker rmi ${DOCKER_HUB_REPO}-frontend:latest || true
                docker rmi ${DOCKER_HUB_REPO}-backend:${BUILD_NUMBER} || true
                docker rmi ${DOCKER_HUB_REPO}-backend:latest || true
            """
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check the logs for details.'
        }
    }
}