pipeline {
    agent any

    stages {
        stage('Clone Repo') {
            steps {
                checkout([$class: 'GitSCM',
                    branches: [[name: 'main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/Angad0691996/Vemee_Fe.git',
                        credentialsId: 'git-cred'
                    ]]
                ])
                sh 'pwd'
                sh 'ls -la'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'CI=false npm run build'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                sudo mkdir -p /var/www/html/vemee_frontend/
                sudo chown -R jenkins:jenkins /var/www/html/vemee_frontend/

                rm -rf /var/www/html/vemee_frontend/*

                cp -r build/* /var/www/html/vemee_frontend/
                '''
            }
        }

        stage('Configure Nginx') {
            steps {
                sh '''
                sudo bash -c 'cat > /etc/nginx/sites-available/default << EOF
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
EOF
'
                sudo nginx -t
                sudo systemctl reload nginx
                '''
            }
        }
    }
}
