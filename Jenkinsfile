pipeline {
    agent any

    environment {
        FRONTEND_DIR = '/home/ubuntu' // Adjust the path if needed
        GIT_CREDENTIALS_ID = 'github-creds' 
        REPO_URL = 'https://github.com/Angad0691996/Vemee_Fe.git'
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    // Clone the repository using the provided credentials
                    withCredentials([usernamePassword(credentialsId: "${env.GIT_CREDENTIALS_ID}", usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                        sh """
                            rm -rf ${env.FRONTEND_DIR}
                            git clone https://${GIT_USER}:${GIT_TOKEN}@${env.REPO_URL} ${env.FRONTEND_DIR}
                        """
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                dir("${env.FRONTEND_DIR}") {
                    script {
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Start Frontend') {
            steps {
                dir("${env.FRONTEND_DIR}") {
                    script {
                        sh 'HOST=0.0.0.0 npm start &'
                    }
                }
            }
        }

        stage('Verify Frontend Running') {
            steps {
                script {
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
