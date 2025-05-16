pipeline {
    agent any

    environment {
        CLONE_DIR = "${env.WORKSPACE}"  // Use actual Jenkins workspace
    }

    stages {
        stage('Ensure Missing Files Exist') {
            steps {
                dir("${CLONE_DIR}") {
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
                dir("${CLONE_DIR}") {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir("${CLONE_DIR}") {
                    sh 'npm run build'
                }
            }
        }

        stage('Serve Frontend') {
            when {
                expression {
                    fileExists("${CLONE_DIR}/build/index.html")
                }
            }
            steps {
                dir("${CLONE_DIR}") {
                    sh '''
                        nohup npx serve -s build > serve.log 2>&1 &
                        echo "Frontend served successfully on default port."
                    '''
                }
            }
        }
    }

    post {
        failure {
            echo '❌ Deployment failed. Check logs for more info.'
        }
        success {
            echo '✅ Deployment successful.'
        }
    }
}
