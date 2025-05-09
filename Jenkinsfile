pipeline {
    agent { label 'vemeefe' }
    environment {
        GIT_CREDENTIALS_ID = 'github-creds'
        REPO_URL = 'github.com/Angad0691996/Vemee_Fe.git'
        CLONE_DIR = '/home/ubuntu'
    }
    stages {
        stage('Git Cloning and Permission Setup') {
            steps {
                script {
                    // Ensure the directory exists and set permissions
                    sh """
                        if [ ! -d "${CLONE_DIR}/Vemee_Fe" ]; then
                            mkdir -p ${CLONE_DIR}/Vemee_Fe
                        fi
                    """
                    // Adjust permissions
                    sh """
                        sudo chown -R jenkins:jenkins ${CLONE_DIR}
                        sudo chmod -R 775 ${CLONE_DIR}
                    """
                    
                    // Clean any previous clone
                    sh """
                        rm -rf ${CLONE_DIR}/Vemee_Fe/*
                    """

                    // Clone the repo using the GitHub credentials
                    withCredentials([usernamePassword(credentialsId: GIT_CREDENTIALS_ID, usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                        sh """
                            cd ${CLONE_DIR}/Vemee_Fe
                            git clone https://${GIT_USER}:${GIT_TOKEN}@${REPO_URL} .
                        """
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                dir("${CLONE_DIR}/Vemee_Fe") {
                    sh 'npm install'
                }
            }
        }

        stage('Start Frontend') {
            steps {
                dir("${CLONE_DIR}/Vemee_Fe") {
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
                ls -al ${CLONE_DIR}/Vemee_Fe
                tail -n 20 ${CLONE_DIR}/Vemee_Fe/frontend.log || echo "No log file found."
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
