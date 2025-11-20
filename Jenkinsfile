pipeline {
    agent any
    
    environment {
        DOCKER_HUB_REPO = 'yrcd27/travel-bucket-list'
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-credentials')
        IMAGE_TAG = 'latest'
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
                                sh "docker build -t ${DOCKER_HUB_REPO}-frontend:${IMAGE_TAG} ."
                            }
                        }
                    }
                }
                stage('Build Backend Image') {
                    steps {
                        echo 'Building Backend Docker image...'
                        script {
                            dir('backend') {
                                sh "docker build -t ${DOCKER_HUB_REPO}-backend:${IMAGE_TAG} ."
                            }
                        }
                    }
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                echo 'Automatically pushing images to Docker Hub...'
                script {
                    echo 'Docker images built successfully!'
                    echo "Frontend image: ${DOCKER_HUB_REPO}-frontend:${IMAGE_TAG}"
                    echo "Backend image: ${DOCKER_HUB_REPO}-backend:${IMAGE_TAG}"
                    
                    currentBuild.description = "Pushing Docker images to Docker Hub"
                    currentBuild.displayName = "#${BUILD_NUMBER} - Auto Deploy"
                    
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                        sh "docker push ${DOCKER_HUB_REPO}-frontend:${IMAGE_TAG}"
                        sh "docker push ${DOCKER_HUB_REPO}-backend:${IMAGE_TAG}"
                        sh 'docker logout'
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
                docker rmi ${DOCKER_HUB_REPO}-frontend:${IMAGE_TAG} || true
                docker rmi ${DOCKER_HUB_REPO}-backend:${IMAGE_TAG} || true
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