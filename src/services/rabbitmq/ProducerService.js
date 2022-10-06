const amqp =require('amqplib');
const config = require('../../utils/config');

const ProducerService = {
  sendMessage: async (queue, message) =>{
    const conn = await amqp.connect(config.mq.server);
    const channel = await conn.createChannel();
    await channel.assertQueue(queue, {
      durable: true,
    });

    await channel.sendToQueue(queue, Buffer.from(message));

    // close connection after 1 second
    setTimeout(() =>{
      conn.close();
    }, 1000);
  },
};

module.exports = ProducerService;
