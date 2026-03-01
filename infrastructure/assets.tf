//aws_s3_bucket
resource "aws_s3_bucket" "account_images" {
  bucket = "zogy-images-bucket12"

  tags = {
    Name = "Zogy image bucket"
  }
}

//aws_s3_bucket_public_access_block
resource "aws_s3_bucket_public_access_block" "account_images" {
  bucket = aws_s3_bucket.account_images.id

  block_public_acls = true
  block_public_policy = true
  ignore_public_acls = true
  restrict_public_buckets = true
}

//aws_s3_bucket_ownership_controls
resource "aws_s3_bucket_ownership_controls" "account_images" {
  bucket = aws_s3_bucket.account_images.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

//aws_s3_bucket_policy

//aws_s3_bucket_server_side_encryption_configuration
resource "aws_s3_bucket_server_side_encryption_configuration" "account_images_encryption" {
  bucket = aws_s3_bucket.account_images.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

//aws_s3_bucket_versioning
resource "aws_s3_bucket_versioning" "account_images_versioning" {
  bucket = aws_s3_bucket.account_images.id
  versioning_configuration {
    status = "Enabled"
  }
}