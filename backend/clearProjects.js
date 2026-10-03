const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const Project = require('./src/models/Project');

dotenv.config();

const clearProjects = async () => {
  try {
    await connectDB();
    const result = await Project.deleteMany({});
    console.log(`Successfully removed ${result.deletedCount} projects from the database.`);
    process.exit(0);
  } catch (error) {
    console.error(`Error clearing projects: ${error.message}`);
    process.exit(1);
  }
};

clearProjects();
