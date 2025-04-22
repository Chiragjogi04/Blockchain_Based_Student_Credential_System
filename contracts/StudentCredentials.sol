// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract StudentCredentials {
    struct Credential {
        string studentName;
        string degree;
        string institution;
        uint256 dateIssued;
        address issuedTo;
        bool valid;
    }

    address public admin;
    mapping (uint256 => Credential) public credentials;
    uint256 public credentialCount;

    event CredentialIssued(uint256 indexed credentialId, address indexed issuedTo);
    event CredentialUpdated(uint256 indexed credentialId);
    event CredentialDeleted(uint256 indexed credentialId);

    constructor() {
        admin = msg.sender;
        credentialCount = 0;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function issueCredential(
        string memory _studentName,
        string memory _degree,
        string memory _institution,
        address _issuedTo
    ) public onlyAdmin {
        credentialCount += 1;
        credentials[credentialCount] = Credential({
            studentName: _studentName,
            degree: _degree,
            institution: _institution,
            dateIssued: block.timestamp,
            issuedTo: _issuedTo,
            valid: true
        });
        emit CredentialIssued(credentialCount, _issuedTo);
    }

    function updateCredential(
        uint256 _credentialId,
        string memory _studentName,
        string memory _degree,
        string memory _institution,
        address _issuedTo
    ) public onlyAdmin {
        require(credentials[_credentialId].issuedTo != address(0), "Credential does not exist");
        Credential storage cred = credentials[_credentialId];
        cred.studentName = _studentName;
        cred.degree = _degree;
        cred.institution = _institution;
        cred.issuedTo = _issuedTo;
        cred.dateIssued = block.timestamp;
        emit CredentialUpdated(_credentialId);
    }

    function deleteCredential(uint256 _credentialId) public onlyAdmin {
        require(credentials[_credentialId].issuedTo != address(0), "Credential does not exist");
        delete credentials[_credentialId];
        emit CredentialDeleted(_credentialId);
    }

    function verifyCredential(uint256 _credentialId) public view returns (
        string memory studentName,
        string memory degree,
        string memory institution,
        uint256 dateIssued,
        address issuedTo,
        bool valid
    ) {
        Credential memory cred = credentials[_credentialId];
        return (
            cred.studentName,
            cred.degree,
            cred.institution,
            cred.dateIssued,
            cred.issuedTo,
            cred.valid
        );
    }
}
