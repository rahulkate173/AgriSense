export const calculatePesticide = (req, res) => {
  try {
    const { area, pesticideRate, sprayVolume, tankSize } = req.body;

    // Validation
    if (!area || area <= 0 || !pesticideRate || pesticideRate <= 0 || !sprayVolume || sprayVolume <= 0 || !tankSize || tankSize <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input. Please provide positive numbers for area, pesticideRate, sprayVolume, and tankSize.'
      });
    }

    // Computations
    const totalPesticide = area * pesticideRate;
    const pesticidePerTank = (tankSize / sprayVolume) * pesticideRate;
    const numberOfTanks = (area * sprayVolume) / tankSize;
    const totalWater = area * sprayVolume;

    // Formatting Output
    const results = {
      totalPesticide: totalPesticide.toFixed(2),
      pesticidePerTank: pesticidePerTank.toFixed(2),
      numberOfTanks: numberOfTanks.toFixed(2),
      totalWater: totalWater.toFixed(2)
    };

    return res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Calculation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error processing the calculation.'
    });
  }
};
