pipeline {
    agent any
    environment {
        FRONTEND_DIR = '/home/ubuntu/workspace/Vemee-Fe'
        GIT_CREDENTIALS_ID = 'github-creds'
        REPO_URL = 'github.com/Angad0691996/Vemee_Fe.git'
    }
    stages {
        stage('Checkout') {
            steps {
                script {
                    // Ensure the workspace is created
                    sh "mkdir -p ${FRONTEND_DIR}"

                    // Navigate to the directory and clean it
                    sh "rm -rf ${FRONTEND_DIR}/*"

                    // Clone the repository
                    withCredentials([usernamePassword(credentialsId: GIT_CREDENTIALS_ID, usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                        sh """
                            cd ${FRONTEND_DIR}
                            git clone https://${GIT_USER}:${GIT_TOKEN}@${REPO_URL} .
                        """
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh 'npm install'
                }
            }
        }

        stage('Start Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    // Kill any existing node processes
                    sh "pkill -f node || true"
                    
                    // Start the frontend in the background
                    sh "nohup npm start > frontend.log 2>&1 &"
                }
            }
        }

        stage('Verify Frontend Running') {
            steps {
                script {
                    // Wait for the server to start
                    sleep 5

                    // Check if the frontend is running
                    sh "curl -I http://localhost:3000 || exit 1"
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up and finishing the job.'
        }
        failure {
            echo 'Build or frontend startup failed.'
        }
        success {
            echo 'Build and frontend startup successful.'
        }
    }
}
