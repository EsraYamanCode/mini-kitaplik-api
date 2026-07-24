# 1. Hafif bir Node.js imajı taban alıyoruz
FROM node:18-alpine

# 2. Konteyner içinde çalışacağımız dizini belirliyoruz
WORKDIR /app

# 3. Bağımlılık listelerini kopyalıyoruz
COPY package*.json ./

# 4. Paketleri konteynere yüklüyoruz
RUN npm install

# 5. Kalan tüm proje dosyalarını kopyalıyoruz
COPY . .

# 6. Sunucunun çalıştığı 3000 portunu belirtiyoruz
EXPOSE 3000

# 7. Konteyner çalıştığında uygulamayı başlatacak komut
CMD ["node", "index.js"]