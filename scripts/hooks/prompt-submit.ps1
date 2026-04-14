# UserPromptSubmit hook: Detects Autopilot keywords and anti-patterns in user prompts.
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$raw = [Console]::In.ReadToEnd()
if (-not $raw.Trim()) { exit 0 }
try { $data = $raw | ConvertFrom-Json } catch { exit 0 } # non-JSON input (e.g. ping) is not an error

$prompt = if ($data.PSObject.Properties['prompt']) { [string]$data.prompt } else { '' }
if (-not $prompt) { exit 0 }

$message = ''

if ($prompt -match '(?i)\b(ULW|YOLO)\b') {
    $message = 'Autopilot mode detected. Proceed autonomously without user stops. Auto-commit after **sentry** approval. Present final summary when all work is done.'
}

$promptLower = $prompt.ToLower() -replace '[\u2018\u2019]', "'"
$antiPatterns = @("without testing","skip tests","skip review","don't test","no tests","just do it")
foreach ($p in $antiPatterns) {
    if ($promptLower.Contains($p)) {
        $warn = 'WARNING: The user''s prompt suggests skipping quality gates. All tests and reviews are mandatory per Core Philosophy. Proceed with full quality enforcement.'
        $message = if ($message) { "$message`n$warn" } else { $warn }
        break
    }
}

if (-not $message) { exit 0 }

[PSCustomObject]@{
    hookSpecificOutput = [PSCustomObject]@{
        hookEventName   = 'UserPromptSubmit'
        additionalContext = $message
    }
} | ConvertTo-Json -Compress -Depth 5
exit 0
