# ANIMAL Blog - Frontend

Interface web para o blog compartilhado de bem-estar animal. Desenvolvido com React, TypeScript e Vite.

## 🚀 Tecnologias

- **React** + **TypeScript**
- **Vite** - Build tool
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **CSS Modules** - Estilização
- **Docker** - Containerização
- **Nginx** - Servidor web

## 📋 Pré-requisitos

- Docker e Docker Compose
- Node.js 18+ (desenvolvimento local)

## 🏃 Como Rodar

### Com Docker (Recomendado)

```bash
# Produção
docker-compose up -d --build

# Usando script de deploy
./deploy.sh
```

### Desenvolvimento Local

```bash
npm install
npm run dev
```

Acesse: http://localhost:5173

## 🔑 Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```env
VITE_API_URL=http://localhost:3000
FRONTEND_PORT=80
```

### Ambientes

- **Desenvolvimento local**: `VITE_API_URL=http://localhost:3000`
- **Produção**: `VITE_API_URL=https://api.seu-dominio.com`

## 🐳 Docker

### Portas
- Frontend: `80` (produção)
- Frontend: `5173` (desenvolvimento local)

### Build Multi-stage

O Dockerfile usa build multi-stage:
1. **Build**: Compila o projeto com Vite
2. **Production**: Serve com Nginx

## 🤖 CI/CD com Jenkins

Este projeto está configurado para deploy automático via Jenkins.

### Configuração

1. Configure credenciais no Jenkins:
   - `VITE_API_URL` - URL da API backend

2. Configure webhook no GitHub:
   - URL: `http://seu-jenkins:8080/github-webhook/`

3. Push no repositório dispara deploy automático

### Pipeline

O `Jenkinsfile` executa:
1. Checkout do código
2. Setup de variáveis
3. Build da imagem Docker
4. Deploy do frontend
5. Health checks

## 📊 Logs

```bash
# Ver logs
docker-compose logs -f

# Logs do Nginx
docker-compose exec frontend cat /var/log/nginx/access.log
docker-compose exec frontend cat /var/log/nginx/error.log
```

## 📱 Funcionalidades

### Visitante (Não autenticado)
- Visualizar feed de posts
- Buscar posts
- Filtrar por categoria (Gatos/Cachorros)
- Ver detalhes e comentários

### Usuário Autenticado
- Todas as funcionalidades de visitante
- Criar, editar e deletar posts próprios
- Curtir posts
- Comentar em posts
- Seguir outros usuários

## 📝 Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/            # App e rotas
│   ├── pages/          # Páginas
│   ├── components/     # Componentes
│   ├── services/       # API client
│   ├── store/          # Context (Auth)
│   └── types/          # TypeScript types
├── public/             # Assets estáticos
├── nginx.conf          # Configuração Nginx
├── Dockerfile
├── docker-compose.yml
├── deploy.sh
├── Jenkinsfile
└── .env.example
```

## 🎨 Design System

- **Cores**: Tokens CSS customizados
- **Espaçamentos**: Sistema consistente
- **Tipografia**: System fonts
- **Componentes**: Button, Input, Textarea, Card, Avatar

## 🔧 Scripts Disponíveis

```bash
npm run dev        # Desenvolvimento
npm run build      # Build para produção
npm run preview    # Preview do build
npm run lint       # Linter
```

## 🌐 Nginx

Configuração customizada em `nginx.conf`:
- Suporte a SPA (Single Page Application)
- Compressão gzip
- Cache de assets estáticos
- Redirecionamento para index.html

## 📄 Licença

TCC - Pós-Graduação em Desenvolvimento Full Stack
