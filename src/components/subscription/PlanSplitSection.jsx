import React from 'react';

function PlanSplitSection({
  selectedService,
  selectedPlan,
  setSelectedPlan,
  splitCount,
  setSplitCount,
  calculateSplit,
}) {
  return (
    <div className="transition-opacity duration-500 ease-in-out opacity-100">
      <h2 className="text-2xl font-bold mb-6">Select Plan & Split</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Available Plans</h3>
        <div className="grid gap-3">
          {selectedService.plans.map((plan) => (
            <button
              key={plan.name}
              onClick={() => setSelectedPlan(plan)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                selectedPlan?.name === plan.name
                  ? 'border-[#FF6A00] bg-[#FF6A00]/10'
                  : 'border-[#2A2A2A] hover:border-[#FF6A00]/50'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{plan.name}</span>
                <span className="text-[#FF6A00]">₹{plan.price}/month</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Split Between</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSplitCount(Math.max(2, splitCount - 1))}
            className="p-2 rounded-lg bg-[#2A2A2A] hover:bg-[#FF6A00]/20 transition-colors"
          >
            -
          </button>
          <span className="text-2xl font-bold">{splitCount} people</span>
          <button
            onClick={() => setSplitCount(Math.min(10, splitCount + 1))}
            className="p-2 rounded-lg bg-[#2A2A2A] hover:bg-[#FF6A00]/20 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <div className="bg-[#2A2A2A]/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-[#3A3A3A]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Total Cost</span>
          <span className="text-xl font-bold">₹{selectedPlan?.price}/month</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Your Share</span>
          <span className="text-2xl font-bold text-[#FF6A00]">₹{calculateSplit()}/month</span>
        </div>
      </div>

      <button className="w-full py-3 bg-[#FF6A00] text-[#121212] rounded-xl font-bold hover:bg-[#FF8533] transition duration-300 shadow-lg hover:shadow-[#FF6A00]/25">
        Book Now
      </button>
    </div>
  );
}

export default PlanSplitSection; 