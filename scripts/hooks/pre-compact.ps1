# PreCompact hook: Captures session state before context compaction.
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$raw = [Console]::In.ReadToEnd()
if (-not $raw.Trim()) { exit 0 }
try { $data = $raw | ConvertFrom-Json } catch { exit 0 }

$transcriptPath = if ($data.PSObject.Properties['transcript_path']) { [string]$data.transcript_path } else { '' }

$fallbackMessage = 'Context compaction imminent. Save important session state to /memories/session/ now.'
$snapshot = ''
if ($transcriptPath -and (Test-Path $transcriptPath)) {
    try {
        $transcript = Get-Content $transcriptPath -Raw
        $msgs = $transcript | ConvertFrom-Json -ErrorAction SilentlyContinue
        $msgCount = if ($msgs) { $msgs.Count } else { 'unknown' }

        $filePaths = [System.Text.RegularExpressions.Regex]::Matches($transcript, '(?:/|[A-Za-z]:[/\\])[a-zA-Z0-9_./\\-]+\.[a-zA-Z0-9]+') |
            ForEach-Object { $_.Value } |
            Where-Object { $_ -notmatch '//|http|https|www' } |
            Sort-Object -Unique |
            Select-Object -First 20

        $snapshot = "Context compaction imminent. Session state snapshot:`n- Messages in transcript: $msgCount"
        if ($filePaths) {
            $snapshot += "`n- Key files referenced in this session:"
            foreach ($fp in $filePaths) { $snapshot += "`n  $fp" }
        }
        $snapshot += "`nSave any critical state to /memories/session/ before it is lost."
    } catch {
        $snapshot = $fallbackMessage
    }
} else {
    $snapshot = $fallbackMessage
}

[PSCustomObject]@{ systemMessage = $snapshot } | ConvertTo-Json -Compress -Depth 3
exit 0
