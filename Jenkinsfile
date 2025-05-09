pipeline {
    agent { label 'vemee-fe' }

    environment {
        NODE_ENV = 'production'
    }

    stages {
        stage('Declarative: Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Setup Node.js and pm2') {
            steps {
                script {
                    echo 'Checking Node.js and pm2 installation...'
                    sh '''
                        sudo apt update
                        sudo apt install -y nodejs npm
                        sudo npm install -g pm2
                    '''
                }
            }
        }

        stage('Clear npm Cache') {
            steps {
                script {
                    echo 'Clearing npm cache...'
                    sh 'sudo npm cache clean --force'
                }
            }
        }

        stage('Remove node_modules and package-lock.json') {
            steps {
                script {
                    echo 'Removing node_modules and package-lock.json...'
                    sh 'rm -rf node_modules package-lock.json'
                }
            }
        }

        stage('Reinstall Dependencies') {
            steps {
                script {
                    echo 'Reinstalling npm dependencies...'
                    sh 'sudo npm install'
                }
            }
        }

        stage('Start Application with pm2') {
            steps {
                script {
                    echo 'Starting the application with pm2...'
                    sh '''
                        pm2 start npm --name "your-app-name" -- start
                    '''
                }
            }
        }
        
        stage('Declarative: Post Actions') {
            steps {
                echo 'Cleaning up workspace...'
                cleanWs()
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
        }
    }
}
