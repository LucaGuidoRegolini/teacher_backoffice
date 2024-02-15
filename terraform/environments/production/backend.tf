terraform {
  backend "s3" {
    bucket = "terraform-state-teacher-backoffice-project"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
  }
}
