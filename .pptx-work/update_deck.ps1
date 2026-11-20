param(
  [Parameter(Mandatory = $true)][string]$SourcePath,
  [Parameter(Mandatory = $true)][string]$DraftPath
)

$ErrorActionPreference = 'Stop'

function Get-Rgb([int]$r, [int]$g, [int]$b) {
  return $r + (256 * $g) + (65536 * $b)
}

function Get-ShapeById($slide, [int]$id) {
  foreach ($shape in $slide.Shapes) {
    if ($shape.Id -eq $id) { return $shape }
  }
  throw "Shape $id was not found on slide $($slide.SlideNumber)."
}

function Set-ShapeText($slide, [int]$id, [string]$text, [single]$fontSize = 0, [int]$bold = -2) {
  $shape = Get-ShapeById $slide $id
  $shape.TextFrame.TextRange.Text = $text
  $shape.TextFrame.WordWrap = -1
  if ($fontSize -gt 0) { $shape.TextFrame.TextRange.Font.Size = $fontSize }
  if ($bold -ne -2) { $shape.TextFrame.TextRange.Font.Bold = $bold }
  return $shape
}

function Add-TextBox($slide, [string]$text, [single]$left, [single]$top, [single]$width, [single]$height, [single]$fontSize, [bool]$bold, [int]$color, [int]$align = 1) {
  $shape = $slide.Shapes.AddTextbox(1, $left, $top, $width, $height)
  $shape.TextFrame.TextRange.Text = $text
  $shape.TextFrame.WordWrap = -1
  $shape.TextFrame.AutoSize = 0
  $shape.TextFrame.MarginLeft = 0
  $shape.TextFrame.MarginRight = 0
  $shape.TextFrame.MarginTop = 0
  $shape.TextFrame.MarginBottom = 0
  $shape.TextFrame.TextRange.Font.Name = 'Arial'
  $shape.TextFrame.TextRange.Font.Size = $fontSize
  $shape.TextFrame.TextRange.Font.Bold = if ($bold) { -1 } else { 0 }
  $shape.TextFrame.TextRange.Font.Color.RGB = $color
  $shape.TextFrame.TextRange.ParagraphFormat.Alignment = $align
  return $shape
}

function Add-RoundRect($slide, [single]$left, [single]$top, [single]$width, [single]$height, [int]$fillColor, [int]$lineColor) {
  $shape = $slide.Shapes.AddShape(5, $left, $top, $width, $height)
  $shape.Fill.ForeColor.RGB = $fillColor
  $shape.Line.ForeColor.RGB = $lineColor
  $shape.Line.Weight = 1.2
  return $shape
}

$dark = Get-Rgb 61 53 47
$darkCard = Get-Rgb 43 36 31
$gold = Get-Rgb 232 169 45
$light = Get-Rgb 247 237 221
$lightCard = Get-Rgb 239 224 202
$muted = Get-Rgb 117 106 96
$white = Get-Rgb 255 247 233
$softLine = Get-Rgb 216 190 151

New-Item -ItemType Directory -Path (Split-Path -Parent $DraftPath) -Force | Out-Null
Copy-Item -LiteralPath $SourcePath -Destination $DraftPath -Force

$powerPoint = New-Object -ComObject PowerPoint.Application
$powerPoint.Visible = -1
$presentation = $powerPoint.Presentations.Open($DraftPath, $false, $false, $false)

try {
  $slide4 = $presentation.Slides.Item(4)
  Set-ShapeText $slide4 2 'The Problem at HAB' 32 -1 | Out-Null
  Set-ShapeText $slide4 4 'HR, Finance, and Store Management keep employee, payroll, and asset records in separate paper files and spreadsheets. Staff must compare records by hand before they can trust a report. This slows decisions and creates inconsistent data.' 20 -1 | Out-Null

  $slide5 = $presentation.Slides.Item(5)
  Set-ShapeText $slide5 2 'Three Departments, Separate Records' 30 -1 | Out-Null
  Set-ShapeText $slide5 6 'Employee records and status' 14 0 | Out-Null
  Set-ShapeText $slide5 7 'Which employees are active and where are they assigned?' 13 -1 | Out-Null
  Set-ShapeText $slide5 10 'Payroll and deductions' 14 0 | Out-Null
  Set-ShapeText $slide5 11 'Which records are complete and ready for payment?' 13 -1 | Out-Null
  Set-ShapeText $slide5 13 'Store Management' 22 -1 | Out-Null
  Set-ShapeText $slide5 14 'Issued and returned assets' 14 0 | Out-Null
  Set-ShapeText $slide5 15 'Which employees still hold company property?' 13 -1 | Out-Null
  Set-ShapeText $slide5 17 'Each department answers part of the same question, but the records are not connected.' 14 -1 | Out-Null

  $slide6 = $presentation.Slides.Item(6)
  while ($slide6.Shapes.Count -gt 0) { $slide6.Shapes.Item(1).Delete() }
  $background = $slide6.Shapes.AddShape(1, 0, 0, 960, 540)
  $background.Fill.ForeColor.RGB = $light
  $background.Line.Visible = 0
  $background.ZOrder(1)

  Add-TextBox $slide6 'Human-Centered Design Process' 57.6 42 790 48 32 $true $dark | Out-Null
  $accent = $slide6.Shapes.AddShape(1, 57.6, 102, 72, 7)
  $accent.Fill.ForeColor.RGB = $gold
  $accent.Line.Visible = 0
  Add-TextBox $slide6 'We spoke with HAB leaders and reviewed the prototype with the technical team before refining the workflows.' 57.6 122 820 42 16 $false $muted | Out-Null

  Add-RoundRect $slide6 57.6 190 400 105 $lightCard $softLine | Out-Null
  Add-TextBox $slide6 'CEO' 78 207 90 24 16 $true $dark | Out-Null
  Add-TextBox $slide6 'Manual records make it difficult to make timely financial decisions.' 78 239 350 44 17 $false $dark | Out-Null

  Add-RoundRect $slide6 57.6 313 400 112 $lightCard $softLine | Out-Null
  Add-TextBox $slide6 'Technical Manager' 78 330 180 24 16 $true $dark | Out-Null
  Add-TextBox $slide6 'Departments cannot coordinate when employee records are not connected.' 78 362 350 48 17 $false $dark | Out-Null

  Add-TextBox $slide6 'What we learned' 510 190 320 28 20 $true $dark | Out-Null
  Add-TextBox $slide6 '1' 510 235 32 28 18 $true $gold 2 | Out-Null
  Add-TextBox $slide6 'Interviews' 555 232 220 25 16 $true $dark | Out-Null
  Add-TextBox $slide6 'The CEO, Technical Manager, and department heads described the current work.' 555 258 330 46 14 $false $muted | Out-Null

  Add-TextBox $slide6 '2' 510 318 32 28 18 $true $gold 2 | Out-Null
  Add-TextBox $slide6 'Main finding' 555 315 220 25 16 $true $dark | Out-Null
  Add-TextBox $slide6 'Teams need one shared source for employee, payroll, and asset data.' 555 341 330 42 14 $false $muted | Out-Null

  Add-TextBox $slide6 '3' 510 397 32 28 18 $true $gold 2 | Out-Null
  Add-TextBox $slide6 'Prototype review' 555 394 220 25 16 $true $dark | Out-Null
  Add-TextBox $slide6 'The technical supervisor reviewed the prototype and helped refine the workflows.' 555 420 330 42 14 $false $muted | Out-Null

  Add-TextBox $slide6 'UNISON ERP  /  HAB BUSINESS PLC' 50.4 496.8 432 21.6 10 $false $muted | Out-Null
  Add-TextBox $slide6 '06' 849.6 496.8 57.6 21.6 10 $false $muted 3 | Out-Null

  $slide7 = $presentation.Slides.Item(7)
  Set-ShapeText $slide7 3 'UNISON ERP: Product Capabilities' 32 -1 | Out-Null
  Set-ShapeText $slide7 4 'A bilingual system for daily HR, payroll, scheduling, and asset work' 16 -1 | Out-Null
  Set-ShapeText $slide7 5 "UNISON ERP connects employee records with shifts, payroll, and company property. The current prototype shows how departments can work from the same record.`r`rWhat the prototype does today`r`rBilingual views for field teams`rDuty and shift scheduling`rStore asset tracking" 15 0 | Out-Null
  Set-ShapeText $slide7 7 'EN / AM' 18 -1 | Out-Null
  Set-ShapeText $slide7 8 'Bilingual Field Interface' 15 -1 | Out-Null
  Set-ShapeText $slide7 9 'English and Amharic views support supervisors with different levels of technical experience.' 11 0 | Out-Null
  Set-ShapeText $slide7 11 'SHIFT' 18 -1 | Out-Null
  Set-ShapeText $slide7 12 'Duty and Shift Scheduling' 15 -1 | Out-Null
  Set-ShapeText $slide7 13 'Plans guard duty, rest periods, cleaning shifts, and site assignments.' 11 0 | Out-Null
  Set-ShapeText $slide7 15 'ASSET' 18 -1 | Out-Null
  Set-ShapeText $slide7 16 'Store Asset Tracking' 15 -1 | Out-Null
  Set-ShapeText $slide7 17 'Records items issued and returned during onboarding and employee exit.' 11 0 | Out-Null

  $slide9 = $presentation.Slides.Item(9)
  Set-ShapeText $slide9 2 'How Departments Share Information' 32 -1 | Out-Null
  Set-ShapeText $slide9 6 'Creates and updates the employee record, site assignment, and attendance.' 13 0 | Out-Null
  Set-ShapeText $slide9 9 'Uses approved employee and attendance data, then records payment status.' 13 0 | Out-Null
  Set-ShapeText $slide9 12 'Records assets issued and returned, then shares the clearance status.' 13 0 | Out-Null

  $slide11 = $presentation.Slides.Item(11)
  Set-ShapeText $slide11 3 'HAB Commitments for a 12-Week Pilot' 30 -1 | Out-Null
  Set-ShapeText $slide11 4 'The pilot will measure data quality, report preparation time, task completion, and user feedback.' 15 0 | Out-Null
  Set-ShapeText $slide11 6 'EXECUTIVE SUPPORT' 11 -1 | Out-Null
  Set-ShapeText $slide11 7 '1. Sponsor and Team' 16 -1 | Out-Null
  Set-ShapeText $slide11 8 "Appoint an executive sponsor.`r`rConfirm representatives from HR, Finance, and Store Management." 13 0 | Out-Null
  Set-ShapeText $slide11 10 'DATA AND SITES' 11 -1 | Out-Null
  Set-ShapeText $slide11 11 '2. Data and Pilot Sites' 16 -1 | Out-Null
  Set-ShapeText $slide11 12 "Provide access to agreed employee, payroll, and asset records.`r`rSelect three pilot sites." 13 0 | Out-Null
  Set-ShapeText $slide11 14 'USER PARTICIPATION' 11 -1 | Out-Null
  Set-ShapeText $slide11 15 '3. Participation and Review' 16 -1 | Out-Null
  Set-ShapeText $slide11 16 "Join training and use the prototype during the pilot.`r`rTake part in feedback sessions and review the results." 13 0 | Out-Null

  $presentation.Save()
}
finally {
  $presentation.Close()
  $powerPoint.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($presentation) | Out-Null
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($powerPoint) | Out-Null
  [gc]::Collect()
  [gc]::WaitForPendingFinalizers()
}
