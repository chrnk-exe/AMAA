urlpath=/upload_file
server=192.168.0.109
port=31337
file=/home/vanya/wtf/file.txt
filelength=`ls -l ${file} | awk '{print $5}'`

(echo -ne "POST ${urlpath} HTTP/1.0\r\nHost: ${server}\r\nContent-Length: ${filelength}\r\nContent-Type: application/octet-stream\r\n\r\n"$(cat $file)) | nc $server $port