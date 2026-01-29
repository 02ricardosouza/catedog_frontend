pipeline {
    agent any
    
    environment {
        // Nome do projeto
        PROJECT_NAME = 'blog_tcc_frontend'
        
        // Credenciais do servidor VPS (configurar no Jenkins)
        SSH_CREDENTIAL_ID = 'jenkins-vps-key'
        
        // Configurações do servidor VPS
        VPS_HOST = '195.200.6.56'
        VPS_USER = 'root'
        
        // Diretório no VPS onde ficará o projeto
        DEPLOY_PATH = '/opt/blog_tcc_frontend'
        
        // Branch para deploy em produção
        PRODUCTION_BRANCH = 'main'
    }
    
    options {
        // Manter apenas os últimos 10 builds
        buildDiscarder(logRotator(numToKeepStr: '10'))
        
        // Timeout do pipeline
        timeout(time: 30, unit: 'MINUTES')
        
        // Timestamps nos logs
        timestamps()
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📥 Clonando repositório...'
                checkout scm
                
                script {
                    // Pegar informações do commit
                    env.GIT_COMMIT_MSG = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                    env.GIT_AUTHOR = sh(script: 'git log -1 --pretty=%an', returnStdout: true).trim()
                    env.BUILD_VERSION = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
                }
                
                echo "📝 Commit: ${env.GIT_COMMIT_MSG}"
                echo "👤 Autor: ${env.GIT_AUTHOR}"
                echo "🏷️  Versão: ${env.BUILD_VERSION}"
            }
        }
        
        stage('Environment Check') {
            steps {
                echo '🔧 Verificando ambiente...'
                sh '''
                    echo "Docker version: $(docker --version)"
                    echo "Docker Compose version: $(docker compose version)"
                '''
            }
        }
        
        stage('Setup Environment') {
            steps {
                echo '📝 Configurando variáveis de ambiente...'
                withCredentials([
                    string(credentialsId: 'VITE_API_URL_FRONT_BLOG_TCC', variable: 'VITE_API_URL')
                ]) {
                    sh '''
                        echo "VITE_API_URL=${VITE_API_URL}" > .env
                        echo "✅ Arquivo .env criado com VITE_API_URL"
                    '''
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo '🔨 Construindo imagem Docker...'
                script {
                    // Build da imagem com tag da versão
                    sh """
                        docker build -t ${PROJECT_NAME}:${BUILD_VERSION} .
                        docker tag ${PROJECT_NAME}:${BUILD_VERSION} ${PROJECT_NAME}:latest
                    """
                }
            }
        }
        
        stage('Test Docker Image') {
            steps {
                echo '🧪 Testando imagem Docker...'
                script {
                    // Teste básico: verificar se a imagem foi criada corretamente
                    sh "docker images | grep ${PROJECT_NAME}"
                }
            }
        }
        
        stage('Deploy to VPS') {            
            steps {
                echo '🚀 Iniciando deploy para VPS...'
                
                script {
                    // Salvar imagem Docker como arquivo tar
                    sh """
                        docker save ${PROJECT_NAME}:latest | gzip > ${PROJECT_NAME}-${BUILD_VERSION}.tar.gz
                    """
                    
                    // Copiar arquivos necessários para o VPS
                    sshagent(credentials: ["${env.SSH_CREDENTIAL_ID}"]) {
                        sh """
                            # 1. Cria diretório no VPS
                            ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} "mkdir -p ${DEPLOY_PATH}"
                            
                            # 2. Copiar docker-compose.yml
                            echo "📄 Copiando docker-compose.yml..."
                            scp -o StrictHostKeyChecking=no \\
                                docker-compose.yml \\
                                ${VPS_USER}@${VPS_HOST}:${DEPLOY_PATH}/docker-compose.yml
                            
                            # 3. Copiar imagem Docker
                            echo "📦 Copiando imagem Docker..."
                            scp -o StrictHostKeyChecking=no \\
                                ${PROJECT_NAME}-${BUILD_VERSION}.tar.gz \\
                                ${VPS_USER}@${VPS_HOST}:${DEPLOY_PATH}/
                        """
                    }
                }
            }
        }
        
        stage('Run Deployment on VPS') {            
            steps {
                echo '⚙️  Executando deploy no servidor...'
                
                sshagent(credentials: ["${env.SSH_CREDENTIAL_ID}"]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} '
                            cd ${DEPLOY_PATH}
                            
                            # Carregar imagem Docker
                            echo "📦 Carregando imagem Docker..."
                            gunzip -c ${PROJECT_NAME}-${BUILD_VERSION}.tar.gz | docker load
                            
                            # Parar containers antigos
                            echo "🛑 Parando containers antigos..."
                            docker compose down || true
                            
                            # Remover imagem antiga
                            docker image prune -f
                            
                            # Iniciar novos containers
                            echo "🚀 Iniciando novos containers..."
                            docker compose up -d
                            
                            # Aguardar containers ficarem healthy
                            echo "⏳ Aguardando serviços ficarem prontos..."
                            sleep 10
                            
                            # Verificar status
                            echo "✅ Status dos containers:"
                            docker compose ps
                            
                            # Limpar arquivo tar
                            rm -f ${PROJECT_NAME}-${BUILD_VERSION}.tar.gz
                        '
                    """
                }
            }
        }
        
        stage('Health Check') {            
            steps {
                echo '🏥 Verificando saúde da aplicação...'
                
                sshagent(credentials: ["${env.SSH_CREDENTIAL_ID}"]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} '
                            cd ${DEPLOY_PATH}
                            
                            # Verificar se o container está rodando
                            echo "📦 Verificando container..."
                            docker compose ps
                            
                            # Ver logs do container frontend
                            echo "📋 Logs do container (últimas 20 linhas):"
                            docker compose logs --tail 20 frontend
                            
                            # Verificar se o container está realmente rodando
                            if ! docker compose ps frontend | grep -q "Up"; then
                                echo "❌ Container não está em execução normal!"
                                docker compose logs --tail 50 frontend
                                exit 1
                            fi
                            
                            # Aguardar aplicação iniciar completamente
                            echo "⏳ Aguardando aplicação iniciar (10 segundos)..."
                            sleep 10
                            
                            # Tentar health check com retry
                            echo "🔍 Testando endpoint..."
                            for i in 1 2 3 4 5; do
                                echo "Tentativa \$i/5..."
                                if curl -sf http://localhost:8001/ > /dev/null 2>&1; then
                                    echo "✅ Frontend está funcionando!"
                                    exit 0
                                fi
                                sleep 3
                            done
                            
                            echo "❌ Health check falhou após 5 tentativas"
                            docker compose logs --tail 50 frontend
                            exit 1
                        '
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline executado com sucesso!'
            
            // Limpar imagem local
            sh "rm -f ${PROJECT_NAME}-${BUILD_VERSION}.tar.gz || true"
        }
        
        failure {
            echo '❌ Pipeline falhou!'
            
            // Limpar arquivos temporários
            sh "rm -f ${PROJECT_NAME}-${BUILD_VERSION}.tar.gz || true"
        }
        
        always {
            echo '🧹 Limpando workspace...'
            
            // Remover .env por segurança
            sh 'rm -f .env || true'
            
            // Limpar imagens Docker antigas do projeto (manter apenas as 3 mais recentes)
            sh '''
                docker images ${PROJECT_NAME} --format "{{.ID}}" | tail -n +4 | xargs -r docker rmi -f 2>/dev/null || true
            '''
            
            // Limpar containers parados
            sh 'docker container prune -f || true'
            
            // Limpar imagens dangling (sem tag)
            sh 'docker image prune -f || true'
        }
    }
}
