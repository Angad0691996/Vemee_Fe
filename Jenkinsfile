node {
    ws('/home/angad/Jenkins_CICDs/Vemee_frontend') {
        stage('Clone Repo') {
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
