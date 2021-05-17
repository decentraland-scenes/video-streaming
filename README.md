# Setting up the Server for Streaming

### _NOTE: These are just brief notes from my meeting with HPrivakos (will tidy up later...)_

## Outline of why we’re choosing Digital Ocean…

At Decentraland we use Amazon Web Services but Digital Ocean has a nice UI and is quite cheap (only $5 per month)

For $5 per month - it should be able to support up to 50 viewers

50 viewers - more than 50 viewers. Use another service

## Digital Ocean 

* Create droplet
* Choose an image: Debian and version (latest one)
* Basic plan
* $5 / month
* Germany as the datacenter region
* You can add block storage if you want more storage
* Add monitoring as well
* Create a root password…
* You can choose a hostname but that’s not necessary
* Then hit “Create Droplet” - wait for it to start
* Copy the IP address

## Domain Name

* Go to nip.io, which will allow us to transfer an ip address to a domain name for free
* Our domain name will have the postfix nip.io and the ip address will be with dashes instead of periods so e.g. if we have an IP address of 138.68.166.247 then it will become 138-68-166-247.nip.io

## Connect to the server

* Use putty: https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html
* Enter the ip address with the port 22
* Enter root for username
* Enter password for when you created the Digital Ocean droplet
* Once you've logged in...

## Things to install on 

* Install curl and ```git: $ apt install curl git```
* Curl is so that we can do a request to a server - it’s basically a terminal browser and git is git :)
* Say yes to all the questions
* Install NVM, which is Node Version Manager - copy and paste the command below, which is from their github page: https://github.com/nvm-sh/nvm
* ```$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash```
* You can actually install node directly for the distribution that you want e.g. Debian, Fedora etc but you may get a different node version such as LTS vs. Current version so it’s better to use NVM so that you can be sure of the version you install
* And the end of the NVM installation copy, paste and run the last 3 lines into the terminal - alternatively you can close and open the terminal and it would load NVM by default when you connect
* Now we can run: ```$ nvm install 14``` - we’re install nodejs version 14 here
* Next we’ll install Node-Media-Server, this is the server we will use to stream and you can get it from: https://github.com/illuspas/Node-Media-Server
* Just clone the Node-Media-Server repo
* Then change into the Node-Media-Server directory: ```$ cd Node-Media-Server/```
* Next we’ll do a global installation of pm2 (https://www.npmjs.com/package/pm2) by running: ```$ npm i -g pm2```
* Pm2 is a process manager that allows you to keep a program running even when you quit the terminal as normally when you quit the terminal it closes the applications that were ran from it





