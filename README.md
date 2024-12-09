# node-red-contrib-nc-talk-bot
This is a Nextcloud Talk bot package for communicating with chat rooms.

## Preparation - Creating a bot
You can skip this if you already have a bot, just jump to the "Installation" part.

Using Docker: if you run Nextcloud in Docker container, connect to the container with the following:
```
docker exec -it -u 33 6296172064fb /bin/bash
```

Parameter `-u 33` is needed to get proper permissions based on owner ID of config.php.

### Creating a bot in Nextcloud
⚠️ Depending on your installation use just `occ` or `/var/www/html/occ` in CLI:
```
/var/www/html/occ talk:bot:install "{bot_name}" "{64-128 char long secret}" "{webhook url}" "{bot_name}"
```

1. Check you bot is in the list:
```
/var/www/html/occ talk:bot:list
```

2. Get your user ID:
```
/var/www/html/occ user:list
```

3. Create a room:
```
/var/www/html/occ talk:room:create --user {user_id} --owner {user_id} "{chat_room_name}"
```
This will return the room token, save it.

4. Add bot to the room:
```
/var/www/html/occ talk:bot:setup 1 {room_token}
```

Now you and your bot are in a room. You can add anyone else living person if you want in the app or in CLI.
You can find more detailed information in [the Nextcloud Talk occ commands documentation](https://nextcloud-talk.readthedocs.io/en/latest/occ/).

## Installation
Run the following to install from npm repository:
```
npm install node-red-contrib-nc-talk-bot
```

If you install it locally after a git clone or downloaded as ZIP:
```
npm install /path/to_your_package_folder
```

## First use
After the installation you should find a new node under category "nextcloud" in your Node-RED.

To send message by the bot to a room you need:
- Your Nextcloud URL
- Your room token
- Your bot secret

Add the node, and fill in "Nextcloud URL" and "Secret" with the bot secret.

### Sending message
To send a message you need to pass the message itself and the room token in the payload for the node as follows:
```
{
  "message": "Hello from Node-RED!",
  "token": "this_is_your_room_token"
}
```

And that's it! Have fun and happy automation!



