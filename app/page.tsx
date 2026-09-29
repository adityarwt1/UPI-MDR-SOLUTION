"use client"

import React, { ChangeEvent, useMemo, useState } from "react"
import { QRCodeCanvas } from "qrcode.react"

const MAX_AMOUNT_PER_QR = 2000
const MIN_AMOUNT_PER_QR = 1000

const splitAmount = (amount: number): number[] => {
  if (amount <= 0) {
    return []
  }

  if (amount <= MAX_AMOUNT_PER_QR) {
    return [amount]
  }

  const amounts: number[] = []
  let remaining = amount

  while (remaining > 0) {
    if (remaining <= MAX_AMOUNT_PER_QR) {
      amounts.push(remaining)
      break
    }

    const maxAllowed = Math.min(
      MAX_AMOUNT_PER_QR,
      remaining - MIN_AMOUNT_PER_QR
    )

    const minAllowed = Math.min(
      MIN_AMOUNT_PER_QR,
      maxAllowed
    )

    const split =
      Math.floor(
        Math.random() * (maxAllowed - minAllowed + 1)
      ) + minAllowed

    amounts.push(split)
    remaining -= split
  }

  return amounts
}

const HOME_PAGE = () => {
  const [upiId, setUpiId] = useState("")
  const [upiName, setUpiName] = useState("")
  const [ammount, setAmmount] = useState(0)

  const splittedAmmount = useMemo(() => {
    return splitAmount(ammount)
  }, [ammount])

  const handleOnChangeFormValue = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { value, type, name } = e.target

    if (type === "number") {
      setAmmount(Number(value))
      return
    }

    if (name === "upiId") {
      setUpiId(value)
      return
    }

    if (name === "upiName") {
      setUpiName(value)
    }
  }

  const generateUPIUrl = (amount: number) => {
    const params = new URLSearchParams({
      pa: upiId.trim(),
      pn: upiName.trim(),
      am: amount.toFixed(2),
      cu: "INR",
    })

    return `upi://pay?${params.toString()}`
  }

  const isValidUPI =
    upiId.trim().length > 0 &&
    upiName.trim().length > 0

  return (
    <main className="flex flex-col min-h-screen">

      {/* Form */}
      <form className="flex flex-col w-full px-4 py-2 gap-2">

        <label
          htmlFor="upiId"
          className="text-zinc-950 font-medium"
        >
          UPI ID
        </label>

        <input
          id="upiId"
          type="text"
          name="upiId"
          value={upiId}
          onChange={handleOnChangeFormValue}
          placeholder="example@upi"
          className="border border-zinc-950/15 rounded-lg px-3 py-2 outline-none focus:border-zinc-950"
        />

        <label
          htmlFor="upiName"
          className="text-zinc-950 font-medium"
        >
          UPI Name
        </label>

        <input
          id="upiName"
          type="text"
          name="upiName"
          value={upiName}
          onChange={handleOnChangeFormValue}
          placeholder="Your Name"
          className="border border-zinc-950/15 rounded-lg px-3 py-2 outline-none focus:border-zinc-950"
        />

        <label
          htmlFor="ammount"
          className="text-zinc-950 font-medium"
        >
          Amount
        </label>

        <input
          id="ammount"
          type="number"
          name="ammount"
          min="0"
          step="1"
          value={ammount || ""}
          onChange={handleOnChangeFormValue}
          placeholder="Enter amount"
          className="border border-zinc-950/15 rounded-lg px-3 py-2 outline-none focus:border-zinc-950"
        />

      </form>

      {/* QR Cards */}
      <div className="flex flex-wrap items-center justify-center gap-4 w-full p-4">

        {isValidUPI &&
          splittedAmmount.map((amount, index) => {

            const upiUrl = generateUPIUrl(amount)

            return (
              <div
                key={`qr_code_${index}_${amount}`}
                className="
                  relative
                  flex
                  flex-col
                  justify-center
                  items-center
                  gap-3
                  p-4
                  mx-2
                  rounded-2xl
                  bg-[#e0e0e0]
                  border
                  border-zinc-950/15
                  shadow-lg
                "
              >

                {/* Checkbox */}
                <div className="absolute top-3 right-3">
                  <input
                    type="checkbox"
                    className="
                      h-5
                      w-5
                      cursor-pointer
                      accent-zinc-950
                    "
                  />
                </div>

                {/* QR Code */}
                <QRCodeCanvas
                  value={upiUrl}
                  size={250}
                  level="M"
                  includeMargin={true}
                />

                {/* Amount */}
                <div
                  className="
                    font-mono
                    text-2xl
                    font-semibold
                    text-zinc-950
                  "
                >
                  ₹{amount}
                </div>

              </div>
            )
          })}

      </div>

    </main>
  )
}

export default HOME_PAGE