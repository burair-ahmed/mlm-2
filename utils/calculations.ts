export interface PackageBase {
    _id: string;
    name: string;
    equityUnits: number;
    returnType?: "fixed" | "performance-based" | "both";
    returnPercentage?: number; // For fixed returns
    marketPerformanceFactor?: number; // For performance-based returns
  }
  
  // 🎯 Short-Term Package Calculation
  export interface ShortTermPackage extends PackageBase {
    duration: { value: number; unit: "days" | "weeks" | "months" | "seconds" | "minutes" };
    exitPenalty?: number;
    holdingPeriodCompleted: number;
  }
  
  export const calculateShortTermReturns = (pkg: ShortTermPackage): number => {
    let finalReturn = 0;
  
    if (pkg.returnType === "fixed") {
      finalReturn += pkg.equityUnits * (pkg.returnPercentage || 0.05);
    } else if (pkg.returnType === "performance-based") {
      finalReturn += pkg.equityUnits * (pkg.marketPerformanceFactor || 0.07);
    } else if (pkg.returnType === "both") {
      finalReturn += pkg.equityUnits * (pkg.returnPercentage || 0.05);
      finalReturn += pkg.equityUnits * (pkg.marketPerformanceFactor || 0.07);
    }
  
    if (pkg.holdingPeriodCompleted < pkg.duration.value) {
      finalReturn -= pkg.equityUnits * (pkg.exitPenalty || 0.1);
    }
  
    return finalReturn;
  };
  
  // 🎯 Long-Term Package Calculation
  export interface LongTermPackage extends PackageBase {
    duration: { value: number; unit: "months" | "years" };
    minHoldingPeriod: number;
    holdingPeriodCompleted: number;
  }
  
  export const calculateLongTermReturns = (pkg: LongTermPackage): number => {
    let finalReturn = 0;
  
    if (pkg.returnType === "fixed") {
      finalReturn += pkg.equityUnits * (pkg.returnPercentage || 0.08);
    } else if (pkg.returnType === "performance-based") {
      finalReturn += pkg.equityUnits * (pkg.marketPerformanceFactor || 0.1);
    } else if (pkg.returnType === "both") {
      finalReturn += pkg.equityUnits * (pkg.returnPercentage || 0.08);
      finalReturn += pkg.equityUnits * (pkg.marketPerformanceFactor || 0.1);
    }
  
    if (pkg.holdingPeriodCompleted < pkg.minHoldingPeriod) {
      finalReturn = 0;
    }
  
    return finalReturn;
  };
  
  // 🎯 Trading Package Calculation
  export interface TradingPackage extends PackageBase {
    depreciationModel: "fixed" | "performance-based" | "company-buyback";
    lifespan: number;
    companyBuybackPrice?: number;
  }
  
  export const calculateTradingReturns = (pkg: TradingPackage): number => {
    let finalReturn = pkg.equityUnits;
  
    if (pkg.depreciationModel === "fixed") {
      finalReturn -= pkg.equityUnits * 0.05;
    } else if (pkg.depreciationModel === "performance-based") {
      finalReturn -= pkg.equityUnits * (pkg.marketPerformanceFactor || 0.03);
    } else if (pkg.depreciationModel === "company-buyback") {
      finalReturn = pkg.companyBuybackPrice || 0;
    }
  
    return finalReturn;
  };
  