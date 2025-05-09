pipeline {
    agent any
    environment {
        FRONTEND_DIR = '/home/ubuntu/frontend'
        GIT_CREDENTIALS_ID = 'github-creds'
        REPO_URL = 'github.com/Angad0691996/Vemee_Fe.git'
    }
    stages {
        stage('git cloning and permission setup') {
            steps {
                script {
                    // Create the directory if it doesn't exist
                    sh """
                        if [ ! -d "${FRONTEND_DIR}" ]; then
                            mkdir -p ${FRONTEND_DIR}
                        fi
                    """

                    // Adjust permissions to avoid potential permission issues
                    sh """
                        sudo chown -R jenkins:jenkins ${FRONTEND_DIR}
                        sudo chmod -R 775 ${FRONTEND_DIR}
                    """

                    // Clean up any previous contents
                    sh """
                        rm -rf ${FRONTEND_DIR}/*
                    """

                    withCredentials([usernamePassword(credentialsId: GIT_CREDENTIALS_ID, usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                        sh """
                            cd ${FRONTEND_DIR}
                            git clone https://${GIT_USER}:${GIT_TOKEN}@${REPO_URL} .
                        """
                    }

                    // Apply permissions after cloning
                    sh """
                        sudo chown -R jenkins:jenkins ${FRONTEND_DIR}
                        sudo chmod -R 775 ${FRONTEND_DIR}
                    """
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
                    sh "pkill -f node || true"
                    sh "nohup npm start > frontend.log 2>&1 &"
                }
            }
        }

        stage('Verify Frontend Running') {
            steps {
                script {
                    sleep 5
                    def frontendStatus = sh(script: "curl -s -o /dev/null -w '%{http_code}' http://localhost:3000", returnStdout: true).trim()

                    if (frontendStatus != "200") {
                        error "Frontend is not running on port 3000. HTTP Status: ${frontendStatus}"
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed. Checking directory structure...'
            sh """
                ls -al ${FRONTEND_DIR}
                tail -n 20 ${FRONTEND_DIR}/frontend.log || echo "No log file found."
            """
        }
        failure {
            echo 'Build or frontend startup failed.'
        }
        success {
            echo 'Build and frontend startup successful.'
        }
    }
}
