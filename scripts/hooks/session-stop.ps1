# Stop hook: Checks for uncommitted changes and temp artifacts before session ends.
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$raw = [Console]::In.ReadToEnd()
if (-not $raw.Trim()) { exit 0 }
try { $data = $raw | ConvertFrom-Json } catch { exit 0 }

$stopHookActive = if ($data.PSObject.Properties['stop_hook_active']) { [string]$data.stop_hook_active } else { 'false' }
if ($stopHookActive -eq 'true') { exit 0 }

$cwd = if ($data.PSObject.Properties['cwd']) { [string]$data.cwd } else { '' }
if (-not $cwd) { exit 0 }

$warnings = [System.Collections.Generic.List[string]]::new()

if (Get-Command git -ErrorAction SilentlyContinue) {
    if (Test-Path (Join-Path $cwd '.git') -PathType Container) {
        $dirty = git -C $cwd status --porcelain 2>$null
        if ($dirty) {
            $changeCount = ($dirty -split "`n" | Where-Object { $_ }).Count
            $warnings.Add("Uncommitted changes detected ($changeCount files). Consider committing or stashing before ending session.")
        }
    }
}

$tempFilter = Get-ChildItem -Path $cwd -Recurse -Depth 3 -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match '\.tmp$|\.bak$|^debug-' -and $_.FullName -notmatch 'node_modules|\.git' }
$totalCount = ($tempFilter | Measure-Object).Count

if ($totalCount -gt 0) {
    $warnings.Add("Found $totalCount temp/debug artifact(s) in workspace. Clean up: *.tmp, *.bak, debug-* files.")
}

if ($warnings.Count -eq 0) { exit 0 }

$compiled = ($warnings | ForEach-Object { "- $_" }) -join "`n"
[PSCustomObject]@{ systemMessage = $compiled } | ConvertTo-Json -Compress -Depth 3
exit 0
