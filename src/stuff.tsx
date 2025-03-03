import { useState } from 'react'
import './App.css'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import {QRCodeSVG} from 'qrcode.react';
import { Label } from './components/ui/label'
import { BASE_URL } from './constant'
import qr from "qr-image"
const Stuff = () => {
  const [form,setForm] = useState({
    email: "",
    name: ""
  })
  const [dataQr,setDataQr] = useState("")
  const handleGenerateQr = () => {
    // validae form
    const link = `${BASE_URL}/users?name=${form.name}&email=${form.email}`
    setDataQr(link)
  }
  const a = qr.image('I love QR!', { type: 'svg' })

  return (
    <>
      <div className='app flex gap-8 items-start'>
        <div className='left-content grow-1 grid grid-cols-1 gap-y-6'>
          <div className='input-form bg-gray-100 rounded-lg p-4'>
            {/* <ProfileForm/>      */}
            <Label>Name</Label>
            <Input value={form.name} onChange={e=>setForm({...form,name: e.target.value})}/>
            <Label>Email</Label>

            <Input value={form.email} onChange={e=>setForm({...form,email: e.target.value})}/>
          </div>
          <Button onClick={handleGenerateQr}>Generate email</Button>
        </div>
        <div className='right-content grow-5 h-[94vh] bg-gray-100  rounded-lg p-4'>
          <QRCodeSVG value={"https://grok.com/chat/c2a66a97-f4b5-45f1-910b-863e9b5bb5b9"} />
        </div>
      </div>
    </>
  )
}
 
export default Stuff;