# SGCJ - Sistema de Gestão de Clientes - Automated Deployment Script
# This script deploys the SGCJ system to Supabase, Render, and Vercel

# Color output for better readability
function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Cyan
}

function Write-Step {
    param([string]$Message)
    Write-Host "📍 $Message" -ForegroundColor Yellow
}

# Clear screen
Clear-Host
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host "  SGCJ - Sistema de Gestão de Clientes" -ForegroundColor Blue
Write-Host "  Automated Deployment Script" -ForegroundColor Blue
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host ""

# Step 1: Check prerequisites
Write-Step "Step 1: Checking Prerequisites"
Write-Host ""

# Check if Node.js is installed
if (-not (Test-Path "C:\Program Files\nodejs\node.exe") -and -not (Test-Path "C:\Program Files (x86)\nodejs\node.exe")) {
    Write-Error-Custom "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
}
Write-Success "Node.js is installed"

# Check if Git is installed
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error-Custom "Git is not installed. Please install Git from https://git-scm.com"
    exit 1
}
Write-Success "Git is installed"

# Check if npm is installed
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error-Custom "npm is not installed. Please install Node.js which includes npm"
    exit 1
}
Write-Success "npm is installed"

Write-Host ""

# Step 2: Create .env file
Write-Step "Step 2: Setting up Environment Variables"
Write-Host ""

if (Test-Path ".env") {
    Write-Info ".env file already exists. Skipping..."
} else {
    # Copy .env.example to .env
    Copy-Item ".env.example" ".env"
    Write-Success "Created .env file from template"
    Write-Info "Please edit .env with your credentials:"
    Write-Host ""
    Write-Host "Required variables:"
    Write-Host "1. Supabase:"
    Write-Host "   - VITE_SUPABASE_URL"
    Write-Host "   - VITE_SUPABASE_ANON_KEY"
    Write-Host "   - SUPABASE_SERVICE_ROLE_KEY"
    Write-Host ""
    Write-Host "2. Backend:"
    Write-Host "   - JWT_SECRET"
    Write-Host "   - API_PORT"
    Write-Host ""
    Write-Host "3. Frontend:"
    Write-Host "   - VITE_API_URL"
    Write-Host ""
    Write-Host "4. WhatsApp:"
    Write-Host "   - WHATSAPP_API_TOKEN"
    Write-Host "   - WHATSAPP_PHONE_ID"
    Write-Host "   - WHATSAPP_NUMERO_EMPRESA"
    Write-Host "   - WHATSAPP_VERIFY_TOKEN"
    Write-Host ""

    # Prompt user to continue after editing .env
    Read-Host "Press Enter after editing .env file with your credentials"
}

Write-Host ""

# Step 3: Install Dependencies
Write-Step "Step 3: Installing Dependencies"
Write-Host ""

Write-Info "Installing backend dependencies..."
Set-Location "apps/backend"
npm install
Set-Location "../.."
Write-Success "Backend dependencies installed"

Write-Info "Installing frontend dependencies..."
Set-Location "apps/web"
npm install
Set-Location "../.."
Write-Success "Frontend dependencies installed"

Write-Host ""

# Step 4: Display next steps
Write-Step "Step 4: Next Steps for Production Deployment"
Write-Host ""

Write-Host "1. Create Supabase Project:"
Write-Host "   • Visit https://supabase.com/dashboard"
Write-Host "   • Create a new project (name: sgcj-production)"
Write-Host "   • Copy your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY"
Write-Host "   • Update .env file with these values"
Write-Host ""

Write-Host "2. Set up Database:"
Write-Host "   • In Supabase, go to SQL Editor"
Write-Host "   • Run the migration file: apps/backend/migrations/001_initial_schema.sql"
Write-Host "   • This creates all 9 required tables"
Write-Host ""

Write-Host "3. Seed Test Users:"
Write-Host "   • Run: cd apps/backend && npm run seed"
Write-Host "   • This creates 7 test users with email/password"
Write-Host ""

Write-Host "4. Deploy Backend to Render:"
Write-Host "   • Visit https://render.com"
Write-Host "   • Create a new Web Service"
Write-Host "   • Connect to your GitHub repo"
Write-Host "   • Set environment variables from .env"
Write-Host "   • Deploy"
Write-Host ""

Write-Host "5. Deploy Frontend to Vercel:"
Write-Host "   • Visit https://vercel.com"
Write-Host "   • Import your GitHub project"
Write-Host "   • Set VITE_API_URL to your Render backend URL"
Write-Host "   • Deploy"
Write-Host ""

Write-Host "6. Configure WhatsApp Webhook:"
Write-Host "   • In Meta Business Manager"
Write-Host "   • Set Webhook URL to: https://[your-render-url]/api/whatsapp/webhook"
Write-Host "   • Set Verify Token (from .env WHATSAPP_VERIFY_TOKEN)"
Write-Host ""

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host "Documentation available in:"
Write-Host "  • README.md - Project overview"
Write-Host "  • DEPLOYMENT.md - Detailed deployment steps"
Write-Host "  • WHATSAPP_SETUP.md - WhatsApp integration guide"
Write-Host "  • ARQUITETURA.md - Technical architecture"
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host ""

Write-Success "Setup script completed! Follow the steps above to deploy."
