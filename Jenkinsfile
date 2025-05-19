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
                sh 'CI=false npm run build' // Or your preferred build command
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                # Create the target directory with sudo if permissions are an issue
                sudo mkdir -p /var/www/html/vemee_frontend/
                sudo chown -R jenkins:jenkins /var/www/html/vemee_frontend/

                # Remove existing files
                rm -rf /var/www/html/vemee_frontend/*

                # Copy the build output
                cp -r build/* /var/www/html/vemee_frontend/
                '''
            }
        }

        stage('Reload Nginx') {
            steps {
                sh 'sudo systemctl reload nginx'
            }
        }
    }
}