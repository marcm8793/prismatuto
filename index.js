const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.use(express.json());

//! Get all users
app.get("/", async (req, res) => {
  const allUsers = await prisma.user.findMany();
  res.json(allUsers);
});

//!Create a user
app.post("/", async (req, res) => {
  const newUser = await prisma.user.create({ data: req.body });
  res.json(newUser);
});

//! Update a user
app.put("/:id", async (req, res) => {
  const id = req.params.id;
  const newAge = req.body.age;
  const updateUser = await prisma.user.update({
    where: { id: parseInt(id) },
    data: { age: newAge },
  });
  res.json(updateUser);
});

//! Delete a user
app.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const deleteUser = await prisma.user.delete({
    where: { id: parseInt(id) },
  });
  res.json(deleteUser);
});

//! Create a house
app.post("/house", async (req, res) => {
  const newHouse = await prisma.house.create({ data: req.body });
  res.json(newHouse);
});

//! Get all houses
app.get("/house", async (req, res) => {
  const allHouses = await prisma.house.findMany({
    include: { owner: true, builtby: true }, //! include the owner and the builder
  });
  res.json(allHouses);
});

//! Get a house by id
app.get("/house/:id", async (req, res) => {
  const id = req.params.id;
  const house = await prisma.house.findUnique({
    where: { id }, //! find the house with the id
    include: { owner: true, builtby: true }, //! include the owner and the builder
  });
  res.json(house);
});

//!Get a house by address
app.get("/house", async (req, res) => {
  const address = req.body.address;
  const house = await prisma.house.findUnique({
    where: { address }, //! find the house with the address
    include: { owner: true, builtby: true }, //! include the owner and the builder
  });
  res.json(house);
});

//! Create many houses
app.post("/house/many", async (req, res) => {
  const newHouses = await prisma.house.createMany({ data: req.body });
  res.json(newHouses);
});

//! Query house with filter
app.get("/house/filter", async (req, res) => {
  const filteredHouses = await prisma.house.findMany({
    where: {
      wifiPassword: {
        //! filter the houses with wifiPassword
        not: null,
      },
      owner: {
        age: {
          gte: 22, //! filter the houses with owner's age greater than or equal to 22
        },
      },
    },
    orderBy: [
      {
        owner: {
          firstName: "desc", //! order the houses by owner's first name in descending order
        },
      },
    ],
    include: {
      owner: true, //! include the owner
      builtby: true, //! include the builder
    },
  });
  res.json(filteredHouses);
});

app.listen(3001, () => console.log("Server is running on port ${3001}"));
