# Deployment Guide: GoDaddy + CloudFront (No Route 53)

This guide explains how to connect your S3-hosted project to `studiomintleaf.in` using **GoDaddy DNS** only.

## Architecture
**User** -> **GoDaddy (DNS)** -> **CloudFront (CDN + SSL)** -> **S3 Bucket**

---

## ✅ Deployment Status: COMPLETE

Your site is now fully configured and live!

*   **Website URL**: `https://www.studiomintleaf.in`
*   **Redirect**: `http://studiomintleaf.in` -> `https://www.studiomintleaf.in` (Handled by GoDaddy Forwarding)
*   **SSL**: Active and valid.

---

## How to Update Your Site

To update your website in the future, just run the deployment script in your project folder:

```bash
./deploy.sh
```

This will:
1.  Build your React project.
2.  Upload the new files to S3.
3.  Automatically clear the CloudFront cache so users see the changes instantly.

---

## Troubleshooting

If you see an error immediately after setup:
*   **"Privacy Error" or "Not Secure"**: Wait 15-30 minutes. The new certificate is issued but takes time to propagate to all CloudFront edge locations globally.
*   **"This site can't be reached"**: Check your GoDaddy DNS settings again. Ensure the CNAME for `www` points to `d2k2xfc5u82mf8.cloudfront.net`.
