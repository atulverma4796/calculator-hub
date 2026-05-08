"use client";

import { useState, useMemo } from "react";
import ActionButtons from "@/components/ActionButtons";
import CalculationHistory from "@/components/CalculationHistory";
import InsightCard from "@/components/InsightCard";
import AffiliateCard from "@/components/AffiliateCard";
import { useShareableURL, useInitialParams } from "@/hooks/useShareableURL";
import { useCalcHistory } from "@/hooks/useCalcHistory";
import CalcInput from "@/components/CalcInput";
import VoiceInputButton from "@/components/VoiceInputButton";

type AssetType = "equity" | "mutualfund-equity" | "mutualfund-debt" | "property" | "gold";

interface AssetConfig {
  label: string;
  longTermMonths: number;
  stcgRate: number; // % rate or "slab" sentinel
  stcgIsSlab: boolean;
  ltcgRate: number; // %
  ltcgExemption: number; // ₹
  ltcgUseSlab: boolean;
}

const ASSETS: Record<AssetType, AssetConfig> = {
  equity: {
    label: "Listed Stocks (Equity)",
    longTermMonths: 12,
    stcgRate: 20, // updated to 20% post Budget 2024
    stcgIsSlab: false,
    ltcgRate: 12.5, // updated post Budget 2024
    ltcgExemption: 125000, // ₹1.25 lakh
    ltcgUseSlab: false,
  },
  "mutualfund-equity": {
    label: "Equity Mutual Funds",
    longTermMonths: 12,
    stcgRate: 20,
    stcgIsSlab: false,
    ltcgRate: 12.5,
    ltcgExemption: 125000,
    ltcgUseSlab: false,
  },
  "mutualfund-debt": {
    label: "Debt Mutual Funds (post-Apr 2023)",
    longTermMonths: 36, // legacy classification
    stcgRate: 0,
    stcgIsSlab: true, // taxed at slab rates
    ltcgRate: 0,
    ltcgExemption: 0,
    ltcgUseSlab: true, // also at slab rates now
  },
  property: {
    label: "Real Estate (Property)",
    longTermMonths: 24,
    stcgRate: 0,
    stcgIsSlab: true,
    ltcgRate: 12.5, // simpler regime post Budget 2024 (no indexation)
    ltcgExemption: 0,
    ltcgUseSlab: false,
  },
  gold: {
    label: "Gold / Bullion",
    longTermMonths: 24, // updated post Budget 2024
    stcgRate: 0,
    stcgIsSlab: true,
    ltcgRate: 12.5,
    ltcgExemption: 0,
    ltcgUseSlab: false,
  },
};

function calcSlabTax(income: number, slab: number): number {
  return income * (slab / 100);
}

export default function CapitalGainsCalculator() {
  const { getNumber, getString } = useInitialParams();
  const [purchasePrice, setPurchasePrice] = useState(getNumber("purchasePrice", 200000));
  const [salePrice, setSalePrice] = useState(getNumber("salePrice", 350000));
  const [holdingMonths, setHoldingMonths] = useState(getNumber("holdingMonths", 14));
  const [assetType, setAssetType] = useState<AssetType>(
    (getString("assetType", "equity") as AssetType) in ASSETS
      ? (getString("assetType", "equity") as AssetType)
      : "equity"
  );
  const [taxSlab, setTaxSlab] = useState(getNumber("taxSlab", 30));

  useShareableURL({ purchasePrice, salePrice, holdingMonths, assetType, taxSlab });

  const result = useMemo(() => {
    const cfg = ASSETS[assetType];
    const gain = salePrice - purchasePrice;
    const isLongTerm = holdingMonths >= cfg.longTermMonths;
    let tax = 0;
    let exempt = 0;
    let taxableGain = gain;

    if (gain <= 0) {
      return { gain, tax: 0, exempt: 0, taxableGain: 0, isLongTerm, type: gain < 0 ? "loss" : "none" };
    }

    if (isLongTerm) {
      // LTCG
      if (cfg.ltcgUseSlab) {
        tax = calcSlabTax(gain, taxSlab);
      } else {
        // Apply exemption first
        exempt = Math.min(gain, cfg.ltcgExemption);
        taxableGain = Math.max(0, gain - exempt);
        tax = (taxableGain * cfg.ltcgRate) / 100;
      }
    } else {
      // STCG
      if (cfg.stcgIsSlab) {
        tax = calcSlabTax(gain, taxSlab);
      } else {
        tax = (gain * cfg.stcgRate) / 100;
      }
    }

    // 4% cess
    tax = tax + tax * 0.04;

    return {
      gain,
      tax,
      exempt,
      taxableGain,
      isLongTerm,
      type: isLongTerm ? "ltcg" : "stcg",
    };
  }, [purchasePrice, salePrice, holdingMonths, assetType, taxSlab]);

  const fmtINR = (v: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(v));

  const cfg = ASSETS[assetType];
  const netReturn = result.gain - result.tax;

  useCalcHistory(
    "capital-gains",
    { purchasePrice, salePrice, holdingMonths, assetType, taxSlab },
    `${result.type === "ltcg" ? "LTCG" : "STCG"}: gain ₹${fmtINR(result.gain)}, tax ₹${fmtINR(result.tax)}`,
  );

  return (
    <div className="space-y-8">
      <ActionButtons
        onReset={() => {
          setPurchasePrice(200000);
          setSalePrice(350000);
          setHoldingMonths(14);
          setAssetType("equity");
          setTaxSlab(30);
        }}
        pdfData={{
          calculatorName: "Capital Gains Tax Calculator (India)",
          inputs: [
            { label: "Asset Type", value: cfg.label },
            { label: "Purchase Price", value: `₹${fmtINR(purchasePrice)}` },
            { label: "Sale Price", value: `₹${fmtINR(salePrice)}` },
            { label: "Holding Period", value: `${holdingMonths} months` },
            { label: "Tax Slab (for slab-rate items)", value: `${taxSlab}%` },
          ],
          results: [
            { label: "Total Gain", value: `₹${fmtINR(result.gain)}` },
            { label: "Gain Type", value: result.type === "ltcg" ? "Long-Term (LTCG)" : "Short-Term (STCG)" },
            { label: "Exempt (LTCG basic)", value: `₹${fmtINR(result.exempt)}` },
            { label: "Tax Payable (incl. 4% cess)", value: `₹${fmtINR(result.tax)}` },
            { label: "Net Return After Tax", value: `₹${fmtINR(netReturn)}` },
          ],
          generatedAt: new Date().toLocaleDateString(),
          url: typeof window !== "undefined" ? window.location.href : "",
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 font-medium">
            FY 2025-26 (Budget 2024 rules, effective 23 Jul 2024). Equity STCG 20%, LTCG 12.5% after ₹1.25L exemption. Property/Gold LTCG 12.5% without indexation. Debt MFs (post-1 Apr 2023) always at slab rates. Property bought before 23 Jul 2024 may opt for old 20% LTCG with indexation — this calc uses the new regime.
          </p>

          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Asset Type</label>
            <select value={assetType} onChange={(e) => setAssetType(e.target.value as AssetType)}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent">
              <option value="equity">Listed Stocks (Equity)</option>
              <option value="mutualfund-equity">Equity Mutual Funds</option>
              <option value="mutualfund-debt">Debt Mutual Funds (post-Apr 2023)</option>
              <option value="property">Real Estate (Property)</option>
              <option value="gold">Gold / Bullion</option>
            </select>
            <p className="text-[11px] text-gray-400 mt-1.5">
              Long-term threshold: {cfg.longTermMonths} months. {cfg.stcgIsSlab && cfg.ltcgUseSlab ? "Both STCG & LTCG taxed at your slab rate." : ""}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Purchase Price</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">₹</span>
                <CalcInput value={purchasePrice} onChange={setPurchasePrice} min={0}
                  className="flex-1 text-right text-sm font-bold text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent" />
                <VoiceInputButton onResult={setPurchasePrice} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Sale Price</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">₹</span>
                <CalcInput value={salePrice} onChange={setSalePrice} min={0}
                  className="flex-1 text-right text-sm font-bold text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent" />
                <VoiceInputButton onResult={setSalePrice} />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Holding Period (months)</label>
              <CalcInput value={holdingMonths} onChange={setHoldingMonths} min={0} max={600} step={1}
                className="w-20 text-right text-sm font-bold text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent" />
            </div>
            <input type="range" min={0} max={120} step={1} value={holdingMonths}
              onChange={(e) => setHoldingMonths(Number(e.target.value))} className="w-full" />
            <p className="text-[11px] text-gray-400 mt-1">
              {result.isLongTerm ? `✓ Long-term (≥${cfg.longTermMonths} months)` : `Short-term (<${cfg.longTermMonths} months)`}
            </p>
          </div>

          {((cfg.stcgIsSlab && !result.isLongTerm) || (cfg.ltcgUseSlab && result.isLongTerm)) && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Your Tax Slab (%)</label>
                <CalcInput value={taxSlab} onChange={setTaxSlab} min={0} max={42} step={1}
                  className="w-20 text-right text-sm font-bold text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent" />
              </div>
              <input type="range" min={0} max={42} step={1} value={taxSlab}
                onChange={(e) => setTaxSlab(Number(e.target.value))} className="w-full" />
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gradient-to-br from-fuchsia-600 to-pink-700 rounded-2xl p-6 text-white shadow-xl shadow-fuchsia-200">
            <p className="text-sm font-medium text-fuchsia-100">
              {result.type === "ltcg" ? "Long-Term Capital Gains" : result.type === "stcg" ? "Short-Term Capital Gains" : "No Gain"}
            </p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1">₹{fmtINR(result.gain)}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-fuchsia-100">Tax Payable</p>
                <p className="text-lg font-bold text-amber-300">₹{fmtINR(result.tax)}</p>
              </div>
              <div>
                <p className="text-xs text-fuchsia-100">Net Return</p>
                <p className="text-lg font-bold">₹{fmtINR(netReturn)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm space-y-2">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Breakdown</p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Capital Gain</span>
              <span className="font-semibold">₹{fmtINR(result.gain)}</span>
            </div>
            {result.exempt > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Exempt (LTCG ₹1.25L threshold)</span>
                <span className="font-semibold text-emerald-600">−₹{fmtINR(result.exempt)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Taxable Gain</span>
              <span className="font-semibold">₹{fmtINR(result.taxableGain)}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-100 pt-2">
              <span className="text-gray-600">Tax + 4% Cess</span>
              <span className="font-bold text-fuchsia-700">₹{fmtINR(result.tax)}</span>
            </div>
          </div>
        </div>
      </div>

      <InsightCard
        icon={result.type === "ltcg" ? "📈" : result.type === "loss" ? "📉" : "💡"}
        title="Capital Gains Insight"
        color={result.type === "ltcg" ? "green" : "blue"}
        insight={
          result.type === "loss"
            ? `You incurred a loss of ₹${fmtINR(Math.abs(result.gain))}. ${result.isLongTerm ? "Long-term capital losses can be carried forward 8 years and offset against future LTCG." : "Short-term capital losses can offset both STCG and LTCG."}`
            : result.type === "ltcg"
            ? `Long-term gain of ₹${fmtINR(result.gain)} taxed at the LTCG rate. ${cfg.ltcgExemption > 0 ? `First ₹${fmtINR(cfg.ltcgExemption)} is exempt — that's why your tax is lower than the simple percentage.` : ""} Net return after tax: ₹${fmtINR(netReturn)}.`
            : `Short-term gain of ₹${fmtINR(result.gain)} taxed at ${cfg.stcgIsSlab ? "your income slab" : `${cfg.stcgRate}% (flat)`}. Holding for ${cfg.longTermMonths - holdingMonths} more months would convert this to long-term and likely reduce tax.`
        }
        tip={
          result.type === "stcg" && !cfg.stcgIsSlab
            ? `If you can hold for ${cfg.longTermMonths - holdingMonths} more months, the same gain would be taxed at ${cfg.ltcgRate}% (LTCG) instead of ${cfg.stcgRate}% (STCG).`
            : undefined
        }
      />

      <AffiliateCard type="investment" />

      <CalculationHistory
        calculator="capital-gains"
        onLoad={(inputs) => {
          if (inputs.purchasePrice !== undefined) setPurchasePrice(Number(inputs.purchasePrice));
          if (inputs.salePrice !== undefined) setSalePrice(Number(inputs.salePrice));
          if (inputs.holdingMonths !== undefined) setHoldingMonths(Number(inputs.holdingMonths));
          if (inputs.assetType && (inputs.assetType as string) in ASSETS) setAssetType(inputs.assetType as AssetType);
          if (inputs.taxSlab !== undefined) setTaxSlab(Number(inputs.taxSlab));
        }}
      />
    </div>
  );
}
