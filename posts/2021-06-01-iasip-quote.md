---
layout: layouts/post.njk
title: Random IASIP quote
excerpt_separator: <!--more-->
---

![logo](/img/iasip_quote.png)
<!--more-->

Show a random quote from It's Always Sunny in Philadelphia in your terminal.
All credit to the person who made _http://sunnyquotes.net_

**Bash**:
Add this to your _~/.bashrc_
```bash
echo $(curl -s http://sunnyquotes.net/q.php?random \
            | jq -r '.sqQuote + " - " + .sqWho + " (" + .sqEp + ")"')
```

**Powershell**:
Add this to your _Microsoft.PowerShell_profile.ps1_
```
function Get-IASIP-Quote() {
    $content = Invoke-WebRequest http://sunnyquotes.net/q.php?random `
    | Select-Object -Expand Content | ConvertFrom-Json 
    $quote = $content.sqQuote
    $ep = $content.sqEp
    $author = $content.sqWho
    Write-Host "$quote - $author ($ep)"  -ForegroundColor yellow
}
Get-IASIP-Quote
```
