import 'dotenv/config'
import express from 'express'
import axios from 'axios'
import Order from '../Models/Order.js'

const router = express.Router()

// Define a message verify token (custom)
const WEBHOOKS_VERIFY_TOKEN = process.env.WEBHOOKS_VERIFY_TOKEN || 'message001'
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN
let received_updates = []

//! Meta เปิด Mode: Live Preview สำหรับ Test
/*-------------- http://localhost:8000/webhooks --------------*/

router.get('/', (req, res) => {
  res
    .status(200)
    .send('<pre>' + JSON.stringify(received_updates, null, 2) + '</pre>')
})

//? http://localhost:8000/webhooks/chatbot

// GET Webhooks Chatbot
http: router.get('/chatbot', (req, res) => {
  // Parse the query params
  let mode = req.query['hub.mode']
  let verifyToken = req.query['hub.verify_token']
  let challenge = req.query['hub.challenge']

  if (mode === 'subscribe' && verifyToken === WEBHOOKS_VERIFY_TOKEN) {
    console.log('WEBHOOK_VERIFIED')
    res.status(200).send(challenge)
  } else {
    // Return with '403 Forbidden' if verify tokens do not match
    console.log('403 Forbidden')
    res.sendStatus(403)
  }
})

// TODO: POST /webhooks/chatbot
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

// ดึงข้อมูลผู้ใช้จาก Graph API
async function getUserProfile(sender_psid) {
  try {
    let response = await axios.get(
      `https://graph.facebook.com/${sender_psid}`,
      {
        params: {
          access_token: PAGE_ACCESS_TOKEN,
          fields: 'id,name',
        },
      }
    )
    return response.data
  } catch (error) {
    console.log('Unable to fetch user profile:', error)
    return null
  }
}

//TODO: Handle Message Events
async function handleMessage(sender_psid, received_message) {
  let response

  // ดึงข้อมูลผู้ใช้จาก Facebook Graph API
  let userProfile = await getUserProfile(sender_psid)

  if (received_message.text) {
    if (
      received_message.text.includes('ออเดอร์') ||
      received_message.text.toLowerCase().includes('order')
    ) {
      let orderExisting =
        Order.findOne({ name: userProfile.name }).exec() ||
        '66f26035ce4676d34f30478b'
      let orderUrl = `https://weliveapp.netlify.app/order/${orderExisting._id}`

      // let orderId = '668a6ff30a92b373360500eb'
      // let orderUrl = `https://weliveapp.netlify.app/order/${orderId}`

      if (userProfile) {
        response = {
          text: `สวัสดีคุณ ${userProfile.name} นี่คือลิงก์ออเดอร์ของคุณ: ${orderUrl}`,
        }
      } else {
        response = {
          text: `ไม่พบออเดอร์ของคุณ ${userProfile.name}`,
        }
      }
    } else {
      response = {
        text: `คุณส่งข้อความ "${received_message.text}" มา กรุณาส่งรูปภาพสินค้าที่ต้องการ หรือพิมพ์ "order" เพื่อดูคำสั่งซื้อของคุณลูกค้า`,
      }
    }
  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url

    // Respond with a generic template asking for confirmation
    response = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: 'นี่คือสินค้าที่ต้องการใช่หรือไม่?',
              subtitle: 'กดปุ่มเพื่อตอบคำถาม',
              image_url: attachment_url,
              buttons: [
                {
                  type: 'postback',
                  title: 'ใช่!',
                  payload: 'yes',
                },
                {
                  type: 'postback',
                  title: 'ไม่!',
                  payload: 'no',
                },
              ],
            },
          ],
        },
      },
    }
  }

  // ส่งข้อความ response กลับไปยังผู้ใช้
  await callSendAPI(sender_psid, response)
}

// Handle "messaging_postback" Events
function handlePostBack(sender_psid, received_postback) {
  let response

  // Get the payload for the postback
  let payload = received_postback.payload

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = {
      text: 'คำสั่งซื้อของคุณได้รับการยืนยันแล้ว เราจะดำเนินการโดยเร็วที่สุด',
    }
  } else if (payload === 'no') {
    response = {
      text: 'คำสั่งซื้อของคุณถูกยกเลิกแล้ว แจ้งให้เราทราบหากคุณต้องการความช่วยเหลือใด ๆ',
    }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response)
}

// ส่งข้อความไปยัง Messenger API
export async function callSendAPI(sender_psid, response) {
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
      'https://graph.facebook.com/v20.0/me/messages',
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
