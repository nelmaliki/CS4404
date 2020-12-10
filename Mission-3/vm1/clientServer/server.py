#server.py
import http.server
import socketserver
import base64
import json
import sys
sys.path
import jwt

hostName = "10.21.8.1"
serverPort = 8001

def decodeArgs(args):
      argDict = dict(x.split("=") for x in args.split("&"))
      token =  jwt.decode(argDict["id_token"], verify=False)
      return token

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
        def do_GET(self):
            if self.path[:13] == '/profile.html':
               # try:
                args = self.path.split("?%23",1)[1]
                print(args)
                token = decodeArgs(args)
                print(token)
                self.send_response(200)
                self.end_headers()
                self.wfile.write(b'Hello!' + bytes(token['name'], "utf-8"))
                #except:
                 #   print("No token for profile")
                  #  self.send_response(400)
                   # self.end_headers()
#                     self.wfile.write(b'Sorry something broke')
                   # return

            else:
                return http.server.SimpleHTTPRequestHandler.do_GET(self)





Handler = MyHttpRequestHandler

if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True #This allows us to use the same port immediately
    webServer = socketserver.TCPServer((hostName, serverPort), Handler)
    print ("Server Started http://%s:%s" % (hostName, serverPort))
    try :
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass
    
    webServer.server_close()
    print("Server Stopped.")
