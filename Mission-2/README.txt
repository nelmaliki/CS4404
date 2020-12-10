README For Mission 2
Begin by uploading the four zip files to the respective VMs and unzipping them. Note you can run "apt install zip" Afterwards proceed with the following steps. Setup bind9 on VM2 as described in the report, and make sure you have the named.conf files and the zones.

On 10.21.8.1 VM (all with sudo privileges)
Modify /etc/resolv.conf so the name server is 10.21.8.2
sysctl net.ipv4.ip_forward=1
route add default gw 10.21.8.1
route add 10.21.8.2 gw 10.21.8.1
route add 10.21.8.3 gw 10.21.8.1
route add 10.21.8.4 gw 10.21.8.1
RUN SCRIPT OR tcpdump -i ens3 src 10.21.8.3

On 10.21.8.2
sudo service bind9 restart

On 10.21.8.3 and 10.21.8.4
Modify /etc/resolv.conf so the name server is 10.21.8.2
	route add default gw 10.21.8.1
	route add 10.21.8.2 gw 10.21.8.1
navigate to the bombastServer directory on VM3 and type sudo python3 server.py &
navigate to the shueServer directory on VM4 and type sudo python3 server.py &

run dig or nslookup on bombast.com or shueISP.com on VM3

TO RUN THE ATTACK:
Ensure the infrastructure is setup before going to VM1 and navigating to the ispData folder.
	sudo python3 attack.py

Note that the attack script will setup the necessary iptables rules on it's own. If you see any duplicate entry errors, it is fine.


TO RUN THE DEFENSE:
Section 1 protect with DNSSEC:
On VM2 setup DNSSEC as described in the paper and sign the keys.
Verify it by running the following on VM3 with the public key you generated while setting up DNSSEC:
	drill -D shueISP.com OR drill -k <public zone-signing key> -D shueISP.com
If all goes well and the attack is not running you will see an approval message. Otherwise if the attack is running you will see an invalid message implying the traffic has been tampered with.

Section 2 protect against DOS:
On VM1 run with root privileges: rateLimiting.py -c max_packets -t time_seconds 
	max_packets is the max packets allowed by an IP.
	time_seconds is the time in seconds before reset.
On VM3 run the reflection.py script with root priviliges.

Other files:
named.conf.* files. These go on VM2 to help with setting up DNSSEC and the DNS server as described in the paper.
normal.py - This just forwards DNS traffic without modifying it.
Any file in Zones/ These are the zone files that bind9 needs to run the DNS server and serve the webpages.

server.py These simply launch the servers for bombast.com and shueISP.com
.key files. These are the key files used to enable DNSSEC on shueISP.com. Note that the one that begins with 33 is the zone signing key, and should be used when drilling the DNS server for a response to verify DNSSEC is working properly.
