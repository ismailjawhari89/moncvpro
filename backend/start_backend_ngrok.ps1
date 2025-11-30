# ------------------------------
# Script: Start Backend + Ngrok
# ------------------------------

# 1️⃣ Navigate للمجلد ديال Backend
cd "C:\Projects\moncvpro\backend"

# 2️⃣ Set environment variables
$env:DATABASE_URL="postgresql://postgres:PASSWORD@HOST:5432/postgres"
$env:JWT_SECRET="YOUR_JWT_SECRET"
$env:OPENAI_API_KEY=""

# 3️⃣ Start Backend in a separate PowerShell window
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'npm start'

# 4️⃣ Wait 5 seconds to make sure backend is running
Start-Sleep -Seconds 5

# 5️⃣ Navigate لمجلد ngrok
cd "C:\Users\brahi\Downloads\ngrok-v3-stable-windows-amd64"

# 6️⃣ Run Ngrok on port 3001
Start-Process powershell -ArgumentList '-NoExit', '-Command', '.\ngrok.exe http 3001'

Write-Host "✅ Backend running on http://localhost:3001"
Write-Host "✅ Ngrok forwarding will appear in the new window"
Write-Host "Check your public URL and use it in the Frontend!"
