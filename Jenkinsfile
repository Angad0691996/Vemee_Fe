pipeline {
    agent { label 'vemeefe' }

    environment {
        GIT_CREDENTIALS_ID = 'github-creds'
        REPO_URL = 'https://github.com/Angad0691996/Vemee_Fe.git'
        CLONE_DIR = '/home/ubuntu'
        BRANCH = 'main'
    }

    stages {
        stage('Clone Repository') {
            steps {
                dir("${CLONE_DIR}") {
                    git branch: "${BRANCH}",
                        credentialsId: "${GIT_CREDENTIALS_ID}",
                        url: "https://${REPO_URL}"
                }
            }
        }

        stage('Ensure Missing Files Exist') {
            steps {
                dir("${CLONE_DIR}/Vemee_Fe") {
                    sh '''
                        mkdir -p src/components
                        echo "import React from 'react';

const ReactMeet = () => {
  return (
    <div>
      <h2>React Meet Component</h2>
      <p>This is a placeholder for the ReactMeet component.</p>
    </div>
  );
};

export default ReactMeet;" > src/components/ReactMeet.js
                    '''
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

        stage('Build Frontend') {
            steps {
                dir("${CLONE_DIR}/Vemee_Fe") {
                    sh 'npm run build'
                }
            }
        }

        stage('Serve Frontend') {
            steps {
                dir("${CLONE_DIR}/Vemee_Fe") {
                    sh 'nohup serve -s build -l 3000 &'
                }
            }
        }
    }

    post {
        failure {
            echo '❌ Deployment failed. Check logs for more info.'
        }
    }
}
