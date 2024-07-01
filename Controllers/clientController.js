const Client = require("../Models/client");

// Add a new client
exports.addClient = async (req, res) => {
  const { name, address, phone } = req.body;

  try {
    const client = new Client({ name, address, phone });
    await client.save();
    res.status(201).json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an existing client
exports.updateClient = async (req, res) => {
  const { id } = req.params;
  const { name, address, phone } = req.body;

  try {
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    client.name = name || client.name;
    client.address = address || client.address;
    client.phone = phone || client.phone;
    client.product_rates = [];
    await client.save();

    res.status(200).json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addProductRates = async (req, res) => {
  const { id } = req.params;
  const { productId, rate } = req.body;

  try {
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    client.product_rates.push({ productId, rate });
    await client.save();
    res.status(200).json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProductRates = async (req, res) => {
  const { id } = req.params;
  const { productId, rate } = req.body;

  try {
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    console.log(client.product_rates);
    console.log(productId, rate);

    const productRate = client.product_rates.find(
      (productRate) => productRate.productId === productId
    );

    if (!productRate) {
      return res.status(404).json({ message: "Product rate not found" });
    }

    console.log(client);

    await Client.findOneAndUpdate(
      { _id: id, "product_rates.productId": productId },
      { $set: { "product_rates.$.rate": rate } }
    );

    res.status(200).json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getClient = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getClientRates = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(client.product_rates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
