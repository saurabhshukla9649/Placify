require('dotenv').config({ path: '.env.local' });
const { conductMockInterview } = require('./src/ai/flows/conduct-mock-interview');

async function test() {
  try {
    const res = await conductMockInterview({
      jobRole: "Software Engineer",
      history: []
    });
    console.log("SUCCESS:", res);
  } catch (err) {
    console.error("FULL ERROR:", JSON.stringify(err, null, 2));
    console.error(err);
  }
}
test();
