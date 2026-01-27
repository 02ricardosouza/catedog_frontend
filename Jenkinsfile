pipeline {
    agent any
    
    environment {
        COMPOSE_PROJECT_NAME = 'animal_blog_frontend'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📥 Checking out frontend code from GitHub...'
                checkout scm
            }
        }
        
        stage('Environment Setup') {
            steps {
                echo '🔧 Setting up environment variables...'
                withCredentials([
                    string(credentialsId: 'VITE_API_URL', variable: 'VITE_API_URL')
                ]) {
                    sh '''
                        cat > .env <<EOF
VITE_API_URL=${VITE_API_URL}
FRONTEND_PORT=80
EOF
                    '''
                }
            }
        }
        
        stage('Stop Old Containers') {
            steps {
                echo '🛑 Stopping old containers...'
                sh 'docker-compose down || true'
            }
        }
        
        stage('Build') {
            steps {
                echo '🏗️ Building frontend Docker image...'
                sh 'docker-compose build --no-cache'
            }
        }
        
        stage('Deploy') {
            steps {
                echo '🚀 Deploying frontend...'
                sh 'docker-compose up -d'
            }
        }
        
        stage('Health Check') {
            steps {
                echo '🏥 Performing health check...'
                script {
                    def maxRetries = 10
                    def retryInterval = 3
                    def healthy = false
                    
                    for (int i = 0; i < maxRetries; i++) {
                        sleep retryInterval
                        def result = sh(script: 'curl -sf http://localhost:80/', returnStatus: true)
                        if (result == 0) {
                            healthy = true
                            break
                        }
                        echo "Attempt ${i + 1}/${maxRetries} failed, retrying..."
                    }
                    
                    if (!healthy) {
                        error('Health check failed after maximum retries')
                    }
                }
            }
        }
        
        stage('Cleanup') {
            steps {
                echo '🧹 Cleaning up old Docker resources...'
                sh 'docker system prune -f --volumes --filter "until=24h" || true'
            }
        }
    }
    
    post {
        success {
            echo '✅ Frontend deployment successful!'
        }
        failure {
            echo '❌ Frontend deployment failed!'
            sh 'docker-compose logs --tail=100 || true'
        }
        always {
            sh 'rm -f .env || true'
        }
    }
}
