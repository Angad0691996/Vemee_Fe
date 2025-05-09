pipeline {
    agent any

    environment {
        FRONTEND_DIR = '/path/to/your/frontend' // Path to your frontend directory
    }

    stages {
        stage('Checkout') {
            steps {
                // Clone the repository (if not done already)
                git 'https://github.com/your/repository.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                dir("${env.FRONTEND_DIR}") {
                    // Install npm packages
                    script {
                        sh 'npm install' // Or use 'yarn install' if you're using yarn
                    }
                }
            }
        }

        stage('Start Frontend') {
            steps {
                dir("${env.FRONTEND_DIR}") {
                    // Start the frontend application, binding to all IP addresses
                    script {
                        sh 'HOST=0.0.0.0 npm start' // Or use 'yarn start' if you're using yarn
                    }
                }
            }
        }

        stage('Verify Frontend Running') {
            steps {
                script {
                    // Ensure the frontend is accessible
                    def status = sh(script: "curl -s -o /dev/null -w '%{http_code}' http://13.233.121.244:3000", returnStdout: true).trim()
                    if (status != '200') {
                        error("Frontend is not accessible at http://13.233.121.244:3000/")
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Cleaning up and finishing the job."
        }

        success {
            echo "Build and frontend startup succeeded!"
        }

        failure {
            echo "Build or frontend startup failed."
        }
    }
}
