export const CalculateMaterialProduction = (data) => {
   let totalMeter = 0;
   let totalKg = 0;
   if (data?.length === 0) return {
      totalMeter: totalMeter,
      totalKg: totalKg
   }

   data.map((item) => {
      // const meter = 0
      if (item?.unit?.toUpperCase() === "KG") {

         totalKg += item?.quantity;
      } else {
         totalMeter += ConvertToMeter(item.unit, item.quantity);
      }
   });
   console.log('LOG-totalCalculation', totalMeter, totalKg)

   return {
      totalMeter: totalMeter,
      totalKg: totalKg
   };
}

// 1 Lembar -> Meter = * 1.5
// 1 Yard -> Meter  = * 0.9144

export const ConvertToMeter = (unit, quantity) => {
   switch (unit.toUpperCase()) {
      case "YARD":
         return quantity * 0.9144;
      case "LEMBAR":
         return quantity * 1.5;
      case "ROLL":
         return quantity * 50;
      default:
         return quantity
         break;
   }
}