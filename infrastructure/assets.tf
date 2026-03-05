//aws_s3_bucket
resource "aws_s3_bucket" "account_images" {
  bucket = var.account_images_bucket_name
  tags   = var.account_images_tags
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
    object_ownership = var.account_images_object_ownership
  }
}

//aws_s3_bucket_server_side_encryption_configuration
resource "aws_s3_bucket_server_side_encryption_configuration" "account_images_encryption" {
  bucket = aws_s3_bucket.account_images.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = var.account_images_sse_algorithm
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

//aws_cloudfront_origin_access_control
resource "aws_cloudfront_origin_access_control" "account_images" {
  name = var.account_images_oac_name
  description = var.account_images_oac_description
  origin_access_control_origin_type = "s3"
  signing_behavior = "always"
  signing_protocol = "sigv4"
}

//aws_cloudfront_distribution
resource "aws_cloudfront_distribution" "account_images" {
  enabled = true
  is_ipv6_enabled = true
  comment = "Account images CDN"

  origin {
    domain_name = aws_s3_bucket.account_images.bucket_regional_domain_name
    origin_id = local.account_images_origin_id
    origin_access_control_id = aws_cloudfront_origin_access_control.account_images.id
  }

  default_cache_behavior {
    target_origin_id = local.account_images_origin_id
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = ["GET", "HEAD", "OPTIONS"]
    cached_methods  = ["GET", "HEAD", "OPTIONS"]

    compress = true

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl = 0
    default_ttl = 86400 //1 day
    max_ttl = 31536000 //1 year
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = var.account_images_tags
}

//aws_iam_policy_document
data "aws_iam_policy_document" "account_images_bucket_policy" {
  statement {
    sid = "AllowCloudFrontReadOnly"
    effect = "Allow"

    actions = [
      "s3:GetObject",
    ]

    resources = [
      "${aws_s3_bucket.account_images.arn}/*"
    ]

    principals {
      type = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test = "StringEquals"
      variable = "AWS:SourceArn"
      values = [aws_cloudfront_distribution.account_images.arn]
    }
  }
}

//aws_s3_bucket_policy
resource "aws_s3_bucket_policy" "account_images" {
  bucket = aws_s3_bucket.account_images.id
  policy = data.aws_iam_policy_document.account_images_bucket_policy.json
}

//aws_iam_user
resource "aws_iam_user" "account_images_uploader" {
  name = "${var.project_name}-${var.environment}-account-images-uploader"

  tags = {
    Project = var.project_name
    Environment = var.environment
  }
}

//aws_iam_user_policy_document
data "aws_iam_policy_document" "account_images_uploader_policy" {
  statement {
    effect = "Allow"
    actions = ["s3:ListBucket"]
    resources = [aws_s3_bucket.account_images.arn]
  }

   statement {
    effect = "Allow"
    actions = [
      "s3:PutObject",
      "s3:GetObject",
      "s3:DeleteObject"
    ]
    resources = ["${aws_s3_bucket.account_images.arn}/product-images/*"]
  }
}

//aws_iam_user_policy
resource "aws_iam_user_policy" "account_images_uploader" {
  user   = aws_iam_user.account_images_uploader.name
  policy = data.aws_iam_policy_document.account_images_uploader_policy.json
}

//aws_iam_access_key
resource "aws_iam_access_key" "account_images_uploader" {
  user = aws_iam_user.account_images_uploader.name
}

//aws_s3_bucket_lifecycle_configuration
resource "aws_s3_bucket_lifecycle_configuration" "account_images_lifecycle" {
  bucket = aws_s3_bucket.account_images.id

  rule {
    id = "delete-old-versions"
    status = "Enabled"
    filter {}

    noncurrent_version_expiration {
      noncurrent_days = 30
    }
  }
}