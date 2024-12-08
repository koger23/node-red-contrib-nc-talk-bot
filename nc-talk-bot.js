const axios = require('axios');
const crypto = require('crypto');

module.exports = function (RED) {

    function NextcloudBotConfigNode (config) {
      RED.nodes.createNode(this, config)
      this.address = config.address
      this.insecure = config.insecure
    }
    RED.nodes.registerType('nc-talk-bot-credentials', NextcloudBotConfigNode, {
      credentials: {
        url: { type: 'text' },
        secret: { type: 'password' }
      }
    })

    function NextcloudTalkBot(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        const ncUrl = config.ncUrl;
        const secret = config.secret;

        // Generate HMAC signature
        function generateSignature(data, secret, random) {
            const hmac = crypto.createHmac('sha256', secret);
            hmac.update(random);
            hmac.update(data);

            return hmac.digest('hex');
        }

        // Send a message
        async function sendMessage(message, token, replyTo, silent) {
            if (!token) {
                throw new Error("Missing 'token' value.");
            }
            const referenceId = crypto.randomBytes(16).toString('hex');
            const random = crypto.randomBytes(32).toString('hex');
            const data = {message, referenceId };
            data.replyTo = replyTo ? replyTo : data.replyTo;
            data.replyTo = silent ? silent : data.silent;

            const signature = generateSignature(data.message, secret, random);
            const headers = {
                'X-Nextcloud-Talk-Bot-Random': random,
                'X-Nextcloud-Talk-Bot-Signature': signature,
                'OCS-APIRequest': 'true',
            };
            const url = `${ncUrl}/ocs/v2.php/apps/spreed/api/v1/bot/${token}/message`;

            try {
                const response = await axios.post(url, data, { headers });
                return response.data;
            } catch (error) {
                throw new Error(error.response?.data || error.message);
            }
        }

        node.on('input', async function (msg, send, done) {
            try {
                const { message, token, replyTo, silent } = msg.payload;
                const response = await sendMessage(message, token, replyTo, silent);
                msg.payload = response;
                send(msg);
                done();
            } catch (err) {
                node.error(err.message, msg);
                done(err);
            }
        });
    }
    RED.nodes.registerType('nc-talk-bot', NextcloudTalkBot);
};
