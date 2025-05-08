pipeline {
    agent { label 'vemeefe' }

    environment {
        REPO_URL = 'https://github.com/Angad0691996/Vemee_Fe.git'
        APP_DIR = '/home/ubuntu/Vemee_Fe'
    }

    stages {
        stage('Clone Repository') {
            steps {
                script {
                    echo 'Cloning repository...'
                    dir('/home/ubuntu') {
                        sh "git clone ${REPO_URL}"
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

        stage('Start Development Server') {
            steps {
                script {
                    echo 'Starting the development server...'
                    dir(APP_DIR) {
                        sh 'npm start'
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
