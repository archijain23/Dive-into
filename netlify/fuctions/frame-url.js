const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri, { tls: true, tlsInsecure: false });

exports.handler = async function (event, context) {
  const frameNumber = parseInt(event.queryStringParameters.frameNumber);

  try {
    await client.connect();
    const db = client.db("MarineMinds"); // Replace with your database name
    const collection = db.collection("framePacific_urls"); // Replace with your collection name

    const result = await collection.findOne({ frame_number: frameNumber });

    if (result && result.url) {
      return {
        statusCode: 200,
        body: JSON.stringify({ url: result.url }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Frame not found" }),
      };
    }
  } catch (error) {
    console.error("Error fetching frame URL:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
    };
  } finally {
    await client.close();
  }
};
