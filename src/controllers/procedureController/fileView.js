const { sequelize } = require("../../config/dbConnect");

const getActionTypeAnalytics = async (req, res) => {
  const procedureName = "GetActionTypeAnalytics";

  const actionTypes = [
    "Company-Search",
    "Company-Click",
    "View-Page",
    "Job-Click",
    "Job-Application",
    "Service-Click",
    "Job-Search",
    "Service-Search",
  ];

  try {
    // Collect results for each action type
    const results = await Promise.all(
      actionTypes.map(async (type) => {
        try {
          const result = await sequelize.query(
            `CALL ${procedureName}(:actionType)`,
            {
              replacements: { actionType: type },
            }
          );
          return { actionType: type, result };
        } catch (queryError) {
          console.error(`Error processing action type ${type}:`, queryError);
          return { actionType: type, error: queryError.message };
        }
      })
    );

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching action type analytics:", error);
    res.status(500).json({
      message: "Failed to fetch action type analytics.",
      error: error.message,
    });
  }
};

const deviceTracking = async (req, res) => {
  const procedureName = "DeviceTracking";
  const tableName = "device_logs";

  try {
    const [results] = await sequelize.query(`CALL ${procedureName}()`);

    if (!results || results.length === 0) {
      res.status(200).json({ message: "No device tracking data found." });
      return;
    }

    const formattedResults = results.map((result) => ({
      Platform: result.Platform,
      Count: result.Count,
    }));

    res.status(200).json(formattedResults);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching device tracking data",
      error: error.message,
    });
  }
};

module.exports = {
  getActionTypeAnalytics,
  deviceTracking,
};