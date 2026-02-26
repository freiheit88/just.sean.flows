$envPath = "..\.env.local"
if (!(Test-Path $envPath)) {
    $envPath = ".env.local"
}

$apiKey = ""
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath
    foreach ($line in $envContent) {
        if ($line -match "^ELEVENLABS_API_KEY=(.*)") {
            $apiKey = $matches[1].Trim()
        }
    }
}

if ([string]::IsNullOrEmpty($apiKey)) {
    Write-Host "Error: ELEVENLABS_API_KEY NOT found in .env.local" -ForegroundColor Red
    exit 1
}

$sounds = @(
    @{ country = "ko"; type = "click"; prompt = "Traditional Korean Gayageum pluck, elegant and sharp" },
    @{ country = "ko"; type = "transition"; prompt = "Korean traditional fan opening, wind-like whoosh" },
    @{ country = "en"; type = "click"; prompt = "Modern cinematic digital click, clean and sleek" },
    @{ country = "en"; type = "transition"; prompt = "Deep cinematic bass swell, sci-fi portal opening" },
    @{ country = "es"; type = "click"; prompt = "Spanish Flamenco guitar tap, rhythmic and warm" },
    @{ country = "es"; type = "transition"; prompt = "Fast Flamenco strum, energetic and vibrant" },
    @{ country = "hi"; type = "click"; prompt = "Indian Tabla high resonant tap, crisp and energetic" },
    @{ country = "hi"; type = "transition"; prompt = "Indian Sitar sweep and grand cinematic resonance" },
    @{ country = "de"; type = "click"; prompt = "Dark gothic iron door lock, heavy and metallic" },
    @{ country = "de"; type = "transition"; prompt = "Gothic dark choir echo, haunting and majestic" },
    @{ country = "ja"; type = "click"; prompt = "Japanese Zen stone click, organic and peaceful" },
    @{ country = "ja"; type = "transition"; prompt = "Japanese Shamisen string pull, sharp and traditional" },
    @{ country = "ar"; type = "click"; prompt = "Arabic Oud string pluck, deep and resonant" },
    @{ country = "ar"; type = "transition"; prompt = "Middle Eastern Darbuka drum roll with mystic wind" },
    @{ country = "pl"; type = "click"; prompt = "Crisp amber glass clink, bright and sharp" },
    @{ country = "pl"; type = "transition"; prompt = "Majestic European classical string crescendo, sweeping" }
)

$outDir = "public\assets\sounds"
if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Force -Path $outDir | Out-Null
}

$headers = @{
    "Content-Type" = "application/json"
    "xi-api-key" = $apiKey
}

# Fix for TLS 1.2 which is required by some modern APIs
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

foreach ($item in $sounds) {
    $filename = "$($item.country)-$($item.type).mp3"
    $targetPath = Join-Path $outDir $filename
    
    Write-Host "Generating $filename..." -ForegroundColor Cyan

    $body = @{
        text = $item.prompt
        duration_seconds = 2.0
        prompt_influence = 0.3
    } | ConvertTo-Json

    try {
        Invoke-RestMethod -Uri "https://api.elevenlabs.io/v1/sound-generation" -Method Post -Headers $headers -Body $body -OutFile $targetPath
        Write-Host "Successfully saved $filename" -ForegroundColor Green
    } catch {
        Write-Host "Failed to generate $filename : $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host "All multiverse sounds processed." -ForegroundColor Magenta
