"use client"
import Appbar from "@/components/Appbar"
import Balance from "@/components/Balance"
import { useState, useEffect } from "react"
import axiosInstance from "@/utils/axiosInstance"
import User from "@/components/User"

export default function DashBoard(){

    const [showBalance, setShowBalance] = useState(null)

    const balanceFetch = async () => {
        const response = await axiosInstance.get('/account/balance')
        console.log(response);
        const userBalance = response.data.balance

        if(response){
            setShowBalance(userBalance)
        }
    }
    
    useEffect(() => {
        balanceFetch()
    })
    
    return (
        <div>
            <Appbar/>
            <div>
                <Balance value={showBalance}/>
                <div>
                    <User/>
                </div>
            </div>
        </div>
    )
}
