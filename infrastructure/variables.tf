variable "account_images_bucket_name" {
  type = string
  description = "Global unique S3 bucket name for account images"
}

variable "account_images_tags" {
  type = map(string)
  description = "Tags for the account images bucket"
  default = {}
}

variable "account_images_object_ownership" {
  type = string
  description = "S3 object ownership setting"
  default = "BucketOwnerPreferred"
}

variable "account_images_sse_algorithm" {
  type = string
  description = "S3 default encryption algorithm"
  default = "AES256"
}

variable "account_images_oac_name" {
  type = string
  description = "CloudFront Origin Access Control name for account images"
  default = "account_images_oac"
}

variable "account_images_oac_description" {
  type = string
  description = "CloudFront Origin Access Control description for account images"
  default = "OAC for account images bucket"
}

variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}
