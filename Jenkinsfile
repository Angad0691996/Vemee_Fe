pipeline {
    agent {
        // 'any' or a label, with customWorkspace inside
        any {
            customWorkspace '/home/angad/Jenkins_CICDs/Vemee_frontend'
        }
    }
    stages {
        stage('Clone Repo') {
            steps {
                checkout([$class: 'GitSCM',
                    branches: [[name: 'main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/Angad0691996/Vemee_Fe.git',
                        credentialsId: 'git-cred'
                    ]]
                ])
                // Just to verify files got cloned
                sh 'pwd'
                sh 'ls -la'
            }
        }
    }
}
