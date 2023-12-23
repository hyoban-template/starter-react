# 为了避免在一些平台比如 Railway 需要手动设置 PORT 环境变量的问题，这里动态的修改 Nginx 配置的端口
p="${PORT:-80}"
sed -E -i.bak 's/listen[[:space:]]+[[:digit:]]+/listen '${p}'/' /etc/nginx/conf.d/default.conf

nginx -g "daemon off;"
