pipeline {
    agent { label 'any' }

    options {
        // Set the custom workspace for the entire pipeline
        customWorkspace '/home/angad/Jenkins_CICDs/Vemee_frontend'
    }

    stages {
        stage('Clone Repository') {
            steps {
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
