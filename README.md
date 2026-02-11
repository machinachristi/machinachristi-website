# Machina Christi Website

A simple, modern landing page for machinachristi.com.

## Project Structure

```
.
├── index.html              # Main HTML file
├── styles.css              # Stylesheet
├── staticwebapp.config.json # Azure Static Web Apps configuration
└── README.md               # This file
```

## Local Development

Simply open `index.html` in your browser to view the site locally.

## Deployment to Azure Static Web Apps

### Prerequisites
- Azure account
- Azure CLI installed (or use Azure Portal)

### Deployment Steps

#### Option 1: Using Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new "Static Web App" resource
3. Configure the deployment:
   - **Basics**: Choose your subscription, resource group, and name
   - **Deployment details**:
     - Source: GitHub/GitLab (or other)
     - If using GitHub: Authorize and select your repository
   - **Build Details**:
     - Build Presets: Custom
     - App location: `/` (root)
     - Api location: Leave empty
     - Output location: `/` (root)
4. Review and create

#### Option 2: Using Azure CLI

```bash
# Login to Azure
az login

# Create a resource group (if needed)
az group create --name machinachristi-rg --location eastus

# Deploy the static web app
az staticwebapp create \
  --name machinachristi \
  --resource-group machinachristi-rg \
  --source . \
  --location eastus \
  --branch main \
  --app-location "/" \
  --output-location "/"
```

#### Option 3: Manual Deployment with SWA CLI

```bash
# Install Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Deploy
swa deploy --app-location . --output-location . --deployment-token <YOUR_DEPLOYMENT_TOKEN>
```

### Custom Domain Setup

After deployment, configure your custom domain (machinachristi.com):

1. In Azure Portal, go to your Static Web App resource
2. Navigate to "Custom domains"
3. Click "Add" and follow the wizard
4. Add the provided DNS records to your domain registrar
5. Validate and configure

## Features

- Responsive design that works on all devices
- Modern gradient background
- Clean, minimalist layout
- Ready for Azure Static Web Apps deployment

## Customization

- Edit `index.html` to change content
- Modify `styles.css` to adjust colors, fonts, and layout
- Update email in the contact button

## License

All rights reserved.
