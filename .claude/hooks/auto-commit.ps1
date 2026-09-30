# Auto-commit with .commit_message.txt (PowerShell)
# - Skips the commit and reports to Claude when tools/rule-guard.js finds game-rule changes
# - Leaves world data (db, level.dat) out of the commit while Minecraft Education is running
# - Empties .commit_message.txt after use so a stale message is never reused

[Console]::OutputEncoding = [Text.Encoding]::UTF8

$hookInput = $null
if ([Console]::IsInputRedirected) {
    try { $raw = [Console]::In.ReadToEnd(); if ($raw) { $hookInput = $raw | ConvertFrom-Json } } catch {}
}

$null = & git rev-parse --is-inside-work-tree 2>$null
if ($LASTEXITCODE -ne 0) { exit 0 }

# Keep the developer page (devpage.html, git-ignored) up to date every turn
$genPage = Join-Path (& git rev-parse --show-toplevel).Trim() 'tools/gen-devpage.js'
if ((Test-Path -LiteralPath $genPage) -and (Get-Command node -ErrorAction SilentlyContinue)) {
    $null = & node $genPage 2>&1
}

$changes = & git status --porcelain
if ([string]::IsNullOrWhiteSpace($changes)) { exit 0 }

$top = (& git rev-parse --show-toplevel).Trim()
$msgFile = Join-Path $top '.commit_message.txt'
if (!(Test-Path -LiteralPath $msgFile) -or (Get-Item -LiteralPath $msgFile).Length -eq 0) { exit 0 }
if ([string]::IsNullOrWhiteSpace((Get-Content -LiteralPath $msgFile -Raw))) { exit 0 }

$guard = Join-Path $top 'tools/rule-guard.js'
if ((Test-Path -LiteralPath $guard) -and (Get-Command node -ErrorAction SilentlyContinue)) {
    $report = & node $guard 2>&1 | Out-String
    if ($LASTEXITCODE -eq 1) {
        # Already blocked once this turn: stop quietly instead of looping
        if ($hookInput -and $hookInput.stop_hook_active) { exit 0 }
        [Console]::Error.WriteLine("Auto-commit skipped: rule guard found game-rule changes.`n$report")
        exit 2
    }
}

$eduRunning = Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.Path -like '*MinecraftEducationEdition*' }
if ($eduRunning) {
    & git -C $top add -A -- . ':(exclude)db' ':(exclude)level.dat' ':(exclude)level.dat_old'
} else {
    & git -C $top add -A
}

& git -C $top diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
    & git -C $top commit -F $msgFile --quiet
    if ($LASTEXITCODE -ne 0) { exit 0 }
}
[IO.File]::WriteAllText($msgFile, '')
