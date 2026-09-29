"use client"

import React, { ChangeEvent, useMemo, useState } from "react"
import { QRCodeCanvas } from "qrcode.react"

const MAX_AMOUNT_PER_QR = 2000
const MIN_AMOUNT_PER_QR = 1000

const splitAmount = (amount: number): number[] => {
  if (amount <= 0) {
    return []
  }

  // If the amount can be paid in one transaction
  if (amount <= MAX_AMOUNT_PER_QR) {
    return [amount]
  }

  const amounts: number[] = []
  let remaining = amount

  while (remaining > 0) {
    /*
     * If the remaining amount itself can fit
     * into one QR, use it directly.
     */
    if (remaining <= MAX_AMOUNT_PER_QR) {
      amounts.push(remaining)
      break
    }

    /*
     * Keep enough money for the remaining QR(s).
     *
     * We choose a value between 1000 and 2000,
     * but never greater than the remaining amount.
     */
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
  const [upiId, setUpiId] = useState<string>("")
  const [upiName, setUpiName] = useState<string>("")
  const [ammount, setAmmount] = useState<number>(0)

  const splittedAmmount = useMemo(() => {
    return splitAmount(ammount)
  }, [ammount])

  const handleOnChangeFormValue = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { value, type, name } = e.target

    if (type === "number") {
      setAmmount(Number(value))
    }

    if (type === "text" && name === "upiId") {
      setUpiId(value)
    }

    if (type === "text" && name === "upiName") {
      setUpiName(value)
    }
  }

  return (
    <main className="flex flex-col">

      <form className="flex flex-col w-full px-4 py-2">

        <label htmlFor="upiId">
          UPI ID
        </label>

        <input
          type="text"
          name="upiId"
          value={upiId}
          onChange={handleOnChangeFormValue}
        />

        <label htmlFor="upiName">
          UPI Name
        </label>

        <input
          type="text"
          name="upiName"
          value={upiName}
          onChange={handleOnChangeFormValue}
        />

        <label htmlFor="ammount">
          Amount
        </label>

        <input
          type="number"
          name="ammount"
          min="0"
          step="1"
          value={ammount || ""}
          onChange={handleOnChangeFormValue}
        />

      </form>

      <div className="flex flex-wrap items-center justify-center gap-4 w-full">

        {splittedAmmount.map((amount, index) => (
          <div
            className="flex flex-col justify-center items-center gap-3 mx-5"
            key={`qr_code_${index}_${amount}`}
          >

            <QRCodeCanvas
              value={
                `upi://pay` +
                `?pa=${encodeURIComponent(upiId)}` +
                `&pn=${encodeURIComponent(upiName)}` +
                `&am=${amount}` +
                `&cu=INR`
              }
              size={250}
              level="H"
            />

            <div className="font-mono text-2xl">
              ₹{amount}
            </div>

          </div>
        ))}

      </div>

    </main>
  )
}

export default HOME_PAGE