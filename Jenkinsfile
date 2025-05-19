pipeline {
    agent {
        label 'any'
        customWorkspace '/home/angad/Jenkins_CICDs/Vemee_frontend'
    }

    stages {
        stage('Clone Repository') {
            steps {
                // Clone repo with credentials
                checkout([$class: 'GitSCM',
                    branches: [[name: 'main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/Angad0691996/Vemee_Fe.git',
                        credentialsId: 'git-cred'
                    ]]
                ])

                sh 'ls -la'
            }
        }
    }
}


