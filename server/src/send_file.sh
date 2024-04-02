urlpath=/api/upload_file
server=192.168.0.107
port=31337
filename=$( echo $1 | xargs basename )
cat $1 | base64 > "/data/local/tmp/temp_files/${filename}.b64"
filelength=$( ls -l "/data/local/tmp/temp_files/$filename.b64" | awk '{print $5}')
newfilename="/data/local/tmp/temp_files/${filename}.b64"

(echo -ne "POST ${urlpath} HTTP/1.0\r\nHost: ${server}\r\nContent-Length: ${filelength}\r\nX-File-Name:${filename}\r\nContent-Type: application/octet-stream\r\n\r\n"$(cat $newfilename)) | nc $server $port