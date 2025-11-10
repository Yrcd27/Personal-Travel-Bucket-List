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
                    
                    
                    writeFile file: 'notification.html', text: '''
<!DOCTYPE html>
<html>
<head>
    <title>Jenkins Approval Required</title>
    <script>
        function showNotification() {
            if ("Notification" in window) {
                if (Notification.permission === "granted") {
                    new Notification("Jenkins: Approval Required!", {
                        body: "Docker images built successfully. Click to approve push to Docker Hub.",
                        icon: "/static/images/jenkins.png",
                        requireInteraction: true
                    }).onclick = function() {
                        window.open("''' + env.BUILD_URL + '''input", "_blank");
                    };
                } else if (Notification.permission !== "denied") {
                    Notification.requestPermission().then(function (permission) {
                        if (permission === "granted") {
                            showNotification();
                        }
                    });
                }
            }
            // Auto-redirect after 3 seconds
            setTimeout(function() {
                window.location.href = "''' + env.BUILD_URL + '''input";
            }, 3000);
        }
        window.onload = showNotification;
    </script>
</head>
<body>
    <h1>Jenkins Approval Required!</h1>
    <p>Docker images built successfully!</p>
    <p>You will be redirected to the approval page in 3 seconds...</p>
    <a href="''' + env.BUILD_URL + '''input">Click here to approve now</a>
</body>
</html>
'''
                    
                    
                    archiveArtifacts artifacts: 'notification.html', allowEmptyArchive: false
                    
                    def userInput = input(
                        id: 'dockerPushApproval',
                        message: 'Docker Images Built Successfully! Push to Docker Hub?',
                        submitter: 'admin',
                        submitterParameter: 'APPROVER',
                        ok: 'Proceed with Decision',
                        parameters: [
                            choice(
                                name: 'PUSH_DECISION',
                                choices: ['No', 'Yes'],
                                description: 'Yes: Push images to Docker Hub\n No: Skip Docker Hub push'
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
        
        stage('Deploy Locally') {
            steps {
                echo 'Deploying new images to local containers...'
                script {
                    try {
                        sh 'docker-compose down'
                        echo 'Stopped existing containers'
                    } catch (Exception e) {
                        echo "No existing containers to stop: ${e.getMessage()}"
                    }
                    
                    sh 'docker-compose up -d'
                    echo 'Started containers with new images'
                    
                    // Wait for containers to be ready
                    sh 'sleep 10'
                    
                    // Health check
                    try {
                        sh 'curl -f http://localhost:5173 || echo "Frontend not ready yet"'
                        sh 'curl -f http://localhost:5000/api/health || echo "Backend not ready yet"'
                    } catch (Exception e) {
                        echo "Health check completed: ${e.getMessage()}"
                    }
                }
                echo 'Local deployment completed! Check http://localhost:5173'
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