import requests

# 文件的URL
url = "https://raw.githubusercontent.com/modood/Administrative-divisions-of-China/master/dist/pcas-code.json"

# 发送GET请求
response = requests.get(url)

# 检查请求是否成功
if response.status_code == 200:
    # 将内容写入文件
    with open("static/data/pcas-code.json", "wb") as file:
        file.write(response.content)
    print("文件下载成功！")
else:
    print(f"下载失败，状态码：{response.status_code}")