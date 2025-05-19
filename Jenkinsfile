pipeline {
    agent any
    stages {
        stage('Clone Repo') {
            steps {
                dir('/home/angad/Jenkins_CICDs/Vemee_frontend') {
                    checkout([$class: 'GitSCM',
                        branches: [[name: 'main']],
                        userRemoteConfigs: [[
                            url: 'https://github.com/Angad0691996/Vemee_Fe.git',
                            credentialsId: 'git-cred'
                        ]]
                    ])
                    sh 'pwd'
                    sh 'ls -la'
                }
            }
        }
    }
}
