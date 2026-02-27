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
    @{ country = "ko"; type = "click"; prompt = "Korean traditional Gayageum sharp pluck, elegant and crisp" },
    @{ country = "ko"; type = "transition"; prompt = "Deep, grand, loud Korean Buk (drum) strike with a lingering resonant Buk boom, highly resonant and slow trailing off" },
    @{ country = "en"; type = "click"; prompt = "British traditional harpsichord short pluck, bright and crisp" },
    @{ country = "en"; type = "transition"; prompt = "Deep, grand, loud English church organ chord swell, highly resonant, overwhelming and slow trailing off" },
    @{ country = "es"; type = "click"; prompt = "Spanish traditional Flamenco guitar tap, wooden and rhythmic" },
    @{ country = "es"; type = "transition"; prompt = "Deep, grand, loud Spanish Flamenco acoustic strum echo, highly resonant, passionate and slow trailing off" },
    @{ country = "hi"; type = "click"; prompt = "Indian traditional Tabla rim shot tap, sharp and metallic" },
    @{ country = "hi"; type = "transition"; prompt = "Deep, grand, loud Indian Sitar sympathetic string sweep, highly resonant, mystic and slow trailing off" },
    @{ country = "de"; type = "click"; prompt = "German traditional Zither string pluck, clean and bright" },
    @{ country = "de"; type = "transition"; prompt = "Deep, grand, loud German Baroque cello low droning sweep, highly resonant, heavy and slow trailing off" },
    @{ country = "ja"; type = "click"; prompt = "Japanese traditional Koto sharp pluck, elegant and zen" },
    @{ country = "ja"; type = "transition"; prompt = "Deep, grand, loud Japanese Taiko drum heavy strike with lingering resonance, highly resonant and slow trailing off" },
    @{ country = "ar"; type = "click"; prompt = "Arabic traditional Oud single string pluck, warm and clean" },
    @{ country = "ar"; type = "transition"; prompt = "Deep, grand, loud Middle Eastern Darbuka bass hit with Ney flute echo, highly resonant and slow trailing off" },
    @{ country = "pl"; type = "click"; prompt = "Polish traditional Hurdy-Gurdy crank tap, sharp and wooden" },
    @{ country = "pl"; type = "transition"; prompt = "Deep, grand, loud Polish accordion bass drone swell, highly resonant, melancholic and slow trailing off" }
)

$outDir = "public\assets\sounds"
if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Force -Path $outDir | Out-Null
}

$headers = @{
    "Content-Type" = "application/json"
    "xi-api-key"   = $apiKey
}

# Fix for TLS 1.2 which is required by some modern APIs
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

foreach ($item in $sounds) {
    $filename = "$($item.country)-$($item.type).mp3"
    $targetPath = Join-Path $outDir $filename
    
    Write-Host "Generating $filename..." -ForegroundColor Cyan

    $body = @{
        text             = $item.prompt
        duration_seconds = 2.0
        prompt_influence = 0.3
    } | ConvertTo-Json

    try {
        Invoke-RestMethod -Uri "https://api.elevenlabs.io/v1/sound-generation" -Method Post -Headers $headers -Body $body -OutFile $targetPath
        Write-Host "Successfully saved $filename" -ForegroundColor Green
    }
    catch {
        Write-Host "Failed to generate $filename : $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host "All multiverse sounds processed." -ForegroundColor Magenta
