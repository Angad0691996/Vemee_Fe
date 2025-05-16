pipeline {
    agent { label 'vemeefe' }

    environment {
        GIT_CREDENTIALS_ID = 'github-creds'
        REPO_URL = 'https://github.com/Angad0691996/Vemee_Fe.git'
        CLONE_DIR = '/home/ubuntu/Vemee_Fe'
        NODE_VERSION = '18'
    }

    stages {
        stage('Clone Repository') {
            steps {
                dir(CLONE_DIR) {
                    git branch: 'main',
                        credentialsId: "${GIT_CREDENTIALS_ID}",
                        url: "${REPO_URL}"
                }
            }
        }

        stage('Install Node.js (if missing)') {
            steps {
                sh '''
                if ! command -v node > /dev/null; then
                    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
                    sudo apt-get install -y nodejs
                fi
                node -v
                npm -v
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                dir(CLONE_DIR) {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir(CLONE_DIR) {
                    sh 'npm run build'
                }
            }
        }

        stage('Serve Frontend') {
            steps {
                dir(CLONE_DIR) {
                    sh '''
                    # Kill previous process if serve is running on port 3000
                    if lsof -i:3000 > /dev/null; then
                        sudo kill $(lsof -t -i:3000)
                    fi

                    # Install serve globally if not already
                    if ! command -v serve > /dev/null; then
                        sudo npm install -g serve
                    fi

                    # Run the app on port 3000
                    nohup serve -s build -l 3000 > serve.log 2>&1 &
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ App deployed successfully at http://13.233.251.155:3000/"
        }
        failure {
            echo "❌ Deployment failed. Check logs for more info."
        }
    }
}
