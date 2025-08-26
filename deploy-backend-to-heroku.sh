#!/bin/bash

# Script สำหรับ Deploy Backend ไปยัง Heroku
# ใช้: ./deploy-backend-to-heroku.sh

set -e  # หยุดการทำงานถ้าเกิด error

echo "🚀 เริ่มการ Deploy Backend ไปยัง Heroku..."

# ตรวจสอบ Heroku CLI
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI ไม่ได้ติดตั้ง กรุณาติดตั้งก่อน"
    echo "macOS: brew tap heroku/brew && brew install heroku"
    exit 1
fi

# ตรวจสอบว่า login แล้วหรือยัง
if ! heroku auth:whoami &> /dev/null; then
    echo "🔐 กรุณา login เข้า Heroku ก่อน"
    heroku login
fi

# ข้อมูล Database ที่มีอยู่แล้ว
DB_HOST="145.223.21.117"
DB_USER="debian-sys-maint"
DB_PASSWORD="Str0ngP@ssw0rd!"
DB_NAME="kuntarn"
DB_PORT="3306"

echo "📋 ข้อมูล Database ที่จะใช้:"
echo "  DB_HOST: $DB_HOST"
echo "  DB_USER: $DB_USER"
echo "  DB_NAME: $DB_NAME"
echo "  DB_PORT: $DB_PORT"
echo ""

# รับ input จาก user
read -p "📝 ใส่ชื่อ Heroku App ใหม่: " APP_NAME
read -p "🌐 ใส่ Frontend Domain (เช่น https://example.com): " FRONTEND_DOMAIN
read -p "🔑 ใส่ JWT Secret ใหม่: " JWT_SECRET

echo "📋 ข้อมูลที่ใส่:"
echo "  App Name: $APP_NAME"
echo "  Frontend Domain: $FRONTEND_DOMAIN"
echo "  JWT Secret: $JWT_SECRET"
echo ""

read -p "✅ ข้อมูลถูกต้องหรือไม่? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ]; then
    echo "❌ ยกเลิกการ deploy"
    exit 1
fi

echo "🔄 สร้าง Heroku App ใหม่..."
heroku create $APP_NAME

echo "🔧 ตั้งค่า Environment Variables..."
heroku config:set NODE_ENV=production --app $APP_NAME
heroku config:set JWT_SECRET="$JWT_SECRET" --app $APP_NAME
heroku config:set CORS_ORIGIN="$FRONTEND_DOMAIN" --app $APP_NAME

# ตั้งค่า Database
heroku config:set DB_HOST="$DB_HOST" --app $APP_NAME
heroku config:set DB_USER="$DB_USER" --app $APP_NAME
heroku config:set DB_PASSWORD="$DB_PASSWORD" --app $APP_NAME
heroku config:set DB_NAME="$DB_NAME" --app $APP_NAME
heroku config:set DB_PORT="$DB_PORT" --app $APP_NAME

echo "📝 เพิ่ม Heroku Remote..."
heroku git:remote -a $APP_NAME

echo "🚀 Deploy Backend Code..."
# ไปที่โฟลเดอร์ backendkuntarn
cd "/Volumes/Back up data Devjuu/backendkuntarn"

# ตรวจสอบว่า remote ถูกต้อง
echo "🔍 ตรวจสอบ Heroku remote..."
git remote -v

# Commit changes (ถ้ามี)
git add .
git commit -m "Deploy backend to Heroku: $APP_NAME" || true

# Push to Heroku (ใช้ชื่อ app ที่ถูกต้อง)
echo "📤 Push to Heroku app: $APP_NAME"
git push heroku main || git push heroku master

echo "⏳ รอการ Deploy เสร็จ..."
sleep 15

echo "🔍 ตรวจสอบ Deployment..."
if curl -s "https://$APP_NAME.herokuapp.com/api/health" | grep -q "OK"; then
    echo "✅ Deployment สำเร็จ!"
    echo "🌐 App URL: https://$APP_NAME.herokuapp.com"
    echo "📊 Health Check: https://$APP_NAME.herokuapp.com/api/health"
else
    echo "❌ Deployment ไม่สำเร็จ ตรวจสอบ logs:"
    heroku logs --tail --app $APP_NAME
    exit 1
fi

echo ""
echo "📋 ขั้นตอนต่อไป:"
echo "1. รัน Database Setup: heroku run npm run setup-db --app $APP_NAME"
echo "2. รัน Admin Users Setup: heroku run npm run setup-admin-users --app $APP_NAME"
echo "3. ทดสอบ API: curl https://$APP_NAME.herokuapp.com/api/health"
echo "4. ดู Logs: heroku logs --tail --app $APP_NAME"
echo "5. เปิด App: heroku open --app $APP_NAME"

echo ""
echo "🎉 การ Deploy เสร็จสิ้น!"
echo ""
echo "⚠️  หมายเหตุ: ใช้ Database ที่มีอยู่แล้วที่ $DB_HOST"
echo "   ตรวจสอบว่า Database สามารถเข้าถึงได้จาก Heroku"

# กลับไปที่โฟลเดอร์หลัก
cd "/Volumes/Back up data Devjuu/projectkuntarn"
