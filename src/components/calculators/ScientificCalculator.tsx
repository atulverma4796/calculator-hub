"use client";

import { useState, useEffect, useCallback } from "react";
import ActionButtons from "@/components/ActionButtons";

type AngleMode = "DEG" | "RAD";

interface HistoryEntry {
  expression: string;
  result: string;
}

export default function ScientificCalculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [angleMode, setAngleMode] = useState<AngleMode>("DEG");
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [justEvaluated, setJustEvaluated] = useState(false);

  const toRad = useCallback((deg: number) => (deg * Math.PI) / 180, []);
  const fromRad = useCallback((rad: number) => (rad * 180) / Math.PI, []);

  const addToHistory = useCallback((expr: string, res: string) => {
    setHistory((prev) => [{ expression: expr, result: res }, ...prev].slice(0, 5));
  }, []);

  const safeEval = useCallback((expr: string): string => {
    try {
      // Replace display symbols with JS operators
      let parsed = expr
        .replace(/\u00d7/g, "*")
        .replace(/\u00f7/g, "/")
        .replace(/\u03c0/g, String(Math.PI))
        .replace(/e(?![xp])/g, String(Math.E));

      // Handle implicit multiplication: 2sin, 2(, )(, 2pi, etc.
      parsed = parsed.replace(/(\d)([a-zA-Z(])/g, "$1*$2");
      parsed = parsed.replace(/\)(\d)/g, ")*$1");
      parsed = parsed.replace(/\)\(/g, ")*(");

      // Replace scientific functions
      const angleFn = (fn: (x: number) => number) => {
        return (x: number) => fn(angleMode === "DEG" ? toRad(x) : x);
      };
      const invAngleFn = (fn: (x: number) => number) => {
        return (x: number) => {
          const result = fn(x);
          return angleMode === "DEG" ? fromRad(result) : result;
        };
      };

      // Build a safe evaluation context
      const context: Record<string, unknown> = {
        sin: angleFn(Math.sin),
        cos: angleFn(Math.cos),
        tan: angleFn(Math.tan),
        asin: invAngleFn(Math.asin),
        acos: invAngleFn(Math.acos),
        atan: invAngleFn(Math.atan),
        log: Math.log10,
        ln: Math.log,
        sqrt: Math.sqrt,
        abs: Math.abs,
        pow: Math.pow,
        PI: Math.PI,
        E: Math.E,
      };

      // Replace function names with context calls
      parsed = parsed.replace(/sin\(/g, "__sin(");
      parsed = parsed.replace(/cos\(/g, "__cos(");
      parsed = parsed.replace(/tan\(/g, "__tan(");
      parsed = parsed.replace(/asin\(/g, "__asin(");
      parsed = parsed.replace(/acos\(/g, "__acos(");
      parsed = parsed.replace(/atan\(/g, "__atan(");
      parsed = parsed.replace(/log\(/g, "__log(");
      parsed = parsed.replace(/ln\(/g, "__ln(");
      parsed = parsed.replace(/sqrt\(/g, "__sqrt(");
      parsed = parsed.replace(/abs\(/g, "__abs(");

      // Use Function constructor with context
      const fnBody = Object.keys(context)
        .map((k) => `var __${k} = __ctx.${k};`)
        .join("");

      const fn = new Function("__ctx", `${fnBody} return (${parsed});`);
      const result = fn(context);

      if (typeof result !== "number" || !isFinite(result)) {
        return "Error";
      }

      // Format: remove trailing zeros but keep precision
      const formatted = Number(result.toPrecision(12));
      return String(formatted);
    } catch {
      return "Error";
    }
  }, [angleMode, toRad, fromRad]);

  const handleNumber = useCallback((num: string) => {
    if (justEvaluated) {
      setDisplay(num);
      setExpression(num);
      setJustEvaluated(false);
      return;
    }
    if (display === "0" && num !== ".") {
      setDisplay(num);
      setExpression((prev) => (prev === "" || prev === "0" ? num : prev + num));
    } else {
      setDisplay((prev) => prev + num);
      setExpression((prev) => prev + num);
    }
  }, [display, justEvaluated]);

  const handleOperator = useCallback((op: string) => {
    setJustEvaluated(false);
    setDisplay("0");
    setExpression((prev) => {
      const trimmed = prev.trimEnd();
      // Replace last operator if exists
      if (/[+\-\u00d7\u00f7^]$/.test(trimmed)) {
        return trimmed.slice(0, -1) + op;
      }
      return trimmed + op;
    });
  }, []);

  const handleEquals = useCallback(() => {
    if (!expression) return;
    const result = safeEval(expression);
    addToHistory(expression, result);
    setDisplay(result);
    setExpression(result === "Error" ? "" : result);
    setJustEvaluated(true);
  }, [expression, safeEval, addToHistory]);

  const handleClear = useCallback(() => {
    setDisplay("0");
    setExpression("");
    setJustEvaluated(false);
  }, []);

  const handleBackspace = useCallback(() => {
    if (justEvaluated) {
      handleClear();
      return;
    }
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
    setExpression((prev) => (prev.length > 1 ? prev.slice(0, -1) : ""));
  }, [justEvaluated, handleClear]);

  const handleFunction = useCallback((fn: string) => {
    const current = display === "0" ? "" : display;
    if (justEvaluated) {
      // Apply function to the result
      const newExpr = `${fn}(${expression})`;
      setExpression(newExpr);
      setDisplay(`${fn}(${display})`);
      setJustEvaluated(false);
      return;
    }
    setExpression((prev) => prev + `${fn}(`);
    setDisplay((prev) => (prev === "0" ? `${fn}(` : prev + `${fn}(`));
    setJustEvaluated(false);
  }, [display, expression, justEvaluated]);

  const handleSpecial = useCallback((action: string) => {
    switch (action) {
      case "pi":
        if (justEvaluated) {
          setDisplay("\u03c0");
          setExpression("\u03c0");
          setJustEvaluated(false);
        } else {
          setDisplay((prev) => (prev === "0" ? "\u03c0" : prev + "\u03c0"));
          setExpression((prev) => prev + "\u03c0");
        }
        break;
      case "e":
        if (justEvaluated) {
          setDisplay(String(Math.E));
          setExpression(String(Math.E));
          setJustEvaluated(false);
        } else {
          setDisplay((prev) => (prev === "0" ? "e" : prev + "e"));
          setExpression((prev) => prev + String(Math.E));
        }
        break;
      case "square": {
        const val = safeEval(expression || display);
        if (val !== "Error") {
          const newExpr = `(${expression || display})*(${expression || display})`;
          const result = safeEval(newExpr);
          addToHistory(`(${expression || display})\u00b2`, result);
          setDisplay(result);
          setExpression(result);
          setJustEvaluated(true);
        }
        break;
      }
      case "reciprocal": {
        const val = safeEval(expression || display);
        if (val !== "Error" && Number(val) !== 0) {
          const result = String(1 / Number(val));
          addToHistory(`1/(${expression || display})`, result);
          setDisplay(result);
          setExpression(result);
          setJustEvaluated(true);
        }
        break;
      }
      case "negate": {
        if (display !== "0") {
          if (display.startsWith("-")) {
            setDisplay(display.slice(1));
            setExpression((prev) => prev.startsWith("(-") ? prev.slice(2, -1) : prev);
          } else {
            setDisplay("-" + display);
            setExpression((prev) => `(-${prev || display})`);
          }
        }
        break;
      }
      case "percent": {
        const val = safeEval(expression || display);
        if (val !== "Error") {
          const result = String(Number(val) / 100);
          setDisplay(result);
          setExpression(result);
          setJustEvaluated(true);
        }
        break;
      }
      case "openParen":
        setDisplay((prev) => (prev === "0" ? "(" : prev + "("));
        setExpression((prev) => prev + "(");
        setJustEvaluated(false);
        break;
      case "closeParen":
        setDisplay((prev) => prev + ")");
        setExpression((prev) => prev + ")");
        setJustEvaluated(false);
        break;
      case "power":
        handleOperator("^");
        break;
    }
  }, [display, expression, justEvaluated, safeEval, addToHistory, handleOperator]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture if user is typing in another input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key;
      if (/^[0-9]$/.test(key)) { handleNumber(key); e.preventDefault(); }
      else if (key === ".") { handleNumber("."); e.preventDefault(); }
      else if (key === "+") { handleOperator("+"); e.preventDefault(); }
      else if (key === "-") { handleOperator("-"); e.preventDefault(); }
      else if (key === "*") { handleOperator("\u00d7"); e.preventDefault(); }
      else if (key === "/") { handleOperator("\u00f7"); e.preventDefault(); }
      else if (key === "Enter" || key === "=") { handleEquals(); e.preventDefault(); }
      else if (key === "Escape") { handleClear(); e.preventDefault(); }
      else if (key === "Backspace") { handleBackspace(); e.preventDefault(); }
      else if (key === "(") { handleSpecial("openParen"); e.preventDefault(); }
      else if (key === ")") { handleSpecial("closeParen"); e.preventDefault(); }
      else if (key === "^") { handleSpecial("power"); e.preventDefault(); }
      else if (key === "%") { handleSpecial("percent"); e.preventDefault(); }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNumber, handleOperator, handleEquals, handleClear, handleBackspace, handleSpecial]);

  const btnBase = "flex items-center justify-center rounded-xl font-semibold transition-all active:scale-95 select-none text-sm sm:text-base";
  const btnNum = `${btnBase} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 h-12 sm:h-14`;
  const btnOp = `${btnBase} bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 h-12 sm:h-14`;
  const btnFn = `${btnBase} bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 h-12 sm:h-14 text-xs sm:text-sm`;
  const btnAction = `${btnBase} bg-rose-500 dark:bg-rose-600 text-white hover:bg-rose-600 dark:hover:bg-rose-700 h-12 sm:h-14`;
  const btnEquals = `${btnBase} bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 h-12 sm:h-14 text-lg font-bold`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ActionButtons
        onReset={handleClear}
        pdfData={{
          calculatorName: "Scientific Calculator",
          inputs: history.map((h, i) => ({ label: `Calc ${i + 1}`, value: `${h.expression} = ${h.result}` })),
          results: [],
          generatedAt: new Date().toLocaleDateString(),
          url: typeof window !== "undefined" ? window.location.href : "",
        }}
      />

      {/* Display */}
      <div className="bg-gray-900 dark:bg-black rounded-2xl p-5 sm:p-6 shadow-xl border border-gray-800 dark:border-gray-700">
        <div className="text-right">
          <div className="text-sm text-gray-400 dark:text-gray-500 font-mono h-6 truncate">
            {expression || "\u00a0"}
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono mt-1 truncate">
            {display}
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <button
            type="button"
            onClick={() => setAngleMode((m) => (m === "DEG" ? "RAD" : "DEG"))}
            className="px-3 py-1 text-xs font-bold rounded-lg bg-gray-800 dark:bg-gray-700 text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            {angleMode}
          </button>
          {memory !== 0 && (
            <span className="text-xs text-amber-400 font-mono">M = {memory}</span>
          )}
        </div>
      </div>

      {/* Button Grid */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 sm:p-4 shadow-sm">
        {/* Scientific functions panel — collapses to 4 cols on mobile */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
          <button type="button" className={btnFn} onClick={() => setMemory(0)}>MC</button>
          <button type="button" className={btnFn} onClick={() => setMemory((m) => m + Number(safeEval(expression || display) || 0))}>M+</button>
          <button type="button" className={btnFn} onClick={() => setMemory((m) => m - Number(safeEval(expression || display) || 0))}>M-</button>
          <button type="button" className={btnFn} onClick={() => { setDisplay(String(memory)); setExpression(String(memory)); setJustEvaluated(false); }}>MR</button>
          <button type="button" className={btnAction} onClick={handleClear}>C</button>
          <button type="button" className={`${btnBase} bg-orange-100 dark:bg-orange-900/40 border border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300 hover:bg-orange-200 h-12 sm:h-14`} onClick={handleBackspace}>&larr;</button>
          <button type="button" className={btnFn} onClick={() => handleSpecial("openParen")}>(</button>
          <button type="button" className={btnFn} onClick={() => handleSpecial("closeParen")}>)</button>
        </div>

        {/* Scientific functions */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
          <button type="button" className={btnFn} onClick={() => handleFunction("sin")}>sin</button>
          <button type="button" className={btnFn} onClick={() => handleFunction("cos")}>cos</button>
          <button type="button" className={btnFn} onClick={() => handleFunction("tan")}>tan</button>
          <button type="button" className={btnFn} onClick={() => handleFunction("log")}>log</button>
          <button type="button" className={btnFn} onClick={() => handleFunction("ln")}>ln</button>
          <button type="button" className={btnFn} onClick={() => handleFunction("sqrt")}>&radic;</button>
          <button type="button" className={btnFn} onClick={() => handleSpecial("square")}>x&sup2;</button>
          <button type="button" className={btnFn} onClick={() => handleSpecial("power")}>x<sup>y</sup></button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
          <button type="button" className={btnFn} onClick={() => handleFunction("asin")}>sin<sup>-1</sup></button>
          <button type="button" className={btnFn} onClick={() => handleFunction("acos")}>cos<sup>-1</sup></button>
          <button type="button" className={btnFn} onClick={() => handleFunction("atan")}>tan<sup>-1</sup></button>
          <button type="button" className={btnFn} onClick={() => handleSpecial("pi")}>&pi;</button>
          <button type="button" className={btnFn} onClick={() => handleSpecial("e")}>e</button>
          <button type="button" className={btnFn} onClick={() => handleSpecial("percent")}>%</button>
          <button type="button" className={btnFn} onClick={() => handleSpecial("reciprocal")}>1/x</button>
          <button type="button" className={btnFn} onClick={() => handleSpecial("negate")}>+/-</button>
        </div>

        {/* Number pad — always 4 columns */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
          <button type="button" className={btnNum} onClick={() => handleNumber("7")}>7</button>
          <button type="button" className={btnNum} onClick={() => handleNumber("8")}>8</button>
          <button type="button" className={btnNum} onClick={() => handleNumber("9")}>9</button>
          <button type="button" className={btnOp} onClick={() => handleOperator("\u00d7")}>&times;</button>
        </div>

        <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
          <button type="button" className={btnNum} onClick={() => handleNumber("4")}>4</button>
          <button type="button" className={btnNum} onClick={() => handleNumber("5")}>5</button>
          <button type="button" className={btnNum} onClick={() => handleNumber("6")}>6</button>
          <button type="button" className={btnOp} onClick={() => handleOperator("\u00f7")}>&divide;</button>
        </div>

        <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
          <button type="button" className={btnNum} onClick={() => handleNumber("1")}>1</button>
          <button type="button" className={btnNum} onClick={() => handleNumber("2")}>2</button>
          <button type="button" className={btnNum} onClick={() => handleNumber("3")}>3</button>
          <button type="button" className={btnOp} onClick={() => handleOperator("+")}>+</button>
        </div>

        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          <button type="button" className={`${btnNum} col-span-2`} onClick={() => handleNumber("0")}>0</button>
          <button type="button" className={btnNum} onClick={() => handleNumber(".")}>.</button>
          <button type="button" className={btnOp} onClick={() => handleOperator("-")}>&minus;</button>
        </div>

        {/* Equals button - full width */}
        <div className="mt-1.5 sm:mt-2">
          <button type="button" className={`${btnEquals} w-full`} onClick={handleEquals}>=</button>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">Recent Calculations</h3>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => {
                  setDisplay(h.result);
                  setExpression(h.result);
                  setJustEvaluated(true);
                }}
              >
                <span className="text-sm text-gray-600 dark:text-gray-400 font-mono truncate">{h.expression}</span>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100 font-mono ml-3">= {h.result}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
