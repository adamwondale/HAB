param(
  [Parameter(Mandatory = $true)][string]$SourcePath,
  [Parameter(Mandatory = $true)][string]$OutputDir
)

$ErrorActionPreference = 'Stop'
New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null

$powerPoint = New-Object -ComObject PowerPoint.Application
$powerPoint.Visible = -1
$presentation = $powerPoint.Presentations.Open($SourcePath, $true, $true, $false)

try {
  $slides = foreach ($slide in $presentation.Slides) {
    $shapes = foreach ($shape in $slide.Shapes) {
      $text = ''
      $fontName = ''
      $fontSize = 0
      if ($shape.HasTextFrame -and $shape.TextFrame.HasText) {
        $text = $shape.TextFrame.TextRange.Text
        $fontName = $shape.TextFrame.TextRange.Font.Name
        $fontSize = $shape.TextFrame.TextRange.Font.Size
      }

      [pscustomobject]@{
        Id = $shape.Id
        Name = $shape.Name
        Type = $shape.Type
        Left = [math]::Round($shape.Left, 2)
        Top = [math]::Round($shape.Top, 2)
        Width = [math]::Round($shape.Width, 2)
        Height = [math]::Round($shape.Height, 2)
        Text = $text
        FontName = $fontName
        FontSize = $fontSize
      }
    }

    [pscustomobject]@{
      SlideNumber = $slide.SlideNumber
      Name = $slide.Name
      LayoutName = $slide.CustomLayout.Name
      Shapes = $shapes
    }
  }

  [pscustomobject]@{
    Width = $presentation.PageSetup.SlideWidth
    Height = $presentation.PageSetup.SlideHeight
    SlideCount = $presentation.Slides.Count
    Slides = $slides
  } | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $OutputDir 'deck-inspection.json') -Encoding UTF8

  $presentation.SaveAs((Join-Path $OutputDir 'render'), 18)
}
finally {
  $presentation.Close()
  $powerPoint.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($presentation) | Out-Null
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($powerPoint) | Out-Null
  [gc]::Collect()
  [gc]::WaitForPendingFinalizers()
}
