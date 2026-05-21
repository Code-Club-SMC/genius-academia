# Nginx Deployment Instructions

## 1. Update the server_name

The config is already set to `server_name 72.62.197.86;`. Update if your IP changes.

## 2. Copy to Nginx sites-available

```bash
sudo cp genius-academia.conf /etc/nginx/sites-available/genius-academia
```

## 3. Enable the site

```bash
sudo ln -sf /etc/nginx/sites-available/genius-academia /etc/nginx/sites-enabled/
```

## 4. Remove default site (optional)

```bash
sudo rm -f /etc/nginx/sites-enabled/default
```

## 5. Test configuration

```bash
sudo nginx -t
```

## 6. Reload Nginx

```bash
sudo systemctl reload nginx
```

## 7. Verify

```bash
curl http://your_domain_or_IP/
curl http://your_domain_or_IP/api/
```
