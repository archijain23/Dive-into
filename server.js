if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const { MongoClient } = require("mongodb"); // Import MongoDB client
const app = express();

let port = 3000;
let collection; // Declare the collection variable globally

app.set("view engine", "ejs");

// MongoDB connection URI
const uri = process.env.MONGO_URL;

// Function to connect to MongoDB
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsInsecure: false,
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  } finally {
    await client.close();
  }
}
// Connect to the database when the server starts
connectToDatabase();

// Main route
app.get("/", (req, res) => {
  res.send("You are listening to port 3000");
});

// Route to render EJS template
app.get("/pacific", (req, res) => {
  res.render("index.ejs");
});

// Route to fetch Cloudinary URL from MongoDB
app.get("/api/frame-url/:frameNumber", async (req, res) => {
  const frameNumber = parseInt(req.params.frameNumber);

  try {
    const result = await collection.findOne({ frame_number: frameNumber });

    if (result && result.url) {
      res.json({ url: result.url });
    } else {
      res.status(404).json({ error: "Frame not found" });
    }
  } catch (error) {
    console.error("Error fetching frame URL:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
