# ================================
# Простой скрипт для бэкапа базы Directus
# ================================

# Параметры
$backupDir = ".\backups"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFile = "$backupDir\directus_backup_$timestamp.sql"

# Создаём папку для бэкапов, если её нет
if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

Write-Host "Создаю резервную копию базы Directus..." -ForegroundColor Cyan
Write-Host "Файл бэкапа: $backupFile" -ForegroundColor Yellow

# Создаём бэкап из контейнера базы
docker exec -t directus_db pg_dump -U directus -d directus --schema=public | Set-Content $backupFile -Encoding UTF8

# Проверяем результат
if (Test-Path $backupFile) {
    Write-Host "Бэкап успешно создан!" -ForegroundColor Green
} else {
    Write-Host "Ошибка: файл бэкапа не найден!" -ForegroundColor Red
}
