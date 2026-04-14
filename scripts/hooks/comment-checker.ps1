# PostToolUse hook: Flags files with excessive comment density (>30%).
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$raw = [Console]::In.ReadToEnd()
if (-not $raw.Trim()) { exit 0 }
try { $data = $raw | ConvertFrom-Json } catch { exit 0 }

$toolName = if ($data.PSObject.Properties['tool_name']) { [string]$data.tool_name } else { '' }
$writingTools = @('editFiles','create_file','replace_string_in_file','multi_replace_string_in_file')
if ($toolName -notin $writingTools) { exit 0 }

$filePath = $env:TOOL_INPUT_FILE_PATH
if (-not $filePath -and $data.PSObject.Properties['tool_input']) {
    $ti = $data.tool_input
    if ($ti.PSObject.Properties['filePath']) { $filePath = $ti.filePath }
}
if (-not $filePath -or -not (Test-Path $filePath -PathType Leaf)) { exit 0 }

$ext = [System.IO.Path]::GetExtension($filePath).TrimStart('.')
$supportedExts = @('js','ts','tsx','jsx','go','java','c','cpp','rs','swift','kt','cs','py','sh','bash','zsh','yml','yaml','toml','rb','html','xml','svg','vue','ps1')
if ($ext -notin $supportedExts) { exit 0 }

$totalLines    = 0
$commentLines  = 0
$inJsdoc       = $false
$inCBlock      = $false
$inPsBlock     = $false
$inHtmlBlock   = $false
$inScriptBlock = $false
$inStyleBlock  = $false

foreach ($line in [System.IO.File]::ReadLines($filePath)) {
    $trimmed = $line.Trim()
    if (-not $trimmed) { continue }
    $totalLines++

    if ($inJsdoc) {
        if ($trimmed.EndsWith('*/')) { $inJsdoc = $false }
        continue
    }
    if ($inCBlock) {
        $commentLines++
        if ($trimmed.EndsWith('*/')) { $inCBlock = $false }
        continue
    }
    if ($inPsBlock) {
        $commentLines++
        if ($trimmed.EndsWith('#>')) { $inPsBlock = $false }
        continue
    }
    if ($inHtmlBlock) {
        $commentLines++
        if ($trimmed.Contains('-->')) { $inHtmlBlock = $false }
        continue
    }

    if ($trimmed.StartsWith('/**')) {
        if (-not $trimmed.EndsWith('*/')) { $inJsdoc = $true }
        continue
    }
    if ($trimmed.StartsWith('/*')) {
        $commentLines++
        if (-not $trimmed.EndsWith('*/')) { $inCBlock = $true }
        continue
    }

    switch -Wildcard ($ext) {
        'rs' {
            if ($trimmed.StartsWith('//')) {
                if ($trimmed -notmatch '^//[/!]' -and $trimmed -notmatch '^//\s*(SAFETY:|FIXME:|TODO:|noinspection\b|NOLINT|nosec|nolint)') {
                    $commentLines++
                }
            }
        }
        { $_ -in @('js','ts','tsx','jsx','go','java','c','cpp','swift','kt','cs') } {
            if ($trimmed.StartsWith('//')) {
                if ($trimmed -notmatch '^//\s*(eslint-disable|@ts-|prettier-ignore|noinspection|NOLINT|nosec|nolint|istanbul)') {
                    $commentLines++
                }
            }
        }
        'py' {
            if ($trimmed.StartsWith('#')) {
                if (-not $trimmed.StartsWith('#!') -and $trimmed -notmatch '^#\s*(type:|noqa|pylint:|fmt:|isort:|pragma:)') {
                    $commentLines++
                }
            }
        }
        { $_ -in @('sh','bash','zsh','yml','yaml','toml','rb') } {
            if ($trimmed.StartsWith('#')) {
                if (-not $trimmed.StartsWith('#!') -and $trimmed -notmatch '^#\s*(shellcheck|rubocop)') {
                    $commentLines++
                }
            }
        }
        { $_ -in @('html','xml','svg','vue') } {
            if ($inScriptBlock) {
                if ($trimmed -match '(?i)</script\s*>') { $inScriptBlock = $false; break }
                if ($trimmed.StartsWith('//') -and $trimmed -notmatch '^//\s*(eslint-disable|@ts-|prettier-ignore|noinspection|NOLINT|nosec|nolint|istanbul)') {
                    $commentLines++
                }
            } elseif ($inStyleBlock) {
                if ($trimmed -match '(?i)</style\s*>') { $inStyleBlock = $false; break }
            } else {
                if ($trimmed -match '(?i)<script[\s>]' -and $trimmed -notmatch '(?i)</script\s*>') { $inScriptBlock = $true }
                elseif ($trimmed -match '(?i)<style[\s>]' -and $trimmed -notmatch '(?i)</style\s*>') { $inStyleBlock = $true }
                if ($trimmed.StartsWith('<!--')) {
                    $commentLines++
                    if (-not $trimmed.Contains('-->')) { $inHtmlBlock = $true }
                }
            }
        }
        'ps1' {
            if ($trimmed.StartsWith('<#')) {
                $commentLines++
                if (-not $trimmed.EndsWith('#>')) { $inPsBlock = $true }
            } elseif ($trimmed.StartsWith('#')) {
                if ($trimmed -notmatch '^#\s*(Requires|region|endregion)') {
                    $commentLines++
                }
            }
        }
    }
}

if ($totalLines -lt 10) { exit 0 }

$ratio = [int]($commentLines * 100 / $totalLines)
if ($ratio -le 30) { exit 0 }

$baseName = [System.IO.Path]::GetFileName($filePath)
[PSCustomObject]@{
    hookSpecificOutput = [PSCustomObject]@{
        hookEventName   = 'PostToolUse'
        additionalContext = "WARNING: $baseName has ${ratio}% comment density (${commentLines}/${totalLines} non-blank lines). Comments exceeding 30% often indicate AI slop -- restating what code obviously does. Remove comments that add no value beyond what the code communicates. JSDoc/docstrings for public APIs and directive comments are already excluded from this count."
    }
} | ConvertTo-Json -Compress -Depth 5
exit 0
