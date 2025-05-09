pipeline {
    agent { label 'vemeefe' }

    environment {
        REPO_URL = 'https://github.com/Angad0691996/Vemee_Fe.git'
        APP_DIR = '/home/ubuntu/Vemee_Fe'
    }

    stages {
        stage('Setup Node.js and pm2') {
            steps {
                script {
                    echo 'Checking Node.js and pm2 installation...'
                    sh '''
                        if ! command -v node &> /dev/null; then
                            sudo apt update
                            sudo apt install -y nodejs npm
                        fi
                        if ! command -v pm2 &> /dev/null; then
                            sudo npm install -g pm2
                        fi
                    '''
                }
            }
        }

        stage('Clone Repository') {
            steps {
                script {
                    echo 'Cloning repository...'
                    dir('/home/ubuntu') {
                        sh '''
                            if [ ! -d "${APP_DIR}" ]; then
                                git clone ${REPO_URL}
                            else
                                cd ${APP_DIR}
                                git pull
                            fi
                        '''
                    }
                }
            }
        }

        stage('Clear npm Cache') {
            steps {
                script {
                    echo 'Clearing npm cache...'
                    dir(APP_DIR) {
                        sh 'npm cache clean --force'
                    }
                }
            }
        }

        stage('Remove node_modules and package-lock.json') {
            steps {
                script {
                    echo 'Removing node_modules and package-lock.json...'
                    dir(APP_DIR) {
                        sh 'rm -rf node_modules'
                        sh 'rm -f package-lock.json'
                    }
                }
            }
        }

        stage('Reinstall Dependencies') {
            steps {
                script {
                    echo 'Reinstalling dependencies...'
                    dir(APP_DIR) {
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Rebuild Dependencies') {
            steps {
                script {
                    echo 'Rebuilding dependencies...'
                    dir(APP_DIR) {
                        sh 'npm rebuild'
                    }
                }
            }
        }

        stage('Install/Update ajv and ajv-keywords') {
            steps {
                script {
                    echo 'Installing/Updating ajv and ajv-keywords...'
                    dir(APP_DIR) {
                        sh 'npm install ajv@latest'
                        sh 'npm install ajv-keywords@latest'
                    }
                }
            }
        }

        stage('Start Application with pm2') {
            steps {
                script {
                    echo 'Starting the application with pm2...'
                    dir(APP_DIR) {
                        sh '''
                            pm2 delete react-app || true
                            pm2 start npm --name "react-app" -- start -- --host 0.0.0.0
                            pm2 save
                            pm2 startup
                        '''
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up workspace...'
        }
        success {
            echo 'Build completed successfully!'
        }
        failure {
            echo 'Build failed. Check logs for details.'
        }
    }
}
