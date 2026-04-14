# PreToolUse hook: Warns when editing a file that hasn't been read in the current session.
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$raw = [Console]::In.ReadToEnd()
if (-not $raw.Trim()) { exit 0 }
try { $data = $raw | ConvertFrom-Json } catch { exit 0 }

$toolName = if ($data.PSObject.Properties['tool_name']) { [string]$data.tool_name } else { '' }
$editTools = @('editFiles','replace_string_in_file','multi_replace_string_in_file')
if ($toolName -notin $editTools) { exit 0 }

$filePath = $env:TOOL_INPUT_FILE_PATH
if (-not $filePath) {
    if ($data.PSObject.Properties['tool_input']) {
        $ti = $data.tool_input
        if ($ti.PSObject.Properties['filePath']) { $filePath = $ti.filePath }
        elseif ($ti.PSObject.Properties['files'] -and $null -ne $ti.files -and @($ti.files).Count -gt 0) { $filePath = @($ti.files)[0] }
    }
}
if (-not $filePath) { exit 0 }

$transcriptPath = if ($data.PSObject.Properties['transcript_path']) { [string]$data.transcript_path } else { '' }
if (-not $transcriptPath -or -not (Test-Path $transcriptPath)) { exit 0 }

$transcriptContent = Get-Content $transcriptPath -Raw -ErrorAction SilentlyContinue
if (-not $transcriptContent) { exit 0 }

$escapedFull = [Regex]::Escape($filePath)
if ($transcriptContent -imatch $escapedFull) { exit 0 }

$baseName    = [System.IO.Path]::GetFileName($filePath)
$escapedBase = [Regex]::Escape($baseName)
if ($transcriptContent -imatch "(?<![a-zA-Z0-9._\-])$escapedBase(?![a-zA-Z0-9._\-])") { exit 0 }

[PSCustomObject]@{
    hookSpecificOutput = [PSCustomObject]@{
        hookEventName   = 'PreToolUse'
        additionalContext = "WARNING: You are editing $baseName but there is no evidence you read it in this session. Read files before editing to understand existing code and avoid blind modifications."
    }
} | ConvertTo-Json -Compress -Depth 5
exit 0
