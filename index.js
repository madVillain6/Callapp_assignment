const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");

const port = 3000;

app.use(express.json());
app.use(cors());

//GET method

app.get("/api/data", (req, res) => {
  fs.readFile("DATA.json", "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading data");
    } else {
      res.json(JSON.parse(data));
    }
  });
});

//POST method

app.post("/api/data", (req, res) => {
  const newData = req.body;

  fs.readFile("DATA.json", "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading data");
    } else {
      const dataArray = JSON.parse(data);
      dataArray.push(newData);

      fs.writeFile("DATA.json", JSON.stringify(dataArray), "utf-8", (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error writing Data");
        } else {
          res.send("data added successfully");
        }
      });
    }
  });
});

app.put("/api/data/:id", (req, res) => {
  const id = req.params.id;
  const updateData = req.body;

  fs.readFile("DATA.json", "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading data");
    } else {
      const dataArray = JSON.parse(data);
      const dataIndex = dataArray.findIndex((item) => item.id === id);

      if (dataIndex === -1) {
        res.status(404).send("Data not found");
      } else {
        dataArray[dataIndex] = updateData;

        fs.writeFile("DATA.json", JSON.stringify(dataArray), "utf-8", (err) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error writing data");
          } else {
            res.send("data updated successfully");
          }
        });
      }
    }
  });
});

app.delete("/api/data/:id", (req, res) => {
  const id = Number(req.params.id);

  fs.readFile("DATA.json", "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading data");
    } else {
      const dataArray = JSON.parse(data);
      const dataIndex = dataArray.findIndex((item) => item.id === id);
      if (dataIndex === -1) {
        res.status(404).send("Data not found");
      } else {
        dataArray.splice(dataIndex, 1);

        fs.writeFile("DATA.json", JSON.stringify(dataArray), "utf-8", (err) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error writing data");
          } else {
            res.send("Data deleted successfully");
          }
        });
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
