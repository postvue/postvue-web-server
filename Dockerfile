# 1. Production 단계
FROM nginx:1.23
WORKDIR /usr/share/nginx/html

# GitHub Actions에서 빌드된 결과물을 복사
COPY build/ .

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]