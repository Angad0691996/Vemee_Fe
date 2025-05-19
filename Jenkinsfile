pipeline {
    agent any

    environment {
        REACT_APP_DIR = 'frontend' // change if your React app is in a subfolder
        DEPLOY_DIR = '/var/www/html/vemee_frontend'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                dir("${REACT_APP_DIR}") {
                    sh 'npm install'
                }
            }
        }

        stage('Build React app') {
            steps {
                dir("${REACT_APP_DIR}") {
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy to nginx') {
            steps {
                // Clean old deployment and copy new build
                sh """
                   sudo rm -rf ${DEPLOY_DIR}/*
                   sudo cp -r ${REACT_APP_DIR}/build/* ${DEPLOY_DIR}/
                """

                // Update nginx config with React root and client routing fix
                sh '''sudo bash -c "cat > /etc/nginx/sites-available/default <<EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html/vemee_frontend;
    index index.html index.htm;

    server_name _;

    location / {
        try_files \$uri /index.html;
    }
}
EOF"'''

                // Test and reload nginx
                sh 'sudo nginx -t'
                sh 'sudo systemctl reload nginx'
            }
        }
    }
}
