# Setting up the Server for Streaming

### _NOTE: These are just brief notes from my meeting with HPrivakos (will tidy up later...)_

## Choosing a hosting option

The simplest option for streaming video is to use a Vimeo paid account. The other recommended alternative is to set up your own server, using free software but paying for hosting on Digital Ocean. Both options have pros and cons for different scenarios. You should evaluate what's best for you taking into account your needs, technical skills and budget.

**Vimeo Plus (or higher)**:

Pors:

- Should be able to support unlimited concurrent users
- Is extremely easy to set up
- Costs $7 USD a month
- Offers analytics dashboard

Cons:

- Only allows you to stream pre-loaded videos, no live streaming.
- In this modality, players see the video start when each arrives to the scene, they may be out of sync with each other.

**Vimeo Premium**

Pros:

- Allows for live streaming
- Is extremely easy to set up
- Offers analytics dashboard

Cons:

- Costs $75 usd a month

**Set up own server on Digital Ocean**

Pros:

- You can do streaming or any modality you want
- Can cost $5 USD a month (this option supports up to roughly 50 viewers)
- Relatively nice UI, if you have a strong technical background

Cons:

- Requires high technical skills to set up everything manually
- The cheap option is not recommended for +50 viewers, more expensive options may be on par with Vimeo Premium.

> Note: For many Decentraland Foundation events, we use Amazon Web Services hosting. This option is more robust, but also more expensive and less friendly to set up.

## Set up Vimeo Plus

This is the simplest option, but doesn't allow for live streaming.

1. Create a Vimeo account if you don't have one. Then upgrade to any of the [paid tiers](https://vimeo.com/upgrade) offered there.

2. Upload a video to one of your folders.

3. Open the video's settings, and select **Advanced**.

4. Pick **Distribution**, and scroll to the bottom to Video file links. Copy one of the links.

> Note: The **High Def(1080)** option may be too much for some Decentraland users. The lower **High Def** option is recommended instead.

5. Paste the link into your scene, replacing the placeholder on the `VideoClip` object.

> Tip: If you intend your video to loop, make sure you set the `loop` property on the `VideoTexture` in your scene. Otherwise the video will play just once for each player.

## Set up Vimeo Premium

This is the most powerful option, but is significantly more expensive than the others.

1. Create a Vimeo account if you don't have one. Then upgrade to the [**Premium**](https://vimeo.com/upgrade) tier.

... profit (?)

## Own Server on Digital Ocean (Advanced)

This is the cheapest option, but is significantly harder to set up than the others.

### On Digital Ocean

- Create droplet
- Choose an image: Debian and version (latest one)
- Basic plan
- $5 / month
- Germany as the datacenter region
- You can add block storage if you want more storage
- Add monitoring as well
- Create a root password…
- You can choose a hostname but that's not necessary
- Then hit "Create Droplet" - wait for it to start
- Copy the IP address

### Domain Name

- Go to nip.io, which will allow us to transfer an ip address to a domain name for free
- Our domain name will have the postfix nip.io and the ip address will be with dashes instead of periods so e.g. if we have an IP address of `138.68.166.247` then it will become `138-68-166-247.nip.io`

### Connect to the server

- Use putty: https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html
- Enter the ip address with the port 22
- Enter `root` for username
- Enter password for when you created the Digital Ocean droplet
- Once you've logged in...

### Things to install on

- First do an update to apt: `$ apt-get update`
- Install curl and git: `$ apt install curl git`
- Curl is so that we can do a request to a server - it's basically a terminal browser and git is git
- Say yes to all the questions
- Install NVM, which is Node Version Manager - copy and paste the command below, which is from their github page: https://github.com/nvm-sh/nvm
- `$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash`
- You can actually install node directly for the distribution that you want e.g. Debian, Fedora etc but you may get a different node version such as LTS vs. Current version so it's better to use NVM so that you can be sure of the version you install
- And the end of the NVM installation copy, paste and run the last 3 lines into the terminal - alternatively you can close and open the terminal and it would load NVM by default when you connect
- Now we can run: `$ nvm install 14` - we're install nodejs version 14 here
- Next we'll install Node-Media-Server, this is the server we will use to stream and you can get it from: https://github.com/illuspas/Node-Media-Server
- Just clone the Node-Media-Server repo: `$ git clone https://github.com/illuspas/Node-Media-Server.git`
- Then change into the Node-Media-Server directory: `$ cd Node-Media-Server/`
- Now install all the necessary packages: `$ npm install`
- Next we'll do a global installation of pm2 (https://www.npmjs.com/package/pm2) by running: `$ npm i -g pm2`
- Pm2 is a process manager that allows you to keep a program running even when you quit the terminal as normally when you quit the terminal it closes the applications that were ran from it

### Editing files

- Within the Node-Media-Directory run: `$ nano app.js` to edit the app.js file
- Nano is a basic text editor
- App.js has all the configuration you need for running a stream
- Ctrl + K to delete...delete the ssl stuff within the rtmp endpoint
- Comment out the https option...
- Make a note of the port number under http option, which should be 8000
- Make sure that under the http option: `allow_origin: '*',`
- There are a bunch of changes to the app.js we need to do...
- Change the `mediaroot: '/srv/media'` - this is where we put files that's being created and or used by programs
- We're going to add another option called trans, which is for transcoding - it's used to transform the rtmp input into HLS output so that it can play in Decentraland:

```ts
  trans: {
    ffmpeg: '/usr/bin/ffmpeg',
    tasks: [
      {
        app: 'live',
        mp4: true,
        mp4Flags: '[movflags=faststart]',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3]', //'hls_flags=delete_segments]',
        dash: true,
        dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
      }
    ]
  },
```

- For that we're going to use a program called ffmpeg, which is for processing video, audio, and other multimedia files and streams.
- You can set the secret under auth - set publish to true and then set your secret: thatsasecretthatsgoingtobeusedlateron (we'll come back to this later once we setup the stream)
- Ctrl + X to exit editor; save with 'y'; enter to accept the file name
- We still need to install ffmpeg and to do that run: `$ apt install ffmpeg`
- Say yes to all the options

## Start the application

- In the command line: `$ pm2 start app.js`
- You can check applications that were started with pm2 by running: `$ pm2 ls`
- If you run into any issues like the status showing an "error" then you can run: `$ pm2 log 0` (0 being the process id)
- You can stop the process by running: `$ pm2 stop 0` (again 0 being the process id)
- You can start the process again by running: `$ pm2 start 0`
- You can restart the process by running: `$ pm2 restart 0`

## Install nginx and certbot

- To install, run: `$ apt install nginx certbot`
- Nginx is used to handle the http video call request from the user and certbot is used to create an SSL certificate for the nginx server - that is what gives you the padlock icon on the address bar in your browser. It is also necessary for CORS
- The command systemctl is used to see what processes are running and you can run: `$ systemctl status nginx` to see if nginx is running or not
- If it's running then you can try going to the <ip-address>.nip.io url then it should be able to see the nginx is running
- You also need the nginx plugin for certbot and to install the run: `$ apt install python-certbot-nginx`
  NOTE: `$ apt install nginx certbot python-certbox-nginx`

### _Tip_

If you’re ever want to search for a package by name you can run: `$ apt search nginx certbot` to see all the packages related to that search query

## Certbot

- To run the certbot: `$ certbot run --nginx -d <ip-address>.nip.io`
- Enter your email address so that you will receive an email when the certification is about to expire
- NOTE: these certificates only last 3 months and will renew automatically - it will also send you an email when it's about to expire
- Agree to the terms of service to obtain the certification by pressing 'A' key to agree
- No need to share your email so say 'No' to that
- It then sends a challenge to the domain you entered to make sure it exists and is pointing to your ip address
- Next select '2' so that you redirect HTTP traffic to HTTPS
- Now if you refresh the browser and check the domain <ip-address>.nip.io - you should see a little padlock

## Changing NGINX configuration

- Run nano again on the following: `$ nano /etc/nginx/sites-enabled/default`
- Scroll down to the HTTPS part, which is the SSL configuration...and in: location / on line 119
- Replace `root /var/ww/html;` with `root /srv/media;`
- Add the following within the braces for `location /` to enable CORS: `proxy_pass https://localhost:8000/;`
- This tells any traffic that’s going to the domain `<ip-address>.nip.io` to use the port 8000
- Ctrl + x to exit editor; save with 'y'; enter to accept the file name
- Now restart nginx by running: `$ systemctl restart nginx`

## Running a stream

- Download and install OBS from: https://obsproject.com/
- Open up OBS and go into settings > stream
- Set the server to: `rtmp://<ip-address>.nip.io/live/`
- The `/live` part of the URL can be found in the app.js under the trans option: `app: 'live'`
- https://en.wikipedia.org/wiki/Real-Time_Messaging_Protocol
- Set the stream key to anything you want - use the name of the stream perhaps...
- In our case we will be using the Stream Key: `test`
- Remember we set the auth in the app.js to publish: true along with a secret - this is where we will be needing it
- If we try to connect now then it won't work - to connect you click on the "start streaming" button
- We can go back to the server terminal and run to check if the stream is working: `$ pm2 log 0 -f`
- And it should show up as Unauthorized because we haven't added the key yet
- To create the stream key we need to copy the secret from the app.js file and create a md5 hash of it that includes the `/live/<name of stream>-<unix timestamp you want it to last until>-<copy of key from app.js>`
- https://www.md5hashgenerator.com/
- https://www.unixtimestamp.com/
- So in our case it would be `/live/test-2620857302-thatsasecretthatsgoingtobeusedlateron`
- The result of the md5 hash should be: `4cb8c5aa6d6f341b6d1d915956ebf459`
- Now back in OBS in settings > stream
- Our stream key is going to be: `<name of stream>?sign=<unix timestamp you want it to last until>-<md5 hash of the secret>`
- So in our case that would be: `test?sign=2620857302-4cb8c5aa6d6f341b6d1d915956ebf459`
- Now apply those changes and hit the "start streaming" button and it should be working
- And if you run: `$ pm2 log 0 -f` in the server terminal again it will say it's published - it will say rtmp connect, rtmp play, rtmp publish
- Also in OBS it will say it's "live"
- Now run: `$ mpv https://68-183-70-239.nip.io/live/test/index.m3u8` and you should see the stream
- This `https://68-183-70-239.nip.io/live/test/index.m3u8` link is what you use in your Decentraland scene
