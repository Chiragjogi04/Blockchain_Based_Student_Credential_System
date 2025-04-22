const StudentCredentials = artifacts.require("StudentCredentials");

module.exports = function (deployer) {
    deployer.deploy(StudentCredentials);
};
