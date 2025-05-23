"use client";
import { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import InputBox from "@/components/InputBox";
import Button from "@/components/Button";
import Heading from "@/components/Heading";

export default function SendMoney() {
  const [amount, setAmount] = useState("");
  const [to, setTo] = useState("");

  const transferMoney = async () => {
    const response = await axiosInstance.post("/account/transfer", {
      amount: Number(amount),
      to: Number(to),
    });

    if (response) {
      alert("Amount Transfer Succesful");
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label="Send Money" />

          <InputBox
            className="text-black"
            label="To"
            placeholder="userId"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setTo(e.target.value);
            }}
          />

          <InputBox
            className="text-black"
            label="Amount"
            placeholder="amount"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setAmount(e.target.value);
            }}
          />

          <div className="mt-4">
            <Button label="sendMoney" onClick={transferMoney} />
          </div>
        </div>
      </div>
    </div>
  );
}
