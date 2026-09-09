pipeline {

    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out ShopKart source code...'
                checkout scm
            }
        }

        stage('Verify Environment') {
            steps {
                sh '''
                    echo "===== NODE ====="
                    node --version

                    echo "===== NPM ====="
                    npm --version

                    echo "===== GIT ====="
                    git --version

                    echo "===== DOCKER ====="
                    docker --version

                    echo "===== DOCKER COMPOSE ====="
                    docker compose version
                '''
            }
        }

        stage('Backend Install') {
            steps {
                sh '''
                    cd backend
                    npm ci
                '''
            }
        }

        stage('Frontend Install') {
            steps {
                sh '''
                    cd frontend
                    npm ci
                '''
            }
        }

        stage('Backend Test') {
            steps {
                sh '''
                    cd backend

                    echo "Running backend tests..."

                    if npm run test --if-present; then
                        echo "Backend tests completed."
                    else
                        echo "Backend tests failed."
                        exit 1
                    fi
                '''
            }
        }

        stage('Frontend Build') {
            steps {
                sh '''
                    cd frontend

                    echo "Building frontend..."

                    if npm run build --if-present; then
                        echo "Frontend build completed."
                    else
                        echo "Frontend build failed."
                        exit 1
                    fi
                '''
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                    echo "Building ShopKart Docker images..."

                    docker build \
                        -t shopkart-backend:${BUILD_NUMBER} \
                        ./backend

                    docker build \
                        -t shopkart-frontend:${BUILD_NUMBER} \
                        ./frontend
                '''
            }
        }

        stage('Docker Images') {
            steps {
                sh '''
                    echo "ShopKart Docker images created:"
                    docker images | grep shopkart
                '''
            }
        }
    }

    post {

        success {
            echo '''
            =========================================
             SHOPKART CI + DOCKER BUILD SUCCESS
            =========================================
            '''
        }

        failure {
            echo '''
            =========================================
             SHOPKART CI FAILED
            =========================================
            '''
        }
    }
}