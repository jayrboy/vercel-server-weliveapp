import 'dotenv/config'
import express from 'express'
import axios from 'axios'
import Order from '../Models/Order.js'

const router = express.Router()

// Define a message verify token (custom)
const WEBHOOKS_VERIFY_TOKEN = process.env.WEBHOOKS_VERIFY_TOKEN || 'message001'
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN

//! Meta เปิด Mode: Live Preview สำหรับ Test

// GET: /api/webhooks/chatbot
router.get('/webhooks/chatbot', (req, res) => {
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

// POST: /api/webhooks/chatbot
router.post('/webhooks/chatbot', async (req, res) => {
  let form = req.body

  if (form.object === 'page') {
    form.entry.forEach((entry) => {
      // Get the body of the webhook event
      let webhook_event = entry.messaging[0]

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id
      console.log('PSID: ', sender_psid)

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

//TODO: Handle Message Events
async function handleMessage(sender_psid, received_message) {
  let response

  try {
    // ดึงชื่อผู้ใช้จาก PSID
    const userProfile = await getUserProfileName(sender_psid)

    // ค้นหาออเดอร์ของผู้ใช้ใน MongoDB
    const userProfileName = userProfile.name
    const order = await findOrderByName(userProfileName)
    // กรณีที่ผู้ใช้ส่งข้อความปกติ
    if (received_message.text) {
      if (order) {
        response = {
          text: `สวัสดีคุณ ${order.name} คุณมีคำสั่งซื้อ. หากต้องการรายละเอียดเพิ่มเติมกรุณาเข้าลิงก์: https://weliveapp.netlify.app/order/${order._id}`,
        }
      } else {
        response = {
          text: `ไม่พบคำสั่งซื้อในระบบสำหรับชื่อ "${userProfileName}".`,
        }
      }
    }
    // กรณีที่ผู้ใช้ส่งรูปภาพ
    else if (received_message.attachments) {
      // Get the URL of the message attachment
      let attachment_url = received_message.attachments[0].payload.url

      if (order) {
        // Respond with a generic template showing the order URL and asking for confirmation
        response = {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [
                {
                  title: `คุณ ${order.name} มีคำสั่งซื้อ`,
                  subtitle: `คลิกลิงก์เพื่อตรวจสอบคำสั่งซื้อเพิ่มเติม`,
                  image_url: attachment_url, // รูปภาพที่ผู้ใช้ส่งมา
                  buttons: [
                    {
                      type: 'web_url',
                      url: `https://weliveapp.netlify.app/order/${order._id}`,
                      title: 'ดูรายละเอียดคำสั่งซื้อ',
                    },
                    {
                      type: 'postback',
                      title: 'ใช่! นี่คือสินค้าที่ต้องการ',
                      payload: 'yes',
                    },
                    {
                      type: 'postback',
                      title: 'ไม่! สินค้านี้ไม่ถูกต้อง',
                      payload: 'no',
                    },
                  ],
                },
              ],
            },
          },
        }
      } else {
        response = {
          text: `ไม่พบคำสั่งซื้อในระบบสำหรับชื่อ "${userProfileName}".`,
        }
      }
    }
  } catch (error) {
    response = {
      text: 'ขออภัย เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อของคุณ กรุณาลองใหม่อีกครั้ง',
    }
  }
  console.log(response)

  // ส่งข้อความ response กลับไปยังผู้ใช้
  callSendAPI(sender_psid, response)
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
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  }

  // Send the HTTP request to the Messenger Platform
  try {
    axios.post('https://graph.facebook.com/v20.0/me/messages', request_body, {
      params: {
        access_token: PAGE_ACCESS_TOKEN,
      },
    })
    console.log('Message sent!')
  } catch (error) {
    console.log('Unable to send message')
  }
}

// ดึงข้อมูลผู้ใช้จาก Graph API
async function getUserProfileName(psid) {
  try {
    let response = await axios.get(
      `https://graph.facebook.com/${psid}?fields=name&access_token=${PAGE_ACCESS_TOKEN}`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw new Error('Unable to fetch user profile')
  }
}

async function findOrderByName(userProfileName) {
  try {
    const order = await Order.findOne({ name: userProfileName }).exec()
    if (order) {
      console.log('Order found:', order)
      return order
    } else {
      console.log('No order found for this user')
      return null
    }
  } catch (error) {
    console.error('Error fetching order:', error)
    throw new Error('Unable to fetch order')
  }
}

export default router
