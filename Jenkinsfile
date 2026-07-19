pipeline {
    agent {
        label 'sa_jenkins_agent'
    }
    
    options { 
        skipDefaultCheckout() 
    }

    triggers {
        githubPush() 
    }

    environment {
        // 1. Frontend Docker Hub Profile Details
        DOCKER_HUB_USER = 'sdahsan'
        IMAGE_NAME      = 'sa-frontend' // Change this if your frontend image name is different
        DOCKER_CREDS_ID = 'docker_hub_login' // Reuses your existing Docker Hub credential vault ID
        REPO_URL        = 'https://github.com/sdahsan/SA_Frontend.git'
        
        // 2. Frontend Application Deployment Variables
        PORT            = '3000'
        API_URL         = 'http://20.46.51.31:5010//api/user' 
    }

    stages {
        // STAGE 1: ENSURE DOCKER OPERATIONAL
        stage('Ensure Docker Installed') {
            steps {
                echo 'Checking infrastructure state...'
                sh '''
                    sudo rm -f /etc/apt/sources.list.d/docker.list
                    export DEBIAN_FRONTEND=noninteractive
                    sudo apt-get update -y
                    
                    if ! command -v docker &> /dev/null; then
                        echo "Docker not found! Running native package deployment..."
                        sudo apt-get install -yq docker.io docker-compose
                        sudo systemctl start docker
                        sudo systemctl enable docker
                        sudo usermod -aG docker $(whoami)
                    else
                        echo "Docker is ready."
                        sudo usermod -aG docker $(whoami) 2>/dev/null || true
                    fi
                '''
            }
        }

        // STAGE 2: Pull frontend code dynamically
        stage('Automated Pull') {
            steps {
                echo 'Pulling frontend application source files...'
                dir('.') {
                    git url: env.REPO_URL, branch: 'main' // Make sure your frontend branch is also 'main'
                }
            }
        }

        // STAGE 3: Build frontend production container image
        // STAGE 3: BUILD FRONTEND IMAGE PASSING DYNAMIC ARGUMENTS
        stage('Build Image') {
            steps {
                echo "Compiling frontend container version: ${BUILD_NUMBER}"
                sh """
                    sg docker -c 'docker build \
                        --build-arg VITE_API_URL=${env.API_URL} \
                        -t ${DOCKER_HUB_USER}/${IMAGE_NAME}:${BUILD_NUMBER} .'
                """
                sh """
                    sg docker -c 'docker build \
                        --build-arg VITE_API_URL=${env.API_URL} \
                        -t ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest .'
                """
            }
        }

        // STAGE 4: Securely push frontend artifacts to Docker Hub
        stage('Push to Registry') {
            steps {
                echo 'Shipping container to Docker Hub registry...'
                withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDS_ID}", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh "sg docker -c 'echo \${PASS} | docker login -u \${USER} --password-stdin'"
                    sh "sg docker -c 'docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:${BUILD_NUMBER}'"
                    sh "sg docker -c 'docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest'"
                }
            }
        }

        // STAGE 5: Deploy Frontend on the same network as the backend
        stage('Deploy Frontend Service') {
            steps {
                echo 'Spinning up containerized frontend application service...'
                sh """
                    sg docker -c '
                    # Join the same isolated network you created for the backend
                    docker network create sa-net || true
                    
                    # Remove any existing frontend container safely
                    docker rm -f sa-frontend-container || true
                    
                    # Run frontend and hook it into the network
                    docker run -d \
                        --name sa-frontend-container \
                        --network sa-net \
                        -p ${PORT}:${PORT} \
                        -e REACT_APP_API_URL=${API_URL} \
                        ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest
                    '
                """
                echo "Frontend application successfully deployed live!"
            }
        }
    }
}
