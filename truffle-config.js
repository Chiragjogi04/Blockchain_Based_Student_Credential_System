module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Your Ganache host
      port: 7545,        // Ganache default port
      network_id: "*",   // Match any network id
    },
  },
  compilers: {
    solc: {
      version: "0.8.19", // Use the same version as specified in your Solidity file
    },
  },
};
