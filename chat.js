import { BingChat } from 'bing-chat'

export default async function example(kontol) {
  const regex = /\[[^)]*\]/g
  const COOKIE = process.env['COOKIE']
  const api = new BingChat({
    cookie: COOKIE,
    variant: 'Creative'
  })
  const res = await api.sendMessage(kontol)
return res.text.replace(regex,"")
}