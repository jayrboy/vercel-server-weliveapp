import 'dotenv/config'
import express from 'express'
import axios from 'axios'

const router = express.Router()

// Define a message verify token (custom)
const VERIFY_TOKEN = process.env.WEBHOOKS_VERIFY_TOKEN
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN
let received_updates = []

//! Meta เปิด Mode: Live Preview สำหรับ Test
/*-------------- https://ngrok-free.app/webhooks --------------*/

router.get('/', (req, res) => {
  res.send('<pre>' + JSON.stringify(received_updates, null, 2) + '</pre>')
})

// //TODO: Webhooks Test
// /* ---------------------- GET-Webhooks-TEST ------------------- */
router.get('/test', (req, res) => {
  // Parse the query params
  let mode = req.query['hub.mode']
  let verifyToken = req.query['hub.verify_token']
  let challenge = req.query['hub.challenge']

  if (mode === 'subscribe' && verifyToken === VERIFY_TOKEN) {
    console.log('WEBHOOK_VERIFIED')
    res.status(200).send(challenge)
  } else {
    // Return with '403 Forbidden' if verify tokens do not match
    console.log('403 Forbidden')
    res.sendStatus(403)
  }
})
// //TODO: Webhooks Test
// /* ---------------------- POST-Webhooks-TEST -------------------- */
router.post('/test', async (req, res) => {
  // Facebook will be sending an object called
  let form = req.body

  if (!req.isXHubValid) {
    console.log('Warning request header X-Hub-Signature not present or invalid')
    res.sendStatus(401)
    return
  }

  if (!req.body.entry) {
    console.log('INVALID_POST_DATA_RECEIVED')
    return res.status(500)
  }

  if (form.object) {
    let events = form.entry[0]
    received_updates.unshift(events)
  } else {
    res.sendStatus(404) // if event is not from a "page" subscription
  }
  res.sendStatus(200)
})

//TODO: Webhooks Chatbot
/* ---------------------- GET-Webhooks-Chatbot ------------------- */
router.get('/chatbot', (req, res) => {
  // Parse the query params
  let mode = req.query['hub.mode']
  let verifyToken = req.query['hub.verify_token']
  let challenge = req.query['hub.challenge']

  if (mode === 'subscribe' && verifyToken === VERIFY_TOKEN) {
    console.log('WEBHOOK_VERIFIED')
    res.status(200).send(challenge)
  } else {
    // Return with '403 Forbidden' if verify tokens do not match
    console.log('403 Forbidden')
    res.sendStatus(403)
  }
})
//TODO: Webhooks Chatbot
/* --------------------- POST-Webhooks-Chatbot ------------------- */
router.post('/chatbot', async (req, res) => {
  let form = req.body

  if (form.object === 'page') {
    form.entry.forEach((entry) => {
      // Get the body of the webhook event
      let webhook_event = entry.messaging[0]
      received_updates.unshift(webhook_event)

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id
      console.log(sender_psid)

      /*  
        Check if the event is a message or postback and
        pass the event to thr appropriate handler function
      */
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message)
      } else if (webhook_event.postback) {
        handlePostBack(sender_psid, webhook_event.postback)
      }
    })
    res.status(200).send('EVENT_RECEIVED')
  } else {
    res.sendStatus(404) // if event is not from a "page" subscription
  }
})

// Handle Message Events
function handleMessage(sender_psid, received_message) {
  let response

  // Check if the message contains text
  if (received_message.text) {
    //  Create the payload for a basic text message
    response = {
      text: `You sent the message "${received_message.text}". Now send me an image!`,
    }
  } else if (received_message.attachments) {
    // Gate the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url

    response = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: 'Is this the right picture?',
              subtitle: 'Tap a button to answer.',
              image_url: attachment_url,
              buttons: [
                {
                  type: 'postback',
                  title: 'Yes!',
                  payload: 'yes',
                },
                {
                  type: 'postback',
                  title: 'No!',
                  payload: 'no',
                },
              ],
            },
          ],
        },
      },
    }
  }

  // Send the response message
  callSendAPI(sender_psid, response)
}

// Handle "messaging_postback" Events
function handlePostBack(sender_psid, received_postback) {
  let response

  // Get the payload for the postback
  let payload = received_postback.payload

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { text: 'Thanks!' }
  } else if (payload === 'no') {
    response = { text: 'Oops, try sending another image.' }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response)
}

// Send Response Message via the Send API
async function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  }
  // Send the HTTP request to the Messenger Platform
  try {
    await axios.post(
      'https://graph.facebook.com/v19.0/me/messages',
      request_body,
      {
        params: {
          access_token: PAGE_ACCESS_TOKEN,
        },
      }
    )
    console.log('Message sent!')
  } catch (error) {
    console.log('Unable to send message')
  }
}

export default router
