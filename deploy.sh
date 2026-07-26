#!/bin/bash

# Smita Portfolio Deployment Script
echo "🚀 Deploying Smita Portfolio to AWS S3"

# Build the project
echo "📦 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
    
    # Deploy to S3
    echo "☁️  Deploying to S3 bucket..."
    aws s3 sync dist/ s3://smita-portfolio-website-2025 --delete --exclude ".DS_Store" --exclude "*/.DS_Store"
    
    if [ $? -eq 0 ]; then
        echo "✅ Deployment successful!"
        echo "🌐 S3 Website URL: http://smita-portfolio-website-2025.s3-website-us-east-1.amazonaws.com"
        
        # CloudFront Invalidation
        # TODO: Replace DISTRIBUTION_ID with your actual CloudFront Distribution ID
        DISTRIBUTION_ID="E2TRVPTYB00P30" 
        
        if [ -n "$DISTRIBUTION_ID" ]; then
            echo "🔄 Invalidating CloudFront cache..."
            aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
            if [ $? -eq 0 ]; then
                echo "✅ Cache invalidation initiated"
                echo "🔗 Live Domain: https://studiomintleaf.in"
            else
                echo "⚠️  Cache invalidation failed"
            fi
        else
            echo "⚠️  CloudFront Distribution ID not set in script. Skipping invalidation."
            echo "   (Add DISTRIBUTION_ID to deploy.sh to enable auto-invalidation)"
        fi
        
    else
        echo "❌ Deployment failed"
        exit 1
    fi
else
    echo "❌ Build failed"
    exit 1
fi
