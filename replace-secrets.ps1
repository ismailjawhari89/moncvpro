# Script to replace API keys in file
$content = Get-Content "backend/start_backend_ngrok.ps1" -Raw
$content = $content -replace '\$env:OPENAI_API_KEY="sk-[^"]*"', '$env:OPENAI_API_KEY=""'
Set-Content "backend/start_backend_ngrok.ps1" -Value $content -NoNewline
