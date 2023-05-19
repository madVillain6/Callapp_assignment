const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const FILE_PATH = path.join(__dirname, "DATA.json");

const app = express();

const port = 3000;

const dataMiddleware = (req, res, next) => {
  fs.readFile("DATA.json", "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading data");
    } else {
      req.fileData = JSON.parse(data);
      next();
    }
  });
};
app.use(dataMiddleware());
app.use(express.json());
app.use(cors());

//GET method

app.get("/api/data", (req, res) => {
  res.json(JSON.parse(req.fileData));
});

//POST method

app.post("/api/data", (req, res) => {
  const newData = req.body;

  const dataArray = JSON.parse(data);
  dataArray.push(newData);

  fs.writeFile(FILE_PATH, JSON.stringify(dataArray), "utf-8", (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error writing Data");
    } else {
      res.send("data added successfully");
    }
  });
});

//put method

app.put("/api/data/:id", (req, res) => {
  const id = Number(req.params.id);

  const updateData = req.body;

  const dataArray = JSON.parse(data);
  const dataIndex = dataArray.findIndex((item) => item.id === id);

  if (dataIndex === -1) {
    res.status(404).send("Data not found");
  } else {
    dataArray[dataIndex] = updateData;

    fs.writeFile(FILE_PATH, JSON.stringify(dataArray), "utf-8", (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error writing data");
      } else {
        res.send("Data updated successfully");
      }
    });
  }
});

app.delete("/api/data/:id", (req, res) => {
  const id = Number(req.params.id);

  const dataArray = JSON.parse(data);
  const dataIndex = dataArray.findIndex((item) => item.id === id);
  if (dataIndex === -1) {
    res.status(404).send("Data not found");
  } else {
    dataArray.splice(dataIndex, 1);

    fs.writeFile(FILE_PATH, JSON.stringify(dataArray), "utf-8", (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error writing data");
      } else {
        res.send("Data deleted successfully");
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
