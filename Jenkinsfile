pipeline {
    agent { label 'react-node' }  // Ensure the label matches your node configuration

    environment {
        NODE_VERSION = "18.20.8"
        BUILD_DIR = "/var/www/react-app"  // Adjust this as needed
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Setup Node.js') {
            steps {
                echo 'Setting up Node.js...'
                sh """
                    nvm install ${NODE_VERSION}
                    nvm use ${NODE_VERSION}
                    node -v
                    npm -v
                """
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                echo 'Building the React app...'
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying to ${BUILD_DIR}..."
                sh """
                    sudo rm -rf ${BUILD_DIR}/*
                    sudo cp -r build/* ${BUILD_DIR}/
                """
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed.'
        }
    }
}
