pipeline {
    
    agent any
         environment {
        registry = "322439140681.dkr.ecr.ap-south-1.amazonaws.com/heal-prd-adminweb-repo"
         }
         
    stages {
        
        stage('Code Checkout') {
            steps {
            checkout([$class: 'GitSCM', branches: [[name: '*/master']], extensions: [], userRemoteConfigs: [[credentialsId: 'f4a367a4-71b1-4c69-af88-e0b803bcb55f', url: 'https://git.cnetric.com/healthuno/admin-website.git']]])
            }
        }
        stage ('Docker Build') {
            steps {
                script {
                    dockerImage = docker.build registry
                        }
            }
        }
        stage ('Docker Push to ECR') {
            steps {
                script {
                    sh 'aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 322439140681.dkr.ecr.ap-south-1.amazonaws.com'
                    sh 'docker push 322439140681.dkr.ecr.ap-south-1.amazonaws.com/heal-prd-adminweb-repo:latest'
                }
            }
        }
        stage ('Remove Docker Image') {
         steps {
            sh 'docker rmi 322439140681.dkr.ecr.ap-south-1.amazonaws.com/heal-prd-adminweb-repo'
         }
       }
         stage('Update ECS Task') {
             steps {
                 script {
                        sh 'aws ecs update-service --force-new-deployment --service adminweb-prd-service --cluster heal-prd-cluster'
                 }
             }
         }
//        stage('Terraform Checkout'){
//            steps {
//                checkout([$class: 'GitSCM', branches: [[name: '*/dev']], extensions: [], userRemoteConfigs: [[credentialsId: 'f4a367a4-71b1-4c69-af88-e0b803bcb55f', url: 'http://3.6.243.214/terraform/react.git']]])
//            }
//        }
//        stage ('Terraform Initialization'){
//           steps {
//                sh 'terraform init'
//           }
//        }
        
//        stage ('Terraform Destroy'){
//            steps {
//                sh 'terraform destroy --auto-approve'
//            }
//        }
        
//        stage ('Terraform Apply'){
//            steps {
//                sh 'terraform apply --auto-approve'
//            }
//        } 
        stage ('AWS Resource Allocation') {
            steps {
            echo "Commencing"
            sleep(180)
            echo "Completed"
            }
        }
    }
post {
  unsuccessful {
        emailext attachLog: true, body: 'Build Status Attached', subject: 'Healthuno Adminweb-PRODUCTION build failed', to: 'hunoqa@cnetric.com'
        }
    }
}
