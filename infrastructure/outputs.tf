output "account_images_cloudfront_domain" {
  value = aws_cloudfront_distribution.account_images.domain_name
}

output "account_images_bucket_name" {
  value = aws_s3_bucket.account_images.bucket
}

output "account_images_access_key_id" {
  value = aws_iam_access_key.account_images_uploader.id
}

output "account_images_secret_access_key" {
  value     = aws_iam_access_key.account_images_uploader.secret
  sensitive = true
}