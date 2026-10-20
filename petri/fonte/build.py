import base64,re,sys
D='../assets/'
s=open('deck.src.html',encoding='utf-8').read()
s=re.sub(r'\{\{IMG:(\w+)\}\}',lambda m:'data:image/jpeg;base64,'+base64.b64encode(open(D+m.group(1)+'.jpg','rb').read()).decode(),s)
open('../index.html','w',encoding='utf-8').write(s);print(len(s)//1024,'KB')
