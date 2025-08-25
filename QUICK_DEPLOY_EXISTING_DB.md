# คู่มือการ Deploy แบบรวดเร็ว - ใช้ Database ที่มีอยู่แล้ว

## ข้อมูล Database ที่มีอยู่
```
DB_HOST=145.223.21.117
DB_USER=debian-sys-maint
DB_PASSWORD=Str0ngP@ssw0rd!
DB_NAME=kuntarn
PORT=1997
```

## วิธีที่ 1: ใช้ Script อัตโนมัติ (แนะนำ)

```bash
# 1. ทำให้ script รันได้
chmod +x deploy-with-existing-db.sh

# 2. รัน script
./deploy-with-existing-db.sh

# 3. ใส่ข้อมูลตามที่ script ถาม
```

## วิธีที่ 2: Deploy แบบ Manual

### ขั้นตอนที่ 1: เตรียม Heroku
```bash
# Login เข้า Heroku
heroku login

# สร้าง app ใหม่
heroku create your-app-name
```

### ขั้นตอนที่ 2: ตั้งค่า Environment Variables
```bash
# ตั้งค่า Environment
heroku config:set NODE_ENV=production --app your-app-name

# ตั้งค่า Database
heroku config:set DB_HOST=145.223.21.117 --app your-app-name
heroku config:set DB_USER=debian-sys-maint --app your-app-name
heroku config:set DB_PASSWORD=Str0ngP@ssw0rd! --app your-app-name
heroku config:set DB_NAME=kuntarn --app your-app-name
heroku config:set DB_PORT=3306 --app your-app-name

# ตั้งค่า JWT Secret (ต้องเปลี่ยนใหม่)
heroku config:set JWT_SECRET=your_new_jwt_secret_key --app your-app-name

# ตั้งค่า CORS
heroku config:set CORS_ORIGIN=https://your-frontend-domain.com --app your-app-name
```

### ขั้นตอนที่ 3: Deploy Code
```bash
# เพิ่ม Heroku remote
heroku git:remote -a your-app-name

# Deploy
git push heroku main
```

### ขั้นตอนที่ 4: ตั้งค่า Database
```bash
# รัน setup scripts
heroku run npm run setup-db --app your-app-name
heroku run npm run setup-admin-users --app your-app-name
```

## วิธีที่ 3: คำสั่งเดียว (Copy & Paste)

```bash
# สร้าง app และตั้งค่าทั้งหมดในครั้งเดียว
heroku create your-app-name && \
heroku config:set NODE_ENV=production --app your-app-name && \
heroku config:set DB_HOST=145.223.21.117 --app your-app-name && \
heroku config:set DB_USER=debian-sys-maint --app your-app-name && \
heroku config:set DB_PASSWORD=Str0ngP@ssw0rd! --app your-app-name && \
heroku config:set DB_NAME=kuntarn --app your-app-name && \
heroku config:set DB_PORT=3306 --app your-app-name && \
heroku config:set JWT_SECRET=your_new_jwt_secret_key --app your-app-name && \
heroku config:set CORS_ORIGIN=https://your-frontend-domain.com --app your-app-name && \
heroku git:remote -a your-app-name && \
git push heroku main
```

## การตรวจสอบ Deployment

### 1. ดู Environment Variables
```bash
heroku config --app your-app-name
```

### 2. ทดสอบ Health Check
```bash
curl https://your-app-name.herokuapp.com/api/health
```

### 3. ดู Logs
```bash
heroku logs --tail --app your-app-name
```

### 4. เปิด App
```bash
heroku open --app your-app-name
```

## ข้อควรระวัง

### 1. Database Access
- ตรวจสอบว่า database ที่ `145.223.21.117` สามารถเข้าถึงได้จาก Heroku
- อาจต้องตั้งค่า firewall หรือ security groups
- ตรวจสอบว่า MySQL bind address อนุญาต external connections

### 2. Security
- เปลี่ยน JWT Secret ทุกครั้ง
- ใช้ HTTPS เท่านั้น
- ตรวจสอบ CORS settings

### 3. Performance
- Database อยู่ที่ external server อาจมี latency
- ตรวจสอบ connection pooling
- Monitor database performance

## การแก้ไขปัญหา

### Database Connection Error
```bash
# ทดสอบ connection
heroku run node -e "
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: '145.223.21.117',
  user: 'debian-sys-maint',
  password: 'Str0ngP@ssw0rd!',
  database: 'kuntarn'
});
connection.connect((err) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Connected to database!');
  }
  connection.end();
});
" --app your-app-name
```

### CORS Error
```bash
# ตั้งค่า CORS ใหม่
heroku config:set CORS_ORIGIN=* --app your-app-name
```

### Build Error
```bash
# ดู build logs
heroku logs --tail --app your-app-name
```

## คำสั่งที่มีประโยชน์

```bash
# ดู app info
heroku info --app your-app-name

# ดู add-ons
heroku addons --app your-app-name

# รัน command ใน Heroku
heroku run bash --app your-app-name

# ดู app status
heroku ps --app your-app-name
```
