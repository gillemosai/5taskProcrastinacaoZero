Add-Type -AssemblyName System.Drawing
$srcPath = "C:\Users\gillemosai\.gemini\antigravity\brain\7e0b7940-4ed3-4b13-a461-acbc831ca91d\5task_feature_graphic_1774524584859.png"
$destPath = "C:\Users\gillemosai\.gemini\antigravity\brain\7e0b7940-4ed3-4b13-a461-acbc831ca91d\5task_feature_graphic_1024x500.png"

$srcImg = [System.Drawing.Image]::FromFile($srcPath)
$targetW = 1024
$targetH = 500

$destImg = New-Object System.Drawing.Bitmap($targetW, $targetH)
$graphics = [System.Drawing.Graphics]::FromImage($destImg)

$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

$cropW = 640
$cropH = [math]::Round(640 * (500.0 / 1024.0))
$cropX = 0
$cropY = [math]::Round((640 - $cropH) / 2)

$srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
$destRect = New-Object System.Drawing.Rectangle(0, 0, $targetW, $targetH)

$graphics.DrawImage($srcImg, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

$destImg.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

$graphics.Dispose()
$srcImg.Dispose()
$destImg.Dispose()

Write-Output "Image cropped and resized to 1024x500 at $destPath"
