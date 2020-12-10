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
nonce_repo={}

def decodeArgs(args):
      argDict = dict(x.split("=") for x in args.split("&"))
      token =  jwt.decode(argDict["id_token"], verify=False)
      return token

def verifyNonce(nonce, client_address):
    if nonce in nonce_repo:
        if nonce_repo[nonce] == client_address:
            nonce_repo.pop(nonce)
            return True
        else:
            #Remove the nonce anyway because someone else tried accessing it
            print("Wrong address! Expected " + str(nonce_repo[nonce]) + " but got " + str(client_address))
            nonce_repo.pop(nonce)
            return False
    else:
        #nonce just doesn't exist
        return False

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
        def do_GET(self):
            if self.path[:13] == '/profile.html':
 #               try:
                     args = self.path.split("?%23",1)[1]
                     token = decodeArgs(args)
                     
                     if verifyNonce(token['nonce'], self.client_address[0]):
                         self.send_response(200)
                         self.end_headers()
                         self.wfile.write(b'Hello!' + bytes(token['name'], "utf-8"))
                         return
                     else:
                        self.send_response(403)
                        self.end_headers()
                        self.wfile.write(b'Stop stealing traffic!')
                        return
#                except:
                     print("No token for profile")
                     self.send_response(400)
                     self.end_headers()
                     self.wfile.write(b'Sorry something broke')
                     return
            else:
                return http.server.SimpleHTTPRequestHandler.do_GET(self)
        
        def do_POST(self):
            extension = self.path[15:27]
            if extension == '/updateNonce':
                try:
                     source = str(self.rfile.read1(), "utf-8")
                     nonce = source.split("&nonce=")[1]
                     print(nonce)
#                     print(self.rfile.read1().split("&nonce=")[1])
                     if nonce not in nonce_repo:
                        nonce_repo[nonce] = self.client_address[0]
                        print(self.client_address)
                        self.send_response(200)
                        self.end_headers()
                        self.wfile.write(b'Nonce registered!')
                except:
                     print("problem registering nonce")
                     self.send_response(400)
                     self.end_headers()
                     self.wfile.write(b'Sorry something broke')
                     return
            else:
                    print("Expected /updateNonce but path was " + extension)
                    self.send_response(400)
                    self.end_headers()


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
