$ErrorActionPreference = 'Stop'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$installer = Join-Path $scriptDir 'setup_aliases.py'

if (Get-Command py -ErrorAction SilentlyContinue) {
  & py $installer @args
  exit $LASTEXITCODE
}

if (Get-Command python -ErrorAction SilentlyContinue) {
  & python $installer @args
  exit $LASTEXITCODE
}

Write-Error 'Python 3 is required to set up aliases.'
exit 1
