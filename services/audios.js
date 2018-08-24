
let newChat = {}
let newMessage = {}

if (process.browser) {
  newChat = new window.Audio('audio')
  newChat.src = 'https://dxpdcvj89hnue.cloudfront.net/audio/newChat.mp3'
  newMessage = new window.Audio('audio')
  newMessage.src = 'https://dxpdcvj89hnue.cloudfront.net/audio/newMessage.mp3'
}

export default {
  newChat,
  newMessage
}
