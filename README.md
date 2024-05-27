### Requirements

`pip install flask`

`pip install IPython`

`pip install google.generativeai`

`pip install pdfminer`

****



### 部署

1、执行 ./backend/app.py 文件，启动后端服务器；设置环境变量 “Gemini_API_KEY”，值为用户自己申请的Gemini API KEY

![](D:\GAI\Gemini\PDFReaderWithGemini\picture\API_Key.png)

2、执行 ./frontend/login.html，进入登录页面，输入用户名和密码

​	user:admin

​	pws:123456

​	如果显示错误，查看 ./backend/data.db 中的用户名和密码

3、进入交互界面

​	初始交互界面：

![](D:\GAI\Gemini\PDFReaderWithGemini\picture\1.png)

​	点击pdf文件名开始阅读：

![](D:\GAI\Gemini\PDFReaderWithGemini\picture\2.png)