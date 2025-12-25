# Deployment Guide: S3 to Custom Domain with HTTPS

This guide explains how to connect your S3-hosted React project (`smita-portfolio`) to the domain `studiomintleaf.in` using AWS CloudFront and your existing ACM certificate.

## Architecture
**User** -> **Route 53 (DNS)** -> **CloudFront (CDN + SSL)** -> **S3 Bucket (Hosting)**

---

## Status Update
✅ **CloudFront Distribution Created**: `E2TRVPTYB00P30`
✅ **Domain Name**: `d2k2xfc5u82mf8.cloudfront.net`
✅ **Deployment Script**: Updated with Distribution ID.
✅ **Route 53 Hosted Zone**: Created (`Z098511432NC4B4PWZXII`)
✅ **Route 53 Alias**: Created (Points `studiomintleaf.in` to CloudFront).

---

## Final Step: Switch DNS to AWS Route 53

Since GoDaddy does not allow "CNAME on Root" (and your certificate only works for the root domain), the best solution is to move DNS management to AWS Route 53.

### ⚠️ IMPORTANT: Email & Other Records
Before switching nameservers, you must ensure any existing records (like Email, TXT verification, etc.) are copied to Route 53.
*   If you have **GoDaddy Email** (Microsoft 365), you need to find your MX, CNAME, and TXT records in GoDaddy and recreate them in Route 53.
*   If you only have the "WebsiteBuilder" record, you can ignore it.

### How to Switch
1.  Go to **GoDaddy** -> **Domain Settings** -> **DNS Management**.
2.  Scroll down to **Nameservers**.
3.  Click **Change**.
4.  Select **"I'll use my own nameservers"** (Advanced).
5.  Enter these 4 nameservers:
    *   `ns-411.awsdns-51.com`
    *   `ns-1310.awsdns-35.org`
    *   `ns-876.awsdns-45.net`
    *   `ns-2044.awsdns-63.co.uk`
6.  Click **Save**.

### What Happens Next?
*   It may take **1-48 hours** for DNS changes to propagate globally (usually happens within 1 hour).
*   Once propagated, `https://studiomintleaf.in` will load your site via CloudFront.

---

## How to Deploy

Simply run the deployment script. It will build the app, upload to S3, and tell CloudFront to refresh the cache.

```bash
./deploy.sh
```
