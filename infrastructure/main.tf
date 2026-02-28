terraform {
    backend "s3" {
        bucket = "zogy-remote-terraform-state"
        key = "prod/terraform.tfstate"
        region = "eu-west-2"
        dynamodb_table = "terraform-locking-system"
        encrypt = true
    }
}