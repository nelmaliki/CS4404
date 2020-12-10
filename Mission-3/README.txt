Upload the VM1 folder to vm1 and unzip it.
Note you will need to download and setup Keycloak as described in the attached pdf paper.
You will also have to setup the routing information by running the following commands on their respective servers with elevated privileges:
On VM3 10.21.8.3
route add default gw 10.21.8.2
route add 10.21.8.1 gw 10.21.8.2

On VM2 10.21.8.2
route add default gw 10.21.8.2
route add 10.21.8.1 gw 10.21.8.2
route add 10.21.8.3 gw 10.21.8.2
sysctl net.ipv4.ip_forward=1

On VM1 10.21.8.1
route add default gw 10.21.8.2
route add 10.21.8.3 gw 10.21.8.2

The clientServer folder contains a python server (sudo python3 server.py to run)
The client_w_defense folder is the same but has the defense implemeneted
the keycloak folder contains the IDP, must also be running for the infrastructure to work
sudo ./bin/standalone.sh -b 10.21.8.1 -Djboss.socket.binding.port-offset=100

Lastly the remaining file is the python dependency we needed for the defence
pip install PyJWT-1.7.1-py2.py3-none-any.whl for the defense to work. 

Lastly, please keep the IP address of the clientServer the same if possible since all the addresses are hardcoded. (you could change all occurences in the html and python files, then update the baseURL in the keycloak admin console. See Mission3 report for more details.)

After launching the keycloak server, you can boot either the normal client server or the defended client server with:
sudo python3 server.py

After this, use VM3 and open up firefox and navigate to 10.21.8.1:8001 and you will be redirected to the Keycloak login instance. Enter your information to login.

To run the attack launch wireshark on VM2 then follow the instructions as described in the paper.