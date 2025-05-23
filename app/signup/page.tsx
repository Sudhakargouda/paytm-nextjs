"use client"
import Heading from "@/components/Heading"
import SubHeading from "@/components/SubHeading"
import InputBox from "@/components/InputBox"
import Button from "@/components/Button"
import BottomWarning from "@/components/BottomWarning"
import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"


export default function Signup(){

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const addSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
          setLoading(true)
          const response = await axios.post('http://localhost:3000/api/v2/signup', {
            username,
            password,
            firstName,
            lastName
          })
          console.log(response);
          localStorage.setItem('token', response.data.token)
          if (response) {
            router.push('/dashboard')
            return
          }
        } catch (error) {   
          console.error('Error during signup:', error)
        } finally {
          setLoading(false)
        }
      }

    return (
        <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <form onSubmit={addSignup} className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label="Sign Up" />
          <SubHeading label="Enter your information to create an account" />
          <InputBox
            onChange={(e:React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            placeholder="abc@gmail.com"
            label="Username"
          />
          <InputBox
            onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="12345"
            label="Password"
          />
          <InputBox
            onChange={(e:React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
            placeholder="John"
            label="First Name"
          />
          <InputBox
            onChange={(e:React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
            placeholder="Doe"
            label="Last Name"
          />
          <div className="pt-4">
            <Button label={loading ? "Signing up..." : "Sign up"} />
          </div>
          <BottomWarning
            label="Already have an account?"
            buttonText="Sign in"
            to="/signin"
          />
        </form>
      </div>
    </div>    
    )
}