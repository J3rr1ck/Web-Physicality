"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"

export function CalculatorApp() {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? num : display + num)
    }
  }

  const inputOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue
      case "-":
        return firstValue - secondValue
      case "×":
        return firstValue * secondValue
      case "÷":
        return firstValue / secondValue
      case "=":
        return secondValue
      default:
        return secondValue
    }
  }

  const performCalculation = () => {
    const inputValue = Number.parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const clear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const aiCalculate = () => {
    // Simulate AI-powered calculation
    const expressions = ["π × 2", "√144", "2³", "sin(30°)", "log(100)"]
    const randomExpression = expressions[Math.floor(Math.random() * expressions.length)]
    setDisplay(randomExpression)

    setTimeout(() => {
      const results = ["6.283", "12", "8", "0.5", "2"]
      const result = results[expressions.indexOf(randomExpression)]
      setDisplay(result)
    }, 1000)
  }

  const buttonClass =
    "h-16 text-lg font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
  const numberButtonClass = `${buttonClass} bg-white/10 hover:bg-white/20 text-white border border-white/20`
  const operatorButtonClass = `${buttonClass} bg-blue-500/80 hover:bg-blue-500 text-white`
  const specialButtonClass = `${buttonClass} bg-orange-500/80 hover:bg-orange-500 text-white`

  return (
    <div className="h-full p-6 bg-black/20">
      <div className="max-w-sm mx-auto">
        {/* Display */}
        <div className="mb-6 p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm">
          <div className="text-right">
            <div className="text-3xl font-mono text-white break-all">{display}</div>
            {operation && previousValue !== null && (
              <div className="text-sm text-white/60 mt-1">
                {previousValue} {operation}
              </div>
            )}
          </div>
        </div>

        {/* AI Button */}
        <div className="mb-4">
          <Button
            onClick={aiCalculate}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white h-12 rounded-xl"
          >
            <Zap className="w-4 h-4 mr-2" />
            AI Calculate
          </Button>
        </div>

        {/* Button Grid */}
        <div className="grid grid-cols-4 gap-3">
          <Button onClick={clear} className={`${specialButtonClass} col-span-2`}>
            Clear
          </Button>
          <Button onClick={() => inputOperation("÷")} className={operatorButtonClass}>
            ÷
          </Button>
          <Button onClick={() => inputOperation("×")} className={operatorButtonClass}>
            ×
          </Button>

          <Button onClick={() => inputNumber("7")} className={numberButtonClass}>
            7
          </Button>
          <Button onClick={() => inputNumber("8")} className={numberButtonClass}>
            8
          </Button>
          <Button onClick={() => inputNumber("9")} className={numberButtonClass}>
            9
          </Button>
          <Button onClick={() => inputOperation("-")} className={operatorButtonClass}>
            -
          </Button>

          <Button onClick={() => inputNumber("4")} className={numberButtonClass}>
            4
          </Button>
          <Button onClick={() => inputNumber("5")} className={numberButtonClass}>
            5
          </Button>
          <Button onClick={() => inputNumber("6")} className={numberButtonClass}>
            6
          </Button>
          <Button onClick={() => inputOperation("+")} className={operatorButtonClass}>
            +
          </Button>

          <Button onClick={() => inputNumber("1")} className={numberButtonClass}>
            1
          </Button>
          <Button onClick={() => inputNumber("2")} className={numberButtonClass}>
            2
          </Button>
          <Button onClick={() => inputNumber("3")} className={numberButtonClass}>
            3
          </Button>
          <Button onClick={performCalculation} className={`${specialButtonClass} row-span-2`}>
            =
          </Button>

          <Button onClick={() => inputNumber("0")} className={`${numberButtonClass} col-span-2`}>
            0
          </Button>
          <Button onClick={() => inputNumber(".")} className={numberButtonClass}>
            .
          </Button>
        </div>
      </div>
    </div>
  )
}
