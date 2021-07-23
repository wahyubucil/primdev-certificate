// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CertificateManager is Ownable {
    struct Certificate {
        // User provided data
        string name;
        uint256 expiredAt;
        bytes32[] participants;
        // System provided data
        uint256 createdAt;
        State state;
        bytes32 metadataHash;
        bytes32 participantsHash;
    }

    enum State {
        None,
        Created,
        Updated,
        Revoked
    }

    enum Validity {
        Valid,
        Revoked,
        Expired,
        Invalid
    }

    mapping(uint256 => Certificate) certificates;

    event CertificateState(
        uint256 id,
        State state,
        bytes32 metadataHash,
        bytes32 participantsHash
    );

    function create(
        uint256 _id,
        string memory _name,
        uint256 _expiredAt,
        bytes32[] memory _participants
    ) public onlyOwner {
        require(certificates[_id].state == State.None, "ID already used");

        require(
            _expiredAt == 0 || _expiredAt > block.timestamp,
            "Expired Time invalid"
        );

        bytes32 metadataHash = keccak256(abi.encodePacked(_name, _expiredAt));
        bytes32 participantsHash = keccak256(abi.encodePacked(_participants));

        Certificate memory certificate = Certificate(
            _name,
            _expiredAt,
            _participants,
            block.timestamp,
            State.Created,
            metadataHash,
            participantsHash
        );
        certificates[_id] = certificate;

        emit CertificateState(
            _id,
            State.Created,
            metadataHash,
            participantsHash
        );
    }

    modifier onlyActiveState(uint256 _id) {
        require(
            certificates[_id].state == State.Created ||
                certificates[_id].state == State.Updated,
            "Unavailable or revoked certificate "
        );
        _;
    }

    function updateMetadata(
        uint256 _id,
        string memory _name,
        uint256 _expiredAt
    ) public onlyOwner onlyActiveState(_id) {
        require(
            _expiredAt == 0 || _expiredAt > certificates[_id].createdAt,
            "Expired Time invalid"
        );

        bytes32 metadataHash = keccak256(abi.encodePacked(_name, _expiredAt));

        certificates[_id].state = State.Updated;
        certificates[_id].name = _name;
        certificates[_id].expiredAt = _expiredAt;
        certificates[_id].metadataHash = metadataHash;

        emit CertificateState(
            _id,
            State.Updated,
            metadataHash,
            certificates[_id].participantsHash
        );
    }

    function updateParticipants(uint256 _id, bytes32[] memory _participants)
        public
        onlyOwner
        onlyActiveState(_id)
    {
        bytes32 participantsHash = keccak256(abi.encodePacked(_participants));

        certificates[_id].state = State.Updated;
        certificates[_id].participants = _participants;
        certificates[_id].participantsHash = participantsHash;

        emit CertificateState(
            _id,
            State.Updated,
            certificates[_id].metadataHash,
            participantsHash
        );
    }

    function update(
        uint256 _id,
        string memory _name,
        uint256 _expiredAt,
        bytes32[] memory _participants
    ) public onlyOwner onlyActiveState(_id) {
        require(
            _expiredAt == 0 || _expiredAt > certificates[_id].createdAt,
            "Expired Time invalid"
        );

        bytes32 metadataHash = keccak256(abi.encodePacked(_name, _expiredAt));
        bytes32 participantsHash = keccak256(abi.encodePacked(_participants));

        certificates[_id].state = State.Updated;
        certificates[_id].name = _name;
        certificates[_id].expiredAt = _expiredAt;
        certificates[_id].metadataHash = metadataHash;
        certificates[_id].participants = _participants;
        certificates[_id].participantsHash = participantsHash;

        emit CertificateState(
            _id,
            State.Updated,
            metadataHash,
            participantsHash
        );
    }

    function revoke(uint256 _id) public onlyOwner onlyActiveState(_id) {
        certificates[_id].state = State.Revoked;

        emit CertificateState(
            _id,
            State.Revoked,
            certificates[_id].metadataHash,
            certificates[_id].participantsHash
        );
    }

    modifier onlyAvailable(uint256 _id) {
        require(
            certificates[_id].state != State.None,
            "Unavailable certificate"
        );
        _;
    }

    function remove(uint256 _id) public onlyOwner onlyAvailable(_id) {
        delete certificates[_id];
    }

    function getParticipants(uint256 _id)
        public
        view
        onlyAvailable(_id)
        returns (bytes32[] memory)
    {
        return certificates[_id].participants;
    }

    function checkValidity(uint256 _id, string memory _name)
        public
        view
        onlyAvailable(_id)
        returns (Validity)
    {
        Certificate memory certificate = certificates[_id];

        if (certificate.state == State.Revoked) return Validity.Revoked;

        if (
            certificate.expiredAt > 0 && block.timestamp > certificate.expiredAt
        ) return Validity.Expired;

        bytes32 nameHash = keccak256(abi.encodePacked(_name));
        for (uint256 i = 0; i < certificate.participants.length; i++) {
            if (nameHash == certificate.participants[i]) return Validity.Valid;
        }

        return Validity.Invalid;
    }
}
