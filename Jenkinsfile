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
                    
                    
                    currentBuild.description = "APPROVAL NEEDED: Docker images ready for push!"
                    currentBuild.displayName = "#${BUILD_NUMBER} - Waiting for Approval"
                    
                    def userInput = input(
                        id: 'dockerPushApproval',
                        message: 'Docker Images Built Successfully! Push to Docker Hub?',
                        submitter: 'admin',
                        submitterParameter: 'APPROVER',
                        ok: 'Proceed with Decision',
                        parameters: [
                            booleanParam(
                                name: 'PUSH_TO_DOCKERHUB',
                                defaultValue: false,
                                description: 'Check this box to push images to Docker Hub'
                            )
                        ]
                    )
                    
                    if (userInput.PUSH_TO_DOCKERHUB) {
                        env.PUSH_TO_DOCKERHUB = 'true'
                        echo 'User chose to push images to Docker Hub'
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
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                        sh "docker push ${DOCKER_HUB_REPO}-frontend:${BUILD_NUMBER}"
                        sh "docker push ${DOCKER_HUB_REPO}-frontend:latest"
                        sh "docker push ${DOCKER_HUB_REPO}-backend:${BUILD_NUMBER}"
                        sh "docker push ${DOCKER_HUB_REPO}-backend:latest"
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