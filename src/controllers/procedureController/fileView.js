const { sequelize } = require("../../config/dbConnect");

const getActionTypeAnalytics = async (req, res) => {
  const procedureName = "GetActionTypeAnalytics";

  const actionTypes = [
    "Company-Search",
    "company-Click",
    "View-Page",
    "Job-Click",
    "Job-Application",
    "Service-Click",
    "Job-Search",
    "View Page",
    "Service-Search",
  ];

  try {
    // Collect results for each action type
    const results = await Promise.all(
      actionTypes.map(async (type) => {
        const result = await sequelize.query(
          `CALL ${procedureName}(:actionType)`,
          {
            replacements: { actionType: type },
          }
        );
        return { actionType: type, result };
      })
    );

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deviceTracking = async (req, res) => {
  const procedureName = "DeviceTracking";

  try {
    const results = await sequelize.query(`CALL ${procedureName}()`);

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  getActionTypeAnalytics,
  deviceTracking,
};
