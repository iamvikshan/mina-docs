# SubagentStart hook: Injects Core Philosophy and role-specific rules into every subagent session.
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$raw = [Console]::In.ReadToEnd()
if (-not $raw.Trim()) { exit 0 }
try { $data = $raw | ConvertFrom-Json } catch { exit 0 }

$agentType = if ($data.PSObject.Properties['agent_type']) { [string]$data.agent_type } else { '' }

$context = @"
Core Philosophy for this session:
- Zero-trust: verify your own work, do not trust assumptions
- Indistinguishable Code: output must match senior engineer conventions exactly
- No emojis: ASCII symbols only (* -> [x] [ ] ---)
- Human intervention = failure: resolve ambiguity, don't ask
"@

if ($agentType -match 'ekko|aurora|forge') {
    $context += @"

Worker rules:
- Read files before editing (Write-Guard)
- Comments must add value (Comment Discipline, <30% density)
- No scope creep: do exactly what was asked
"@
}

if ($agentType -match 'forge') {
    $context += "`n- Security-first: no plaintext secrets, pin versions, scan images`n- Expect sentry review on all output"
}

if ($agentType -match 'sentry') {
    $context += "`n`nReview rules: Zero findings = look harder. Verify claims against code."
}

[PSCustomObject]@{
    hookSpecificOutput = [PSCustomObject]@{
        hookEventName   = 'SubagentStart'
        additionalContext = $context
    }
} | ConvertTo-Json -Compress -Depth 5
exit 0
