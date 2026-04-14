param([Parameter(Mandatory)][string]$Hook)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

if ($Hook -notmatch '^[a-zA-Z0-9_-]+$') {
    [Console]::Error.WriteLine("atlas: invalid hook name '$Hook'")
    exit 1
}

$script = Join-Path (Split-Path -Parent $PSCommandPath) "$Hook.ps1"
if (-not (Test-Path $script)) {
    [Console]::Error.WriteLine("atlas: $Hook hook not found")
    exit 1
}

$executor = if (Get-Command pwsh -ErrorAction SilentlyContinue) {
    'pwsh'
} elseif (Get-Command powershell -ErrorAction SilentlyContinue) {
    'powershell'
} else {
    if ($env:OS -eq 'Windows_NT') { 'pwsh.exe' } else { 'pwsh' }
}
& $executor -NonInteractive -NoProfile -File $script @args
$ec = if ($null -ne $LASTEXITCODE) { $LASTEXITCODE } else { 1 }
exit $ec
